import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, Edit, Trash2, CreditCard, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

const typeLabels: Record<string, string> = {
  entrada: "Entrada",
  saida: "Saída",
};

const paymentMethodLabels: Record<string, string> = {
  dinheiro: "Dinheiro",
  cartao_credito: "Cartão Crédito",
  cartao_debito: "Cartão Débito",
  pix: "PIX",
  boleto: "Boleto",
  outro: "Outro",
};

export default function Caixa() {
  const { isAuthenticated } = useAuth();
  const { data: transactions, isLoading } = trpc.cashTransactions.list.useQuery(
    { limit: 50, offset: 0 },
    { enabled: isAuthenticated }
  );

  const [showForm, setShowForm] = useState(false);

  // Calcular totais
  const totals = transactions?.reduce(
    (acc, tx) => {
      if (tx.type === "entrada") {
        acc.entrada += tx.amount || 0;
      } else {
        acc.saida += tx.amount || 0;
      }
      return acc;
    },
    { entrada: 0, saida: 0 }
  ) || { entrada: 0, saida: 0 };

  const saldo = totals.entrada - totals.saida;

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-accent" />
              Controle de Caixa
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie entradas e saídas de caixa
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent hover:bg-accent/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {(totals.entrada / 100).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                R$ {(totals.saida / 100).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
              <CreditCard className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  saldo >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                R$ {(saldo / 100).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transações Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>
              {isLoading ? "Carregando..." : `${transactions?.length || 0} transações`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Carregando transações...</div>
            ) : transactions && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Método de Pagamento</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="text-sm">
                          {new Date(tx.transactionDate).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              tx.type === "entrada"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {typeLabels[tx.type]}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{tx.category}</TableCell>
                        <TableCell className="font-semibold">
                          {tx.type === "entrada" ? "+" : "-"} R${" "}
                          {((tx.amount || 0) / 100).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {paymentMethodLabels[tx.paymentMethod || "outro"] ||
                            tx.paymentMethod}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {tx.description || "-"}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-accent hover:bg-accent/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma transação registrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

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
import { Plus, Edit, Trash2, ShoppingCart, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";

const paymentMethodLabels: Record<string, string> = {
  dinheiro: "Dinheiro",
  cartao_credito: "Cartão Crédito",
  cartao_debito: "Cartão Débito",
  pix: "PIX",
  boleto: "Boleto",
  outro: "Outro",
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export default function Vendas() {
  const { isAuthenticated } = useAuth();
  const { data: sales, isLoading } = trpc.sales.list.useQuery(
    { limit: 50, offset: 0 },
    { enabled: isAuthenticated }
  );

  const [showForm, setShowForm] = useState(false);

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
              <ShoppingCart className="h-8 w-8 text-accent" />
              Vendas
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas vendas e transações
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent hover:bg-accent/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </div>

        {/* Vendas Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>
              {isLoading ? "Carregando..." : `${sales?.length || 0} vendas`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Carregando vendas...</div>
            ) : sales && sales.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Desconto</TableHead>
                      <TableHead>Método de Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">#{sale.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {new Date(sale.saleDate).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          R$ {((sale.totalAmount || 0) / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {sale.discount && sale.discount > 0
                            ? `R$ ${(sale.discount / 100).toFixed(2)}`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-sm bg-muted">
                            {paymentMethodLabels[sale.paymentMethod || "outro"] || sale.paymentMethod}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              sale.status === "concluida"
                                ? "bg-green-100 text-green-800"
                                : sale.status === "pendente"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {statusLabels[sale.status || "concluida"] || sale.status}
                          </span>
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
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma venda registrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

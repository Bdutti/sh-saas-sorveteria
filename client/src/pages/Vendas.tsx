import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { SaleForm } from "@/components/SaleForm";
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
  credito: "Cartão Crédito",
  debito: "Cartão Débito",
  pix: "PIX",
  boleto: "Boleto",
};

const statusLabels: Record<string, string> = {
  pendente: "Pendente",
  concluida: "Concluída",
  cancelada: "Cancelada",
};

export default function Vendas() {
  const { isAuthenticated } = useAuth();
  const { data: sales, isLoading, refetch } = trpc.sales.list.useQuery(
    { limit: 50, offset: 0 },
    { enabled: isAuthenticated }
  );

  const [showForm, setShowForm] = useState(false);

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSuccess = () => {
    refetch();
  };

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

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
              Registre e acompanhe suas vendas
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-accent hover:bg-accent/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Venda
          </Button>
        </div>

        {/* Resumo de Vendas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                Total de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sales?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Últimas 50 vendas
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-accent" />
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(
                  sales?.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0) || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                De todas as vendas
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" />
                Ticket Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(
                  sales && sales.length > 0
                    ? sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0) / sales.length
                    : 0
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor médio por venda
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Vendas */}
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
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Desconto</TableHead>
                      <TableHead>Método de Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">#{sale.id}</TableCell>
                        <TableCell className="text-sm">
                          {sale.customerId || "-"}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatPrice(sale.totalAmount || 0)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {sale.discount ? formatPrice(sale.discount) : "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {paymentMethodLabels[sale.paymentMethod || ""] || sale.paymentMethod}
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
                            {statusLabels[sale.status || ""] || sale.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
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

      {/* Formulário Modal */}
      <SaleForm
        open={showForm}
        onOpenChange={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </DashboardLayout>
  );
}

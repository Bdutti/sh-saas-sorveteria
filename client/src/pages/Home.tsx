import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { trpc } from "@/lib/trpc";
import { DollarSign, ShoppingCart, Users, AlertCircle, TrendingUp } from "lucide-react";

const COLORS = ["#3b82f6", "#1e40af", "#1e3a8a", "#0c4a6e"];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: overview, isLoading } = trpc.dashboard.overview.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">ERP SaaS</h1>
            <p className="text-muted-foreground">Sorveteria & Açougue</p>
          </div>
          <p className="text-lg text-foreground">
            Gerencie seu negócio com elegância e profissionalismo
          </p>
          <Button size="lg" className="w-full bg-accent hover:bg-accent/90">
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bem-vindo, {user?.name || "Usuário"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está um resumo do seu negócio
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total de Vendas */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : overview?.totalSales || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Carregando..." : "+0% desde o mês anterior"}
              </p>
            </CardContent>
          </Card>

          {/* Receita Total */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : `R$ ${((overview?.totalRevenue || 0) / 100).toFixed(2)}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Carregando..." : "+0% desde o mês anterior"}
              </p>
            </CardContent>
          </Card>

          {/* Total de Clientes */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : overview?.totalCustomers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Carregando..." : "+0% desde o mês anterior"}
              </p>
            </CardContent>
          </Card>

          {/* Alertas de Estoque */}
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas de Estoque</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : overview?.lowStockProducts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Carregando..." : "Produtos com estoque baixo"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendas por Mês */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Vendas por Mês</CardTitle>
              <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { name: "Jan", vendas: 400 },
                  { name: "Fev", vendas: 300 },
                  { name: "Mar", vendas: 200 },
                  { name: "Abr", vendas: 278 },
                  { name: "Mai", vendas: 189 },
                  { name: "Jun", vendas: 239 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="vendas"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ fill: "var(--accent)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição de Vendas */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Distribuição de Vendas</CardTitle>
              <CardDescription>Por método de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Dinheiro", value: 400 },
                      { name: "Cartão Crédito", value: 300 },
                      { name: "PIX", value: 200 },
                      { name: "Outros", value: 100 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="var(--accent)"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse as funcionalidades principais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex flex-col items-center justify-center py-6">
                <ShoppingCart className="h-6 w-6 mb-2 text-accent" />
                <span className="text-sm">Nova Venda</span>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col items-center justify-center py-6">
                <Users className="h-6 w-6 mb-2 text-accent" />
                <span className="text-sm">Novo Cliente</span>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col items-center justify-center py-6">
                <TrendingUp className="h-6 w-6 mb-2 text-accent" />
                <span className="text-sm">Relatórios</span>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col items-center justify-center py-6">
                <AlertCircle className="h-6 w-6 mb-2 text-accent" />
                <span className="text-sm">Alertas</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

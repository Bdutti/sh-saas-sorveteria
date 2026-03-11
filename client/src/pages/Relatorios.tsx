import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, Download, Filter } from "lucide-react";

const chartData = [
  { mes: "Jan", vendas: 4000, receita: 2400, lucro: 1600 },
  { mes: "Fev", vendas: 3000, receita: 1398, lucro: 1602 },
  { mes: "Mar", vendas: 2000, receita: 9800, lucro: 8000 },
  { mes: "Abr", vendas: 2780, receita: 3908, lucro: 3128 },
  { mes: "Mai", vendas: 1890, receita: 4800, lucro: 2910 },
  { mes: "Jun", vendas: 2390, receita: 3800, lucro: 1410 },
];

export default function Relatorios() {
  const { isAuthenticated } = useAuth();

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
              <BarChart3 className="h-8 w-8 text-accent" />
              Relatórios
            </h1>
            <p className="text-muted-foreground mt-1">
              Análise completa do seu negócio
            </p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrar
            </Button>
            <Button className="bg-accent hover:bg-accent/90 gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Gráfico de Vendas e Receita */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Vendas e Receita</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
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
                <Line
                  type="monotone"
                  dataKey="receita"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Lucro */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Análise de Lucro</CardTitle>
            <CardDescription>Margem de lucro por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="lucro"
                  fill="var(--accent)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

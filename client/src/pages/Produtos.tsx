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
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useState } from "react";

export default function Produtos() {
  const { isAuthenticated } = useAuth();
  const { data: products, isLoading } = trpc.products.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

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
              <Package className="h-8 w-8 text-accent" />
              Produtos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seu catálogo de produtos
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent hover:bg-accent/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {/* Produtos Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
            <CardDescription>
              {isLoading ? "Carregando..." : `${products?.length || 0} produtos`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Carregando produtos...</div>
            ) : products && products.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Mín.</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku || "-"}</TableCell>
                        <TableCell>
                          R$ {((product.price || 0) / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              product.stock! <= product.minStock!
                                ? "bg-destructive/10 text-destructive"
                                : "bg-accent/10 text-accent"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>{product.minStock}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              product.active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.active ? "Ativo" : "Inativo"}
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
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum produto cadastrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

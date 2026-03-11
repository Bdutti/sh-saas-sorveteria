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
import { Plus, Edit, Trash2, Users, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function Clientes() {
  const { isAuthenticated } = useAuth();
  const { data: customers, isLoading } = trpc.customers.list.useQuery(undefined, {
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
              <Users className="h-8 w-8 text-accent" />
              Clientes
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seu relacionamento com clientes
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent hover:bg-accent/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Clientes Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>
              {isLoading ? "Carregando..." : `${customers?.length || 0} clientes`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Carregando clientes...</div>
            ) : customers && customers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          {customer.email ? (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {customer.email}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {customer.phone ? (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {customer.phone}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {customer.city ? (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {customer.city}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
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
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum cliente cadastrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

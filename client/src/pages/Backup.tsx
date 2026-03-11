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
import { Download, Database, Plus, Trash2 } from "lucide-react";

export default function Backup() {
  const { isAuthenticated } = useAuth();
  const { data: backups, isLoading } = trpc.backups.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Database className="h-8 w-8 text-accent" />
              Backup de Dados
            </h1>
            <p className="text-muted-foreground mt-1">
              Faça backup e restaure seus dados com segurança
            </p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 gap-2">
            <Plus className="h-4 w-4" />
            Novo Backup
          </Button>
        </div>

        {/* Informações de Backup */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Informações de Backup</CardTitle>
            <CardDescription>
              Último backup automático: há 2 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Backup Automático</p>
                  <p className="text-sm text-muted-foreground">
                    Realizado diariamente às 23:00
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Retenção de Backups</p>
                  <p className="text-sm text-muted-foreground">
                    Últimos 30 dias
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Backups */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Histórico de Backups</CardTitle>
            <CardDescription>
              {isLoading ? "Carregando..." : `${backups?.length || 0} backups`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Carregando backups...</div>
            ) : backups && backups.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Arquivo</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell className="font-medium">
                          {backup.fileName}
                        </TableCell>
                        <TableCell>
                          {formatFileSize(backup.fileSize || 0)}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-sm bg-muted">
                            {backup.backupType === "manual"
                              ? "Manual"
                              : "Automático"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(backup.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                            {backup.status === "completed"
                              ? "Concluído"
                              : "Pendente"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-accent hover:bg-accent/10"
                          >
                            <Download className="h-4 w-4" />
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
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum backup disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

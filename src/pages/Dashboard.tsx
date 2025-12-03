import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MessageSquare, Users, Star, Loader2, Activity, CheckCircle, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { getApiUrl } from "@/lib/api-config";
import { DashboardMetrics } from "@/types";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HealthStatus {
  status: "UP" | "DOWN" | "UNKNOWN";
}

const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCompanies: 0,
    totalUsers: 0,
    totalFeedbacks: 0,
    averageRating: 0,
    attendanceHistory: []
  });
  const [healthStatus, setHealthStatus] = useState<HealthStatus["status"]>("UNKNOWN");
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);
  
  const { toast } = useToast();

  const chartData = metrics.attendanceHistory?.map(item => ({
    ...item,
    displayDate: format(parseISO(item.date), "dd/MM", { locale: ptBR })
  })) || [];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/dashboard/metrics`, {
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        } else {
          console.error("Falha ao carregar métricas do dashboard. Status:", response.status);
          if (response.status === 403 || response.status === 401) {
             toast({
                title: "Sessão Expirada",
                description: "Por favor, faça login novamente.",
                variant: "destructive",
             });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar métricas:", error);
        toast({
          title: "Erro de Conexão",
          description: "Não foi possível conectar ao servidor.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, [toast]);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/actuator/health`);
        if (response.ok) {
          const data = await response.json();
          setHealthStatus(data.status === "UP" ? "UP" : "DOWN");
        } else {
          setHealthStatus("DOWN");
        }
      } catch (error) {
        console.error("Erro ao verificar health:", error);
        setHealthStatus("DOWN");
      } finally {
        setIsLoadingHealth(false);
      }
    };

    checkHealth();
    const intervalId = setInterval(checkHealth, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do sistema DeneasyBot</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoadingMetrics ? <Loader2 className="h-4 w-4 animate-spin" /> : metrics.totalCompanies}
              </div>
              <p className="text-xs text-muted-foreground">Empresas ativas na plataforma</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-info">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoadingMetrics ? <Loader2 className="h-4 w-4 animate-spin" /> : metrics.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">Usuários vinculados às empresas</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedbacks Recebidos</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoadingMetrics ? <Loader2 className="h-4 w-4 animate-spin" /> : metrics.totalFeedbacks}
              </div>
              <p className="text-xs text-muted-foreground">Solicitações e avaliações</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Avaliação</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoadingMetrics ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  metrics.averageRating ? Number(metrics.averageRating).toFixed(1) : "0.0"
                )}
              </div>
              <p className="text-xs text-muted-foreground">Nota média geral</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Atendimentos Avaliados</CardTitle>
              <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
            </CardHeader>
            <CardContent>
              {isLoadingMetrics ? (
                 <div className="flex h-[300px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                        dataKey="displayDate" 
                        stroke="hsl(var(--foreground))" 
                        fontSize={12}
                        tickMargin={10}
                    />
                    <YAxis stroke="hsl(var(--foreground))" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Avaliações"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1 flex flex-col justify-center items-center p-6">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl font-semibold flex items-center gap-2 justify-center">
                <Activity className="h-6 w-6" />
                Status do Bot
              </CardTitle>
              <p className="text-sm text-muted-foreground">Monitoramento em tempo real</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pt-4">
              {isLoadingHealth ? (
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              ) : healthStatus === "UP" ? (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 animate-pulse" />
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-lg px-6 py-2">
                    Operante
                  </Badge>
                  <p className="text-sm text-muted-foreground">Todos os sistemas funcionais</p>
                </>
              ) : (
                <>
                  <XCircle className="h-16 w-16 text-red-500" />
                  <Badge variant="destructive" className="text-lg px-6 py-2">
                    Offline
                  </Badge>
                  <p className="text-sm text-destructive font-medium">Verifique a conexão com o servidor</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
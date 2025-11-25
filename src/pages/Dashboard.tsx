import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDashboardMetrics } from "@/data/mockData";
import { Building2, MessageSquare, Users, Star, Loader2, Activity, CheckCircle, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

// Interface para a resposta da API
interface DashboardMetricsResponse {
  totalCompanies: number;
  totalEmployees: number;
  totalFeedbacks: number;
  averageRating: number;
}

interface HealthStatus {
  status: "UP" | "DOWN" | "UNKNOWN";
}

const Dashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsResponse>({
    totalCompanies: 0,
    totalEmployees: 0,
    totalFeedbacks: 0,
    averageRating: 0,
  });
  const [healthStatus, setHealthStatus] = useState<HealthStatus["status"]>("UNKNOWN");
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);
  
  const { toast } = useToast();

  // Dados mockados para o gráfico de linha (conforme requisito)
  const { customerServiceData } = mockDashboardMetrics;

  // Busca Métricas do Dashboard
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/dashboard/metrics", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        } else {
          console.error("Falha ao carregar métricas do dashboard");
        }
      } catch (error) {
        console.error("Erro ao buscar métricas:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as métricas do dashboard.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, [toast]);

  // Polling para Status do Bot (/actuator/health)
  useEffect(() => {
    const checkHealth = async () => {
      try {
        // /actuator/health geralmente é público, mas se precisar de auth, adicione os headers
        const response = await fetch("/actuator/health");
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

    // Chama imediatamente
    checkHealth();

    // Configura intervalo de 60 segundos
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

        {/* KPIs Grid - Dados Reais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total de Empresas */}
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

          {/* Total de Funcionários */}
          <Card className="border-l-4 border-l-info">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {isLoadingMetrics ? <Loader2 className="h-4 w-4 animate-spin" /> : metrics.totalEmployees}
              </div>
              <p className="text-xs text-muted-foreground">Usuários vinculados às empresas</p>
            </CardContent>
          </Card>

          {/* Feedbacks Recebidos */}
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

          {/* Média de Avaliação */}
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

        {/* Charts & Status Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Gráfico de Linha (Mockado) */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Atendimentos Finalizados</CardTitle>
              <p className="text-sm text-muted-foreground">Últimos 7 dias (Simulação)</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerServiceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Novo Widget: Status do Bot */}
          <Card className="col-span-1 flex flex-col justify-center items-center p-6">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl font-semibold flex items-center gap-2 justify-center">
                <Activity className="h-6 w-6" />
                Status do Bot
              </CardTitle>
              <p className="text-sm text-muted-foreground">Monitoramento em tempo real (/actuator/health)</p>
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
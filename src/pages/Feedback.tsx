import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Calendar, Star } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { getApiUrl } from "@/lib/api-config";

interface WishlistDTO {
  id: number;
  content: string;
  createdAt: string;
  userName: string;
  companyName: string;
}

interface EvaluationDTO {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  userName: string;
  companyName: string;
}

const Feedback = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistDTO[]>([]);
  const [evaluationItems, setEvaluationItems] = useState<EvaluationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        };

        const [resWishlist, resEvaluation] = await Promise.all([
          fetch(`${getApiUrl()}/feedback/wishlist`, { headers }),
          fetch(`${getApiUrl()}/feedback/evaluation`, { headers }),
        ]);

        if (resWishlist.ok) {
          const data = await resWishlist.json();
          setWishlistItems(data);
        } else {
            console.error("Falha ao carregar wishlist");
        }

        if (resEvaluation.ok) {
          const data = await resEvaluation.json();
          setEvaluationItems(data);
        } else {
            console.error("Falha ao carregar evaluations");
        }

      } catch (error) {
        console.error("Erro ao carregar feedbacks:", error);
        toast({
            title: "Erro de conexão",
            description: "Não foi possível carregar os feedbacks.",
            variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-warning text-warning"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Central de Feedback</h2>
          <p className="text-muted-foreground">
            Acompanhe solicitações de funcionalidades e avaliações de atendimento
          </p>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Carregando dados...</div>
        ) : (
          <Tabs defaultValue="features" className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-1 h-auto sm:grid-cols-2">
              <TabsTrigger value="features">Solicitações de Funcionalidades</TabsTrigger>
              <TabsTrigger value="evaluations">Avaliações de Atendimento</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-4">
              {wishlistItems.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma solicitação encontrada.</p>
              )}
              {wishlistItems.map((feedback) => (
                <Card key={feedback.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <CardTitle className="text-base font-medium">
                        Solicitação de Funcionalidade
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0 w-fit">
                        <Calendar className="mr-1 h-3 w-3" />
                        {feedback.createdAt 
                          ? format(new Date(feedback.createdAt), "dd MMM yyyy", { locale: ptBR })
                          : "-"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {feedback.content}
                    </p>
                    <div className="flex flex-col gap-2 rounded-lg border bg-muted/50 p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground truncate">
                          {feedback.companyName || "Empresa Desconhecida"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground truncate">
                          Gestor: {feedback.userName || "—"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="evaluations" className="space-y-4">
              {evaluationItems.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma avaliação encontrada.</p>
              )}
              {evaluationItems.map((evaluation) => (
                <Card key={evaluation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="text-base font-medium">
                          Avaliação de Atendimento
                        </CardTitle>
                        {evaluation.rating > 0 && (
                          <div className="flex items-center gap-2">
                            {renderStars(evaluation.rating)}
                            <span className="text-sm font-medium text-foreground">
                              {evaluation.rating}/5
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="shrink-0 w-fit">
                        <Calendar className="mr-1 h-3 w-3" />
                        {evaluation.createdAt 
                          ? format(new Date(evaluation.createdAt), "dd MMM yyyy", { locale: ptBR }) 
                          : "-"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      {evaluation.content}
                    </p>
                    <div className="flex flex-col gap-2 rounded-lg border bg-muted/50 p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground truncate">
                          {evaluation.companyName || "Empresa Desconhecida"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground truncate">
                          Gestor: {evaluation.userName || "—"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
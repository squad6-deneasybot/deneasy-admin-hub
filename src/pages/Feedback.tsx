import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockInitialFeedback, mockServiceEvaluations } from "@/data/mockData";
import { Building2, User, Calendar, Star } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Feedback = () => {
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

        <Tabs defaultValue="features" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="features">Solicitações de Funcionalidades</TabsTrigger>
            <TabsTrigger value="evaluations">Avaliações de Atendimento</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-4">
            {mockInitialFeedback.map((feedback) => (
              <Card key={feedback.feedback_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-base font-medium">
                      Solicitação de Funcionalidade
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(new Date(feedback.created_at), "dd MMM yyyy", { locale: ptBR })}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {feedback.content}
                  </p>
                  <div className="flex flex-col gap-2 rounded-lg border bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {feedback.company.company_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Gestor: {feedback.company.manager?.name || "—"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="evaluations" className="space-y-4">
            {mockServiceEvaluations.map((evaluation) => (
              <Card key={evaluation.evaluation_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <CardTitle className="text-base font-medium">
                        Avaliação de Atendimento
                      </CardTitle>
                      {evaluation.rating && (
                        <div className="flex items-center gap-2">
                          {renderStars(evaluation.rating)}
                          <span className="text-sm font-medium text-foreground">
                            {evaluation.rating}/5
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(new Date(evaluation.created_at), "dd MMM yyyy", { locale: ptBR })}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {evaluation.content}
                  </p>
                  <div className="flex flex-col gap-2 rounded-lg border bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {evaluation.company.company_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Gestor: {evaluation.company.manager?.name || "—"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;

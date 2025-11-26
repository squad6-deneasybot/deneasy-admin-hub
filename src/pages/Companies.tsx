import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, MoreVertical, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:8080";

interface Company {
  id: number;
  companyName: string;
  appKey: string;
  appSecret: string;
  managerId?: number;
  managerName?: string;
  managerEmail?: string;
  managerPhone?: string;
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const [companyFormData, setCompanyFormData] = useState({
    companyName: "",
    appKey: "",
    appSecret: "",
  });
  
  const [managerFormData, setManagerFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  const { toast } = useToast();

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token não encontrado no localStorage");
        return;
      }

      console.log("Buscando empresas em:", `${API_BASE_URL}/company`);
      
      const response = await fetch(`${API_BASE_URL}/company`, {
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Empresas carregadas:", data);
        setCompanies(data);
      } else {
        const errorText = await response.text();
        console.error("Erro API:", response.status, errorText);
        throw new Error(`Falha: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro fetch:", error);
      toast({
        title: "Erro de Conexão",
        description: "Verifique se o backend está rodando na porta 8080.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const resetForms = () => {
    setCompanyFormData({ companyName: "", appKey: "", appSecret: "" });
    setManagerFormData({ name: "", email: "", phone: "" });
  };

  const handleAdd = async () => {
    if (!companyFormData.companyName || !companyFormData.appKey || !companyFormData.appSecret ||
        !managerFormData.name || !managerFormData.email || !managerFormData.phone) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const companyRes = await fetch(`${API_BASE_URL}/company`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(companyFormData)
      });

      if (!companyRes.ok) {
        const err = await companyRes.json().catch(() => ({ message: "Erro desconhecido" }));
        throw new Error(err.message || "Erro ao criar empresa");
      }

      const createdCompany = await companyRes.json();
      
      const userPayload = {
        ...managerFormData,
        companyId: createdCompany.id
      };

      const userRes = await fetch(`${API_BASE_URL}/user/manager`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(userPayload)
      });

      if (!userRes.ok) {
        throw new Error("Empresa criada, mas falha ao criar gestor.");
      }

      toast({ title: "Sucesso", description: "Empresa e Gestor cadastrados!" });
      setIsAddDialogOpen(false);
      resetForms();
      fetchCompanies();

    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedCompany) return;
    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const companyRes = await fetch(`${API_BASE_URL}/company/${selectedCompany.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(companyFormData)
      });

      if (!companyRes.ok) throw new Error("Erro ao atualizar empresa");

      if (selectedCompany.managerId) {
        await fetch(`${API_BASE_URL}/user/manager/${selectedCompany.managerId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ ...managerFormData, companyId: selectedCompany.id })
        });
      } else {
        await fetch(`${API_BASE_URL}/user/manager`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ ...managerFormData, companyId: selectedCompany.id })
        });
      }

      toast({ title: "Atualizado", description: "Dados salvos com sucesso." });
      setIsEditDialogOpen(false);
      resetForms();
      fetchCompanies();

    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;
    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/company/${selectedCompany.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Erro ao remover empresa");

      toast({ title: "Removido", description: "Empresa excluída com sucesso." });
      setIsDeleteDialogOpen(false);
      fetchCompanies();

    } catch (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setCompanyFormData({
      companyName: company.companyName,
      appKey: company.appKey,
      appSecret: company.appSecret,
    });
    setManagerFormData({
      name: company.managerName || "",
      email: company.managerEmail || "",
      phone: company.managerPhone || "",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Empresas</h2>
            <p className="text-sm text-muted-foreground sm:text-base">Gerencie as empresas clientes do DeneasyBot</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Empresa
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>
        ) : (
          <>
            <div className="hidden md:block rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Empresa</TableHead>
                    <TableHead>Nome do Gestor</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.companyName}</TableCell>
                      <TableCell>{company.managerName || "—"}</TableCell>
                      <TableCell>{company.managerPhone || "—"}</TableCell>
                      <TableCell>{company.managerEmail || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(company)} className="gap-2">
                            <Edit className="h-4 w-4" /> Editar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => { setSelectedCompany(company); setIsDeleteDialogOpen(true); }} className="gap-2">
                            <Trash2 className="h-4 w-4" /> Remover
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {companies.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhuma empresa cadastrada.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-4 md:hidden">
              {companies.map((company) => (
                <Card key={company.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 bg-muted/20 p-4">
                    <CardTitle className="text-base font-semibold line-clamp-1">
                      {company.companyName}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(company)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedCompany(company); setIsDeleteDialogOpen(true); }} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="p-4 pt-3 space-y-3">
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase">Gestor</span>
                      <div className="text-sm font-medium">{company.managerName || "—"}</div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase">Contato</span>
                        <div className="text-sm">{company.managerPhone || "—"}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
            if (!open) { setIsAddDialogOpen(false); setIsEditDialogOpen(false); setSelectedCompany(null); resetForms(); }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditDialogOpen ? "Editar Empresa" : "Nova Empresa e Gestor"}</DialogTitle>
              <DialogDescription>Preencha os dados de integração e do responsável.</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados da Empresa</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome da Empresa *</Label>
                    <Input value={companyFormData.companyName} onChange={(e) => setCompanyFormData({...companyFormData, companyName: e.target.value})} placeholder="Ex: Tech Solutions" />
                  </div>
                  <div className="space-y-2">
                    <Label>App Key (ERP) *</Label>
                    <Input type="password" value={companyFormData.appKey} onChange={(e) => setCompanyFormData({...companyFormData, appKey: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>App Secret (ERP) *</Label>
                    <Input type="password" value={companyFormData.appSecret} onChange={(e) => setCompanyFormData({...companyFormData, appSecret: e.target.value})} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dados do Gestor</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome Completo *</Label>
                    <Input value={managerFormData.name} onChange={(e) => setManagerFormData({...managerFormData, name: e.target.value})} placeholder="Carlos Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" value={managerFormData.email} onChange={(e) => setManagerFormData({...managerFormData, email: e.target.value})} placeholder="carlos@empresa.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone (WhatsApp) *</Label>
                    <Input type="tel" value={managerFormData.phone} onChange={(e) => setManagerFormData({...managerFormData, phone: e.target.value})} placeholder="5511999999999" />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setIsEditDialogOpen(false); }} disabled={isProcessing}>Cancelar</Button>
              <Button onClick={isEditDialogOpen ? handleEdit : handleAdd} disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditDialogOpen ? "Salvar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover "{selectedCompany?.companyName}"? 
                Esta ação removerá também o gestor e todos os funcionários vinculados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isProcessing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remover"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Companies;
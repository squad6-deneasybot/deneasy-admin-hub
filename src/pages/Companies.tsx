import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { mockCompanies, mockUsers } from "@/data/mockData";
import { Company, User } from "@/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  // Formulário dividido em duas seções
  const [companyFormData, setCompanyFormData] = useState({
    company_name: "",
    appKey: "",
    appSecret: "",
  });
  
  const [managerFormData, setManagerFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  const { toast } = useToast();

  const resetForms = () => {
    setCompanyFormData({ company_name: "", appKey: "", appSecret: "" });
    setManagerFormData({ name: "", email: "", phone: "" });
  };

  const handleAdd = () => {
    // Validação
    if (!companyFormData.company_name || !companyFormData.appKey || !companyFormData.appSecret) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos da empresa.",
        variant: "destructive",
      });
      return;
    }

    if (!managerFormData.name || !managerFormData.email || !managerFormData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos do gestor.",
        variant: "destructive",
      });
      return;
    }

    // Simulação de API: POST /company
    const newCompanyId = Math.random().toString(36).substring(7);
    
    // Simulação de API: POST /user
    const newManager: User = {
      user_id: Math.random().toString(36).substring(7),
      ...managerFormData,
      profile: "MANAGER",
      company_id: newCompanyId,
    };

    const newCompany: Company = {
      company_id: newCompanyId,
      ...companyFormData,
      manager: newManager,
    };

    setUsers([...users, newManager]);
    setCompanies([...companies, newCompany]);
    setIsAddDialogOpen(false);
    resetForms();
    
    toast({
      title: "Empresa e Gestor cadastrados!",
      description: "A empresa e o gestor foram cadastrados com sucesso.",
    });
  };

  const handleEdit = () => {
    if (!selectedCompany) return;

    // Validação
    if (!companyFormData.company_name || !companyFormData.appKey || !companyFormData.appSecret) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos da empresa.",
        variant: "destructive",
      });
      return;
    }

    if (!managerFormData.name || !managerFormData.email || !managerFormData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos do gestor.",
        variant: "destructive",
      });
      return;
    }

    // Simulação de API: PUT /company/:id e PUT /user/:id
    const updatedCompanies = companies.map((company) => {
      if (company.company_id === selectedCompany.company_id) {
        const updatedManager: User = {
          ...company.manager!,
          ...managerFormData,
        };
        
        // Atualizar também na lista de users
        setUsers(users.map(u => 
          u.user_id === updatedManager.user_id ? updatedManager : u
        ));

        return {
          ...company,
          ...companyFormData,
          manager: updatedManager,
        };
      }
      return company;
    });

    setCompanies(updatedCompanies);
    setIsEditDialogOpen(false);
    setSelectedCompany(null);
    resetForms();
    
    toast({
      title: "Empresa atualizada!",
      description: "As informações da empresa e do gestor foram salvas com sucesso.",
    });
  };

  const handleDelete = () => {
    if (!selectedCompany) return;

    // Simulação de API: DELETE /company/:id (cascade para user)
    const updatedCompanies = companies.filter(
      (company) => company.company_id !== selectedCompany.company_id
    );
    
    const updatedUsers = users.filter(
      (user) => user.company_id !== selectedCompany.company_id
    );

    setCompanies(updatedCompanies);
    setUsers(updatedUsers);
    setIsDeleteDialogOpen(false);
    setSelectedCompany(null);
    
    toast({
      title: "Empresa removida!",
      description: "A empresa e o gestor associado foram excluídos do sistema.",
    });
  };

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setCompanyFormData({
      company_name: company.company_name,
      appKey: company.appKey,
      appSecret: company.appSecret,
    });
    setManagerFormData({
      name: company.manager?.name || "",
      email: company.manager?.email || "",
      phone: company.manager?.phone || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Empresas</h2>
            <p className="text-muted-foreground">Gerencie as empresas clientes do DeneasyBot</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Nova Empresa
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>Nome do Gestor</TableHead>
                <TableHead>Contato do Gestor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.company_id}>
                  <TableCell className="font-medium">{company.company_name}</TableCell>
                  <TableCell>{company.manager?.name || "—"}</TableCell>
                  <TableCell>{company.manager?.phone || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(company)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(company)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remover
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog 
          open={isAddDialogOpen || isEditDialogOpen} 
          onOpenChange={(open) => {
            if (!open) {
              setIsAddDialogOpen(false);
              setIsEditDialogOpen(false);
              setSelectedCompany(null);
              resetForms();
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditDialogOpen ? "Editar Empresa e Gestor" : "Cadastrar Nova Empresa e Gestor"}
              </DialogTitle>
              <DialogDescription>
                {isEditDialogOpen 
                  ? "Atualize as informações da empresa e do gestor principal"
                  : "Preencha os dados da empresa e do gestor principal"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Seção 1: Dados da Empresa */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Dados da Empresa</h3>
                  <p className="text-sm text-muted-foreground">Informações e credenciais do ERP</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa *</Label>
                    <Input
                      id="company-name"
                      placeholder="Ex: TechFlow Solutions"
                      value={companyFormData.company_name}
                      onChange={(e) =>
                        setCompanyFormData({ ...companyFormData, company_name: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="app-key">App Key (ERP) *</Label>
                    <Input
                      id="app-key"
                      type="password"
                      placeholder="Ex: tfsk_prod_abc123xyz789"
                      value={companyFormData.appKey}
                      onChange={(e) =>
                        setCompanyFormData({ ...companyFormData, appKey: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="app-secret">App Secret (ERP) *</Label>
                    <Input
                      id="app-secret"
                      type="password"
                      placeholder="Ex: tfss_prod_secret_key_456def"
                      value={companyFormData.appSecret}
                      onChange={(e) =>
                        setCompanyFormData({ ...companyFormData, appSecret: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Seção 2: Dados do Gestor */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Dados do Gestor Principal</h3>
                  <p className="text-sm text-muted-foreground">Informações de contato do responsável</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager-name">Nome Completo (Gestor) *</Label>
                    <Input
                      id="manager-name"
                      placeholder="Ex: Carlos Silva"
                      value={managerFormData.name}
                      onChange={(e) =>
                        setManagerFormData({ ...managerFormData, name: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manager-email">Email (Gestor) *</Label>
                    <Input
                      id="manager-email"
                      type="email"
                      placeholder="Ex: carlos.silva@empresa.com"
                      value={managerFormData.email}
                      onChange={(e) =>
                        setManagerFormData({ ...managerFormData, email: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manager-phone">Telefone (Gestor) *</Label>
                    <Input
                      id="manager-phone"
                      type="tel"
                      placeholder="Ex: +55 11 98765-4321"
                      value={managerFormData.phone}
                      onChange={(e) =>
                        setManagerFormData({ ...managerFormData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsEditDialogOpen(false);
                  setSelectedCompany(null);
                  resetForms();
                }}
              >
                Cancelar
              </Button>
              <Button onClick={isEditDialogOpen ? handleEdit : handleAdd}>
                {isEditDialogOpen ? "Salvar Alterações" : "Cadastrar Empresa e Gestor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover a empresa "{selectedCompany?.company_name}"?
                Esta ação também removerá o gestor associado e não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remover Empresa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Companies;

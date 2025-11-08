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
import { mockCompanies } from "@/data/mockData";
import { Company } from "@/types";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    manager_name: "",
    manager_contact: "",
  });
  const { toast } = useToast();

  const handleAdd = () => {
    if (!formData.company_name || !formData.manager_name || !formData.manager_contact) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const newCompany: Company = {
      company_id: Math.random().toString(36).substring(7),
      ...formData,
    };

    setCompanies([...companies, newCompany]);
    setIsAddDialogOpen(false);
    setFormData({ company_name: "", manager_name: "", manager_contact: "" });
    toast({
      title: "Empresa adicionada!",
      description: "A empresa foi cadastrada com sucesso.",
    });
  };

  const handleEdit = () => {
    if (!selectedCompany) return;

    if (!formData.company_name || !formData.manager_name || !formData.manager_contact) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const updatedCompanies = companies.map((company) =>
      company.company_id === selectedCompany.company_id
        ? { ...company, ...formData }
        : company
    );

    setCompanies(updatedCompanies);
    setIsEditDialogOpen(false);
    setSelectedCompany(null);
    setFormData({ company_name: "", manager_name: "", manager_contact: "" });
    toast({
      title: "Empresa atualizada!",
      description: "As informações foram salvas com sucesso.",
    });
  };

  const handleDelete = () => {
    if (!selectedCompany) return;

    const updatedCompanies = companies.filter(
      (company) => company.company_id !== selectedCompany.company_id
    );

    setCompanies(updatedCompanies);
    setIsDeleteDialogOpen(false);
    setSelectedCompany(null);
    toast({
      title: "Empresa removida!",
      description: "A empresa foi excluída do sistema.",
    });
  };

  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      company_name: company.company_name,
      manager_name: company.manager_name,
      manager_contact: company.manager_contact,
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
                  <TableCell>{company.manager_name}</TableCell>
                  <TableCell>{company.manager_contact}</TableCell>
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

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha os dados da nova empresa cliente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-company-name">Nome da Empresa</Label>
                <Input
                  id="add-company-name"
                  placeholder="Ex: TechFlow Solutions"
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-manager-name">Nome do Gestor</Label>
                <Input
                  id="add-manager-name"
                  placeholder="Ex: Carlos Silva"
                  value={formData.manager_name}
                  onChange={(e) =>
                    setFormData({ ...formData, manager_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-manager-contact">Contato do Gestor</Label>
                <Input
                  id="add-manager-contact"
                  placeholder="Ex: +55 11 98765-4321"
                  value={formData.manager_contact}
                  onChange={(e) =>
                    setFormData({ ...formData, manager_contact: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd}>Adicionar Empresa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Empresa</DialogTitle>
              <DialogDescription>
                Atualize as informações da empresa
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-company-name">Nome da Empresa</Label>
                <Input
                  id="edit-company-name"
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manager-name">Nome do Gestor</Label>
                <Input
                  id="edit-manager-name"
                  value={formData.manager_name}
                  onChange={(e) =>
                    setFormData({ ...formData, manager_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manager-contact">Contato do Gestor</Label>
                <Input
                  id="edit-manager-contact"
                  value={formData.manager_contact}
                  onChange={(e) =>
                    setFormData({ ...formData, manager_contact: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEdit}>Salvar Alterações</Button>
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
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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

export interface SuperAdmin {
  admin_id: string;
  name: string;
  email: string;
  password: string;
}

export interface Company {
  company_id: string;
  company_name: string;
  manager_name: string;
  manager_contact: string;
}

export interface InitialFeedback {
  feedback_id: string;
  content: string;
  created_at: string;
  company: Company;
}

export interface ServiceEvaluation {
  evaluation_id: string;
  content: string;
  rating?: number;
  created_at: string;
  company: Company;
}

export interface DashboardMetrics {
  totalCompanies: number;
  totalFeedbacks: number;
  customerServiceData: { date: string; count: number }[];
  systemHealthData: { name: string; value: number }[];
}

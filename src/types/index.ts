export interface SuperAdmin {
  admin_id: string;
  name: string;
  email: string;
  password: string;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  profile: "MANAGER" | "EMPLOYEE";
  company_id: string;
}

export interface Company {
  company_id: string;
  company_name: string;
  appKey: string;
  appSecret: string;
  manager?: User;
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
  totalUsers: number;
  totalFeedbacks: number;
  averageRating: number;
  attendanceHistory: { date: string; count: number }[];
}

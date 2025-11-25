import { Company, User, DashboardMetrics } from "@/types";

export const mockUsers: User[] = [
  {
    user_id: "u1",
    name: "Carlos Silva",
    email: "carlos.silva@techflow.com",
    phone: "+55 11 98765-4321",
    profile: "MANAGER",
    company_id: "1",
  },
  {
    user_id: "u2",
    name: "Ana Rodrigues",
    email: "ana.rodrigues@innovacorp.com.br",
    phone: "+55 21 97654-3210",
    profile: "MANAGER",
    company_id: "2",
  },
  {
    user_id: "u3",
    name: "Pedro Santos",
    email: "pedro.santos@digitalventures.com",
    phone: "+55 31 96543-2109",
    profile: "MANAGER",
    company_id: "3",
  },
  {
    user_id: "u4",
    name: "Mariana Costa",
    email: "mariana.costa@smartbiz.com.br",
    phone: "+55 41 95432-1098",
    profile: "MANAGER",
    company_id: "4",
  },
];

export const mockCompanies: Company[] = [
  {
    company_id: "1",
    company_name: "TechFlow Solutions",
    appKey: "tfsk_prod_abc123xyz789",
    appSecret: "tfss_prod_secret_key_456def",
    manager: mockUsers[0],
  },
  {
    company_id: "2",
    company_name: "InnovaCorp Brasil",
    appKey: "inck_prod_xyz456abc123",
    appSecret: "incs_prod_secret_key_789ghi",
    manager: mockUsers[1],
  },
  {
    company_id: "3",
    company_name: "Digital Ventures",
    appKey: "dvk_prod_def789ghi012",
    appSecret: "dvs_prod_secret_key_345jkl",
    manager: mockUsers[2],
  },
  {
    company_id: "4",
    company_name: "SmartBiz Consultoria",
    appKey: "sbk_prod_ghi012jkl345",
    appSecret: "sbs_prod_secret_key_678mno",
    manager: mockUsers[3],
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalCompanies: mockCompanies.length,
  totalFeedbacks: 450,
  customerServiceData: [
    { date: "01/11", count: 45 },
    { date: "02/11", count: 52 },
    { date: "03/11", count: 48 },
    { date: "04/11", count: 61 },
    { date: "05/11", count: 55 },
    { date: "06/11", count: 67 },
    { date: "07/11", count: 58 },
  ],
  systemHealthData: [
    { name: "Sucesso", value: 94 },
    { name: "Falhas", value: 6 },
  ],
};
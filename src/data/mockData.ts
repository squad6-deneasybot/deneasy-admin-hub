import { DashboardMetrics } from "@/types";

export const mockDashboardMetrics: DashboardMetrics = {
  totalCompanies: 0,
  totalFeedbacks: 0,
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
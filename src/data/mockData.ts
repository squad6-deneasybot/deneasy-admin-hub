import { Company, User, InitialFeedback, ServiceEvaluation, DashboardMetrics } from "@/types";

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

export const mockInitialFeedback: InitialFeedback[] = [
  {
    feedback_id: "1",
    content: "Gostaria de solicitar a implementação de um sistema de agendamento automático integrado ao chatbot. Isso facilitaria muito o processo de marcação de reuniões com nossos clientes.",
    created_at: "2025-11-06T10:30:00",
    company: mockCompanies[0],
  },
  {
    feedback_id: "2",
    content: "Seria interessante ter um dashboard personalizado que mostre métricas em tempo real sobre os atendimentos realizados pelo bot. Precisamos acompanhar a performance diariamente.",
    created_at: "2025-11-05T14:20:00",
    company: mockCompanies[1],
  },
  {
    feedback_id: "3",
    content: "Solicitamos a funcionalidade de envio de notificações push para os gestores quando o bot não consegue resolver uma questão específica do cliente.",
    created_at: "2025-11-04T09:15:00",
    company: mockCompanies[2],
  },
];

export const mockServiceEvaluations: ServiceEvaluation[] = [
  {
    evaluation_id: "1",
    content: "O atendimento do chatbot foi excepcional! Resolveu minha dúvida rapidamente e de forma muito clara. A equipe de suporte também foi muito prestativa quando precisei escalar um problema.",
    rating: 5,
    created_at: "2025-11-07T16:45:00",
    company: mockCompanies[0],
  },
  {
    evaluation_id: "2",
    content: "Bom atendimento no geral, mas houve alguns momentos de lentidão nas respostas. A integração com nosso sistema poderia ser melhorada.",
    rating: 4,
    created_at: "2025-11-06T11:30:00",
    company: mockCompanies[1],
  },
  {
    evaluation_id: "3",
    content: "Experiência satisfatória. O bot conseguiu entender minhas necessidades, mas senti falta de algumas funcionalidades mais avançadas que outros chatbots oferecem.",
    rating: 3,
    created_at: "2025-11-05T13:20:00",
    company: mockCompanies[3],
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalCompanies: mockCompanies.length,
  totalFeedbacks: mockInitialFeedback.length + mockServiceEvaluations.length,
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

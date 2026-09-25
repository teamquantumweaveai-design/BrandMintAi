export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: LeadStatus;
  created_at: string;
  assigned_to?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager';
  created_at: string;
}

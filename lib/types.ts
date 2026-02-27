export type UserRole = 'admin' | 'headoffice' | 'territorymanager' | 'unitmanager' | 'ro' | 'beneficiary';

export interface MenuItem {
  icon: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface DemoUser {
  role: UserRole;
  name: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  type: string;
  completed: boolean;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  modules: number;
  icon: string;
  gradient: string;
}

export interface Session {
  id: number;
  name: string;
  date: string;
  district: string;
  upazila: string;
  union: string;
  unitOffice: string;
  participants: number;
  male: number;
  female: number;
  unitManager: string;
  status: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  userRole: UserRole;
  userName: string;
  userEmail: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  headoffice: 'Head Office',
  territorymanager: 'Territory Manager',
  unitmanager: 'Unit Manager',
  ro: 'Regional Officer',
  beneficiary: 'Beneficiary',
};

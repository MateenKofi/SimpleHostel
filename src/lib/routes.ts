import { LayoutDashboard, Users, Building, Calendar, Settings, FileText } from 'lucide-react';

export const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Residents',
    icon: Users,
    href: '/residents',
  },
  {
    label: 'Rooms',
    icon: Building,
    href: '/rooms',
  },
  {
    label: 'Semester Management',
    icon: Calendar,
    href: '/semester-management',
  },
  {
    label: 'Reports',
    icon: FileText,
    href: '/reports',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
]; 
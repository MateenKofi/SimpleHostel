export interface Resident {
    id: string;
    fullName: string;
    studentId: string;
    phone: string;
    roomNumber?: string;
    status: 'pending' | 'active' | 'inactive';
    paymentMethod?: 'cash' | 'momo';
} 
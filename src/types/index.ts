export type Role = 'Citizen' | 'Moderator' | 'Authority' | 'Admin' | 'Super Admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: Role;
  trustScore: number;
  citizenRank: string;
  departmentId?: string; // For Authorities
  createdAt: any;
  updatedAt: any;
}

export type IssueStatus = 'Pending' | 'Verified' | 'Under Review' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  videos?: string[];
  status: IssueStatus;
  priority: IssuePriority;
  aiAnalysis: {
    category: string;
    severity: string;
    confidence: number;
    duplicateCheck: boolean;
  };
  verificationCount: number;
  reportedBy: string; // User ID
  assignedTo?: string; // Department ID
  createdAt: any;
  updatedAt: any;
}

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  content: string;
  images?: string[];
  createdAt: any;
}

export interface Verification {
  id: string;
  issueId: string;
  userId: string;
  status: 'Confirmed' | 'Rejected';
  evidence?: string[];
  createdAt: any;
}

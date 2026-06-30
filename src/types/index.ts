export type Role = 'Citizen' | 'Moderator' | 'Authority' | 'Admin' | 'Super Admin';
export type FirestoreTimestamp = { seconds: number; nanoseconds: number; toDate?: () => Date } | Date;

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: Role;
  trustScore: number;
  citizenRank: string;
  departmentId?: string; // For Authorities
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
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
  verifiedBy: string[]; // Array of User IDs who verified this
  reportedBy: string; // User ID
  assignedTo?: string; // Department ID
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  content: string;
  images?: string[];
  createdAt: FirestoreTimestamp;
}

export interface Verification {
  id: string;
  issueId: string;
  userId: string;
  status: 'Confirmed' | 'Rejected';
  evidence?: string[];
  createdAt: FirestoreTimestamp;
}

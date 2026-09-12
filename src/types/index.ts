export enum UserRole {
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
}

export type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  imageCldPubId?: string;
};

export type Department = {
  id: number;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  subjectCount?: number;
  teacherCount?: number;
};

export type Subject = {
  id: number;
  code: string;
  name: string;
  description?: string;
  departmentId: number;
  department?: Department;
  createdAt: string;
  updatedAt: string;
};

export type Schedule = {
  day: string;
  startTime: string;
  endTime: string;
};

export type CapacityStatus = "ok" | "warning" | "full";

export type ClassDetails = {
  id: number;
  name: string;
  description?: string;
  status: "active" | "inactive" | "archived";
  capacity: number;
  enrollmentCount?: number;
  capacityStatus?: CapacityStatus;
  subjectId: number;
  teacherId: string;
  bannerUrl?: string;
  bannerCldPubId?: string;
  inviteCode?: string;
  subject?: Subject;
  teacher?: User;
  department?: Department;
  schedules: Schedule[];
  createdAt: string;
  updatedAt: string;
};

export type Enrollment = {
  id: number;
  studentId: string;
  classId: number;
  createdAt: string;
  student?: User;
  class?: ClassDetails;
  subjectName?: string;
  teacherName?: string;
};

export type ActivityLog = {
  id: number;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  actorName?: string;
};

export type DashboardStats = {
  overview: {
    users: number;
    classes: number;
    enrollments: number;
    departments: number;
  };
  enrollmentTrends: { date: string; count: number }[];
  classesByDepartment: { department: string; count: number }[];
  capacityStatus: { ok: number; warning: number; full: number };
  userDistribution: { role: string; count: number }[];
  activityFeed: ActivityLog[];
  metrics: {
    avgClassSize: number;
    fillRate: number;
    activeClasses: number;
  };
};

export type SearchResult = {
  type: string;
  id: string | number;
  title: string;
  subtitle?: string;
  url: string;
};

export type ListResponse<T = unknown> = {
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateResponse<T = unknown> = {
  data?: T;
};

declare global {
  interface CloudinaryUploadWidgetResults {
    event: string;
    info: {
      secure_url: string;
      public_id: string;
      delete_token?: string;
      resource_type: string;
      original_filename: string;
    };
  }

  interface CloudinaryWidget {
    open: () => void;
  }

  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (
          error: unknown,
          result: CloudinaryUploadWidgetResults,
        ) => void,
      ) => CloudinaryWidget;
    };
  }
}

export interface UploadWidgetValue {
  url: string;
  publicId: string;
}

export interface UploadWidgetProps {
  value?: UploadWidgetValue | null;
  onChange?: (value: UploadWidgetValue | null) => void;
  disabled?: boolean;
}

import * as z from "zod";
import { UserRole } from "@/types";

const scheduleSchema = z.object({
  day: z.string().min(1, "Day is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

export const classSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(5),
  subjectId: z.coerce.number().min(1, "Subject is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  capacity: z.coerce.number().min(1),
  status: z.enum(["active", "inactive", "archived"]),
  bannerUrl: z.string().min(1, "Class banner is required"),
  bannerCldPubId: z.string().min(1, "Banner reference is required"),
  schedules: z.array(scheduleSchema).optional(),
});

export const departmentSchema = z.object({
  name: z.string().min(2).max(255),
  code: z.string().min(2).max(20),
  description: z.string().optional(),
});

export const subjectSchema = z.object({
  name: z.string().min(2).max(255),
  code: z.string().min(2).max(20),
  description: z.string().optional(),
  departmentId: z.coerce.number().min(1, "Department is required"),
});

export const userSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
});

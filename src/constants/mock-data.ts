import { Subject } from "@/types";

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "CS",
    description:
      "Fundamental programming concepts, problem solving, and an introduction to algorithms and computer systems.",
    createdAt: "2023-08-01T10:00:00.000Z",
  },
  {
    id: 2,
    code: "MATH231",
    name: "Calculus II",
    department: "Math",
    description:
      "Techniques of integration, infinite series, and applications to physical and engineering problems.",
    createdAt: "2023-09-15T12:00:00.000Z",
  },
  {
    id: 3,
    code: "ENG201",
    name: "Introduction to English Literature",
    department: "English",
    description:
      "Survey of major works in English literature with emphasis on critical reading and writing.",
    createdAt: "2024-01-10T09:30:00.000Z",
  },
];

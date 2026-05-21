import { Subject } from "../types/index.ts";

export const mockSubjects: Subject[] = [
  {
    id: "sub-001",
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    description:
      "Foundational concepts of computer science including algorithms, programming, and problem solving.",
    createdAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "sub-002",
    code: "MATH201",
    name: "Linear Algebra",
    department: "Mathematics",
    description:
      "Vector spaces, linear transformations, matrices, eigenvalues, and applications to engineering and data science.",
    createdAt: "2026-02-15T12:30:00.000Z",
  },
  {
    id: "sub-003",
    code: "HIST310",
    name: "Modern World History",
    department: "History",
    description:
      "Survey of major political, social, and economic developments from the 18th century to the present.",
    createdAt: "2026-03-20T15:45:00.000Z",
  },
];

export default mockSubjects;

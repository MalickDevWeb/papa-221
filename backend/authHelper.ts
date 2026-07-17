import { readDb } from "./db";
import { StudentTable, PromotionTable, CourseTable } from "./types";

export interface ResolvedStudentContext {
  student: StudentTable;
  promotion: PromotionTable;
  courses: CourseTable[];
}

export function getStudentContext(authHeader: string): ResolvedStudentContext | null {
  const token = (authHeader || "").replace("Bearer ", "").trim();
  const db = readDb();
  const students = db.students || [];
  const promotions = db.promotions || [];
  const courses = db.courses || [];

  // Match token to student ID
  let studentId = "usr-etudiant-01"; // Default fallback
  if (token === "fake-jwt-token-etudiant-222") {
    studentId = "usr-etudiant-02";
  } else if (token === "fake-jwt-token-etudiant-223") {
    studentId = "usr-etudiant-03";
  }

  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  const promotion = promotions.find((p) => p.id === student.promotion_id) || {
    id: "p-1",
    name: "221-GL",
    filiere: "Master 1 GL",
    faculte: "Sciences & Technologies"
  };

  const studentCourses = courses.filter((c) => c.promotion_id === promotion.id);

  return {
    student,
    promotion,
    courses: studentCourses
  };
}


export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
  isPublished: boolean;
}

export interface Chapter {
  id:string;
  title: string;
  videoUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correct: number; // Index of correct option
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  score: number;
  total: number;
}

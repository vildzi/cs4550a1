import { Quiz } from "../../client";

export const formatDate = (date: string) => {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00`);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatDateTime = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const totalPoints = (quiz: Pick<Quiz, "questions">) =>
  (quiz.questions || []).reduce((sum, q) => sum + (q.points || 0), 0);

export type AvailabilityState =
  | { label: "Closed"; code: "closed" }
  | { label: "Available"; code: "available" }
  | { label: string; code: "notYet" };

export const getAvailability = (quiz: Quiz): AvailabilityState => {
  const now = new Date();
  const available = quiz.availableDate
    ? new Date(`${quiz.availableDate}T00:00:00`)
    : null;
  const until = quiz.untilDate
    ? new Date(`${quiz.untilDate}T23:59:59`)
    : null;

  if (available && now < available) {
    return {
      label: `Not available until ${formatDate(quiz.availableDate)}`,
      code: "notYet",
    };
  }
  if (until && now > until) {
    return { label: "Closed", code: "closed" };
  }
  return { label: "Available", code: "available" };
};

export const sortQuizzesByAvailable = <T extends Quiz>(quizzes: T[]): T[] => {
  return [...quizzes].sort((a, b) => {
    const aD = a.availableDate || "";
    const bD = b.availableDate || "";
    return aD.localeCompare(bD);
  });
};

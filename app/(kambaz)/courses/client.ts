import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

export type Course = {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  department?: string;
  credits?: number;
  description: string;
  image?: string;
  [key: string]: unknown;
};

export type Module = {
  _id: string;
  name: string;
  description?: string;
  lessons?: unknown[];
  editing?: boolean;
  course?: string;
  [key: string]: unknown;
};

export type Assignment = {
  _id: string;
  course: string;
  name: string;
  description: string;
  points: number;
  assignmentGroup: string;
  displayGradeAs: string;
  submissionType: string;
  onlineEntryOptions: {
    textEntry: boolean;
    websiteUrl: boolean;
    mediaRecordings: boolean;
    studentAnnotation: boolean;
    fileUploads: boolean;
  };
  assignTo: string;
  dueDate: string;
  availableFrom: string;
  availableUntil: string;
  [key: string]: unknown;
};

export type Enrollment = {
  _id: string;
  user: string;
  course: string;
};

export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";

export type Choice = {
  _id: string;
  text: string;
  correct: boolean;
};

export type Question = {
  _id: string;
  type: QuestionType;
  title: string;
  questionHtml: string;
  points: number;
  choices: Choice[];
  correctAnswer: boolean;
  blanks: string[];
};

export type Quiz = {
  _id: string;
  course: string;
  title: string;
  description: string;
  quizType: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
  assignmentGroup: "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT";
  shuffleAnswers: boolean;
  timeLimitEnabled: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableDate: string;
  untilDate: string;
  published: boolean;
  questions: Question[];
};

export type QuizAnswer = {
  questionId: string;
  type?: QuestionType;
  selectedChoiceIds?: string[];
  booleanAnswer?: boolean;
  textAnswer?: string;
  correct?: boolean;
  pointsEarned?: number;
};

export type QuizAttempt = {
  _id: string;
  user: string;
  quiz: string;
  course: string;
  attemptNumber: number;
  score: number;
  totalPoints: number;
  answers: QuizAnswer[];
  submittedAt: string;
};

export const fetchAllCourses = async () => {
  const { data } = await axiosWithCredentials.get(COURSES_API);
  return data as Course[];
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
  return data as Course[];
};

export const createCourse = async (course: Partial<Course>) => {
  const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
  return data as Course;
};

export const deleteCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.delete(`${COURSES_API}/${courseId}`);
  return data;
};

export const updateCourse = async (course: Course) => {
  const { data } = await axiosWithCredentials.put(`${COURSES_API}/${course._id}`, course);
  return data as Course;
};

export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
  return data as Module[];
};

export const createModuleForCourse = async (
  courseId: string,
  module: Partial<Module>
) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return data as Module;
};

export const deleteModule = async (courseId: string, moduleId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${COURSES_API}/${courseId}/modules/${moduleId}`
  );
  return data;
};

export const updateModule = async (courseId: string, module: Module) => {
  const { data } = await axiosWithCredentials.put(
    `${COURSES_API}/${courseId}/modules/${module._id}`,
    module
  );
  return data;
};

export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/assignments`
  );
  return data as Assignment[];
};

export const findAssignmentById = async (assignmentId: string) => {
  const { data } = await axiosWithCredentials.get(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data as Assignment;
};

export const createAssignmentForCourse = async (
  courseId: string,
  assignment: Partial<Assignment>
) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/assignments`,
    assignment
  );
  return data as Assignment;
};

export const deleteAssignment = async (assignmentId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${ASSIGNMENTS_API}/${assignmentId}`
  );
  return data;
};

export const updateAssignment = async (assignment: Assignment) => {
  const { data } = await axiosWithCredentials.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment
  );
  return data as Assignment;
};

export const findMyEnrollments = async () => {
  const { data } = await axiosWithCredentials.get(`${USERS_API}/current/enrollments`);
  return data as Enrollment[];
};

export const enrollInCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses/${courseId}/enrollment`
  );
  return data as Enrollment;
};

export const unenrollFromCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${USERS_API}/current/courses/${courseId}/enrollment`
  );
  return data;
};

export const findUsersForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};

export const findQuizzesForCourse = async (courseId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${COURSES_API}/${courseId}/quizzes`
  );
  return data as Quiz[];
};

export const findQuizById = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return data as Quiz;
};

export const createQuizForCourse = async (
  courseId: string,
  quiz: Partial<Quiz>
) => {
  const { data } = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/quizzes`,
    quiz
  );
  return data as Quiz;
};

export const updateQuiz = async (quiz: Partial<Quiz> & { _id: string }) => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quiz._id}`,
    quiz
  );
  return data as Quiz;
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}`
  );
  return data;
};

export const addQuestion = async (
  quizId: string,
  question: Partial<Question>
) => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/questions`,
    question
  );
  return data as Question;
};

export const updateQuestion = async (
  quizId: string,
  question: Question
) => {
  const { data } = await axiosWithCredentials.put(
    `${QUIZZES_API}/${quizId}/questions/${question._id}`,
    question
  );
  return data as Quiz;
};

export const deleteQuestion = async (quizId: string, questionId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${QUIZZES_API}/${quizId}/questions/${questionId}`
  );
  return data;
};

export const submitQuizAttempt = async (
  quizId: string,
  answers: QuizAnswer[]
) => {
  const { data } = await axiosWithCredentials.post(
    `${QUIZZES_API}/${quizId}/attempts`,
    { answers }
  );
  return data as QuizAttempt;
};

export const findLatestAttempt = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/attempts/current`
  );
  return data as QuizAttempt | null;
};

export const findAttempts = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get(
    `${QUIZZES_API}/${quizId}/attempts`
  );
  return data as QuizAttempt[];
};

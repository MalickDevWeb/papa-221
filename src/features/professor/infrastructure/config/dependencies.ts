import { ApiProfessorRepository } from '../api/ApiProfessorRepository';
import { InMemoryProfessorRepository } from '../local/InMemoryProfessorRepository';
import { 
  createGetCoursesUseCase,
  createGetStudentsUseCase,
  createGetGradesUseCase,
  createUpdateGradeUseCase,
  createGetHomeworksUseCase,
  createCreateHomeworkUseCase,
  createGetScheduleUseCase,
  createCancelCourseUseCase,
  createRescheduleCourseUseCase,
  createGetVigilCheckInsUseCase,
  createGetRemindersUseCase,
  createCreateReminderUseCase,
  createGetLessonsUseCase,
  createCreateLessonUseCase,
  createGetModulesUseCase,
  createCreateModuleUseCase,
  createGetQuizzesUseCase,
  createCreateQuizUseCase
} from '../../usecases/ProfessorUseCases';

const useMock = import.meta.env.VITE_USE_MOCK !== 'false';
const professorRepository = useMock
  ? new InMemoryProfessorRepository()
  : new ApiProfessorRepository();

export const getCoursesUseCase = createGetCoursesUseCase(professorRepository);
export const getStudentsUseCase = createGetStudentsUseCase(professorRepository);
export const getGradesUseCase = createGetGradesUseCase(professorRepository);
export const updateGradeUseCase = createUpdateGradeUseCase(professorRepository);
export const getHomeworksUseCase = createGetHomeworksUseCase(professorRepository);
export const createHomeworkUseCase = createCreateHomeworkUseCase(professorRepository);
export const getScheduleUseCase = createGetScheduleUseCase(professorRepository);
export const cancelCourseUseCase = createCancelCourseUseCase(professorRepository);
export const rescheduleCourseUseCase = createRescheduleCourseUseCase(professorRepository);
export const getVigilCheckInsUseCase = createGetVigilCheckInsUseCase(professorRepository);
export const getRemindersUseCase = createGetRemindersUseCase(professorRepository);
export const createReminderUseCase = createCreateReminderUseCase(professorRepository);
export const getLessonsUseCase = createGetLessonsUseCase(professorRepository);
export const createLessonUseCase = createCreateLessonUseCase(professorRepository);
export const getModulesUseCase = createGetModulesUseCase(professorRepository);
export const createModuleUseCase = createCreateModuleUseCase(professorRepository);
export const getQuizzesUseCase = createGetQuizzesUseCase(professorRepository);
export const createQuizUseCase = createCreateQuizUseCase(professorRepository);

import { InMemoryGradeRepository } from '../local/InMemoryGradeRepository';
import { ApiGradeRepository } from '../api/ApiGradeRepository';
import { createGetStudentGradesUseCase } from '../../usecases/GetStudentGradesUseCase';

// On respecte la configuration VITE_USE_MOCK
const isMock = import.meta.env.VITE_USE_MOCK !== 'false';

export const gradeRepository = isMock 
  ? new InMemoryGradeRepository() 
  : new ApiGradeRepository();

export const getStudentGradesUseCase = createGetStudentGradesUseCase(gradeRepository);

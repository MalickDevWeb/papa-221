import { InMemoryHomeworkRepository } from '../local/InMemoryHomeworkRepository';
import { ApiHomeworkRepository } from '../api/ApiHomeworkRepository';
import { createGetHomeworksUseCase } from '../../usecases/GetHomeworksUseCase';
import { createAddHomeworkUseCase } from '../../usecases/AddHomeworkUseCase';
import { createSubmitHomeworkUseCase } from '../../usecases/SubmitHomeworkUseCase';
import { createStartHomeworkUseCase } from '../../usecases/StartHomeworkUseCase';
import { createAdvanceHomeworkProgressUseCase } from '../../usecases/AdvanceHomeworkProgressUseCase';

const isMock = import.meta.env.VITE_USE_MOCK !== 'false';

export const homeworkRepository = isMock 
  ? new InMemoryHomeworkRepository() 
  : new ApiHomeworkRepository();

export const getHomeworksUseCase = createGetHomeworksUseCase(homeworkRepository);
export const addHomeworkUseCase = createAddHomeworkUseCase(homeworkRepository);
export const submitHomeworkUseCase = createSubmitHomeworkUseCase(homeworkRepository);
export const startHomeworkUseCase = createStartHomeworkUseCase(homeworkRepository);
export const advanceHomeworkProgressUseCase = createAdvanceHomeworkProgressUseCase(homeworkRepository);

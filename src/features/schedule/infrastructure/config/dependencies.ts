import { InMemoryScheduleRepository } from '../local/InMemoryScheduleRepository';
import { ApiScheduleRepository } from '../api/ApiScheduleRepository';
import { createGetWeeklyScheduleUseCase } from '../../usecases/GetWeeklyScheduleUseCase';

const isMock = import.meta.env.VITE_USE_MOCK !== 'false';

export const scheduleRepository = isMock 
  ? new InMemoryScheduleRepository() 
  : new ApiScheduleRepository();

export const getWeeklyScheduleUseCase = createGetWeeklyScheduleUseCase(scheduleRepository);

import { apiClient } from '@/shared/lib/apiClient';
import { InMemoryVigilRepository } from '../local/InMemoryVigilRepository';
import { ApiVigilRepository } from '../api/ApiVigilRepository';
import { createGetVigilProfileUseCase } from '../../usecases/GetVigilProfileUseCase';
import { createScanBadgeUseCase } from '../../usecases/ScanBadgeUseCase';
import { createGetLastScanUseCase } from '../../usecases/GetLastScanUseCase';
import { Html5QrcodeScannerService } from '../local/Html5QrcodeScannerService';
import { WebAudioService } from '../local/WebAudioService';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';
const repository = useMock
  ? new InMemoryVigilRepository()
  : new ApiVigilRepository(apiClient);

export const vigilRepository = repository;
export const getVigilProfileUseCase = createGetVigilProfileUseCase(repository);
export const scanBadgeUseCase = createScanBadgeUseCase(repository);
export const getLastScanUseCase = createGetLastScanUseCase(repository);
export const qrScannerService = new Html5QrcodeScannerService();
export const audioService = new WebAudioService();



import type { VigilRepository } from '../domain/VigilRepository';
import type { VigilScanResult } from '../domain/VigilScan';

export function createGetLastScanUseCase(repository: VigilRepository) {
  return async function execute(): Promise<VigilScanResult | null> {
    return await repository.getLastScan();
  };
}

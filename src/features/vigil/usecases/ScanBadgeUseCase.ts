import type { VigilScanResult } from '../domain/VigilScan';
import type { VigilRepository } from '../domain/VigilRepository';

export function createScanBadgeUseCase(repository: VigilRepository) {
  return async function execute(badgeId: string): Promise<VigilScanResult> {
    return await repository.scanBadge(badgeId);
  };
}

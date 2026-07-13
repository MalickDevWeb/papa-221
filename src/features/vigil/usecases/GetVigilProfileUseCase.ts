import type { VigilProfile } from '../domain/VigilProfile';
import type { VigilRepository } from '../domain/VigilRepository';

export function createGetVigilProfileUseCase(repository: VigilRepository) {
  return async function execute(): Promise<VigilProfile> {
    return await repository.getProfile();
  };
}

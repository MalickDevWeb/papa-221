import { AuthRepositoryPort } from '../../../../domain/port/AuthRepositoryPort';
import { User } from '../../../../domain/model/User';
import { ProductionStore } from '../../../../../../shared/infrastructure/store/ProductionStore';

export class JsonAuthRepositoryAdapter implements AuthRepositoryPort {
  private readonly store = ProductionStore.getInstance();

  public async findByEmail(email: string): Promise<{ user: User; passwordHash: string; token: string } | null> {
    const users = this.store.getTable('users');
    const userRecord = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    if (!userRecord) return null;

    const user = User.create(
      userRecord.id,
      userRecord.email,
      userRecord.nom || userRecord.name?.split(' ')[1] || 'Utilisateur',
      userRecord.prenom || userRecord.name?.split(' ')[0] || '',
      userRecord.role
    );

    return {
      user,
      passwordHash: userRecord.password || '',
      token: userRecord.token || ''
    };
  }
}

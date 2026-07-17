import { BadgeScan } from '../../../domain/model/BadgeScan';
import { SubmitScanCommand } from '../command/SubmitScanCommand';

export interface SubmitScanUseCase {
  execute(command: SubmitScanCommand): Promise<BadgeScan>;
}

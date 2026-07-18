import { GroupMember } from './CollaborationModels';

export type GroupingCriterion = 'random' | 'alpha' | 'gpa' | 'gender' | 'mixed';

export function splitIntoBalancedGroups(
  students: readonly GroupMember[],
  targetGroupCount: number,
  criterion: GroupingCriterion
): GroupMember[][] {
  if (students.length === 0 || targetGroupCount <= 0) return [];

  // Initialize empty groups
  const groups: GroupMember[][] = Array.from({ length: targetGroupCount }, () => []);
  const pool = [...students];

  if (criterion === 'random') {
    pool.sort(() => Math.random() - 0.5);
  } else if (criterion === 'alpha') {
    pool.sort((a, b) => a.name.localeCompare(b.name));
  } else if (criterion === 'gpa') {
    // Zig-zag round-robin to balance GPA
    pool.sort((a, b) => b.gpa - a.gpa);
    let direction = 1;
    let groupIndex = 0;
    for (const student of pool) {
      groups[groupIndex].push(student);
      groupIndex += direction;
      if (groupIndex === targetGroupCount) {
        groupIndex = targetGroupCount - 1;
        direction = -1;
      } else if (groupIndex === -1) {
        groupIndex = 0;
        direction = 1;
      }
    }
    return groups;
  } else if (criterion === 'gender') {
    const males = pool.filter((s) => s.gender === 'M');
    const females = pool.filter((s) => s.gender === 'F');
    let idx = 0;
    males.forEach((m) => {
      groups[idx % targetGroupCount].push(m);
      idx++;
    });
    females.forEach((f) => {
      groups[idx % targetGroupCount].push(f);
      idx++;
    });
    return groups;
  } else {
    // mixed: Sort by combination of GPA and Gender
    pool.sort((a, b) => {
      if (a.gender !== b.gender) return a.gender.localeCompare(b.gender);
      return a.gpa - b.gpa;
    });
  }

  // Standard round-robin for general criteria
  if (criterion !== 'gpa') {
    pool.forEach((student, index) => {
      groups[index % targetGroupCount].push(student);
    });
  }

  return groups;
}

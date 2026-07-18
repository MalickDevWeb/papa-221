import React from 'react';
import { useModuleLessons } from '../../../hooks/useModuleLessons';
import { ChapterSidebar } from './ChapterSidebar';
import { LessonMainList } from './LessonMainList';

interface Props {
  readonly moduleId: string;
}

export function ModuleLessonsSection({ moduleId }: Props) {
  const {
    chapters,
    lessons,
    activeChapterId,
    setActiveChapterId,
    addChapter,
    addLesson,
    deleteChapter,
    deleteLesson,
  } = useModuleLessons(moduleId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
      <div className="lg:col-span-4" style={{ width: '646.484px' }}>
        <ChapterSidebar
          chapters={chapters}
          activeChapterId={activeChapterId}
          onSelectChapter={setActiveChapterId}
          onAddChapter={addChapter}
          onDeleteChapter={deleteChapter}
          style={{ width: '664.484px' }}
        />
      </div>
      <div className="lg:col-span-8" style={{ width: '329.747px' }}>
        <LessonMainList
          chapterId={activeChapterId}
          lessons={lessons}
          onAddLesson={addLesson}
          onDeleteLesson={deleteLesson}
          listContainerStyle={{ width: '322.191px', marginLeft: '9px', marginRight: '2px' }}
        />
      </div>
    </div>
  );
}

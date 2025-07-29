import { useState, useEffect } from 'react';

export type Lesson = {
  id: string;
  weekday: 0 | 1 | 2 | 3 | 4;      // 月～金
  period: 1 | 2 | 3 | 4 | 5 | 6;    // 1限～6限
  title: string;
  professor: string;
  room: string;
  required: number;
  color: string;
  absences: number;
};

/**
 * 按学期单独读写课程数据的 Hook 
 * 会从旧的 'timetable' Key 迁移至 'timetable-{semester}'（仅首次）
 */
export function useTimetable(semester: string) {
  const storageKey = `timetable-${semester}`;

  // 初始 state：优先从新 Key 读；若无，则尝试从旧 Key 迁移
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const rawNew = localStorage.getItem(storageKey);
      if (rawNew) {
        return JSON.parse(rawNew);
      }
      // 旧版用的 'timetable' Key
      const rawOld = localStorage.getItem('timetable');
      if (rawOld) {
        // 把旧数据存入新 Key
        localStorage.setItem(storageKey, rawOld);
        // （可选）删除旧 Key
        // localStorage.removeItem('timetable');
        return JSON.parse(rawOld);
      }
      return [];
    } catch {
      return [];
    }
  });

  // lessons 或 storageKey 变动时写回对应 Key
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(lessons));
  }, [lessons, storageKey]);

  // 当 storageKey（即 semester）改变时，从新的 Key 重新加载
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setLessons(raw ? JSON.parse(raw) : []);
    } catch {
      setLessons([]);
    }
  }, [storageKey]);

  const addLesson = (lesson: Lesson) =>
    setLessons(prev => [...prev, lesson]);

  const updateLesson = (lesson: Lesson) =>
    setLessons(prev => prev.map(l => (l.id === lesson.id ? lesson : l)));

  const removeLesson = (id: string) =>
    setLessons(prev => prev.filter(l => l.id !== id));

  const getIndicatorColor = (lesson: Lesson) => {
    const ratio = lesson.absences / lesson.required;
    if (ratio <= 1 / 3) return 'green';
    if (ratio <= 2 / 3) return 'orange';
    if (ratio < 1) return 'red';
    return 'black';
  };

  return { lessons, addLesson, updateLesson, removeLesson, getIndicatorColor };
}

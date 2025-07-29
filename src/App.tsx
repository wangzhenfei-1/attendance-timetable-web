import React, { useState, useEffect } from 'react';
import { useTimetable } from './hooks/useTimetable';
import { SemesterSelector } from './components/SemesterSelector';
import { TimetableGrid } from './components/TimetableGrid';
import { LessonFormModal } from './components/LessonFormModal';
import { Semester, Lesson } from './types';
import './App.css';

const App: React.FC = () => {
  // 学期持久化
  const [semester, setSemester] = useState<Semester>(() => {
    const saved = localStorage.getItem('selectedSemester');
    return (saved as Semester) || '2025 前期';
  });
  useEffect(() => {
    localStorage.setItem('selectedSemester', semester);
  }, [semester]);

  // 传入当前学期，按学期加载/保存课程
  const {
    lessons,
    addLesson,
    updateLesson,
    removeLesson,
    getIndicatorColor,
  } = useTimetable(semester);

  // 弹窗状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [newLocation, setNewLocation] = useState<{ weekday: number; period: number } | null>(null);

  // 空格子点击 → 新增
  const openModalAt = (weekday: number, period: number) => {
    setEditLesson(null);
    setNewLocation({ weekday, period });
    setIsModalOpen(true);
  };

  // 课程点击 → 编辑
  const openModalForEdit = (lesson: Lesson) => {
    setNewLocation(null);
    setEditLesson(lesson);
    setIsModalOpen(true);
  };

  // 弹窗提交：新增或更新
  const handleAddOrUpdate = (lesson: Lesson) => {
    if (editLesson) updateLesson(lesson);
    else addLesson(lesson);
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <h1>時間割／出欠管理</h1>

      <SemesterSelector semester={semester} setSemester={setSemester} />

      <TimetableGrid
        lessons={lessons}
        onEdit={openModalForEdit}
        onAddAt={openModalAt}
        onUpdate={updateLesson}
        getIndicatorColor={getIndicatorColor}
      />

      <LessonFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddOrUpdate}
        editLesson={editLesson}
        newLocation={newLocation}
        onDelete={removeLesson}
      />
    </div>
  );
};

export default App;

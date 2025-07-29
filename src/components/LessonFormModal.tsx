// src/components/LessonFormModal.tsx
import React, { useState, useEffect } from 'react';
import { Lesson } from '../hooks/useTimetable';
import { ColorPicker } from './ColorPicker';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (lesson: Lesson) => void;
  editLesson?: Lesson | null;
  /** 点击空白格子时传入的预设位置 */
  newLocation?: { weekday: number; period: number } | null;
  onDelete: (id: string) => void;
};

export const LessonFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAdd,
  editLesson,
  newLocation, 
  onDelete,           
}) => {
  // 使用 number 存储，后续在提交时再断言为具体联合类型
  const [weekday, setWeekday] = useState<number>(
    editLesson?.weekday ?? newLocation?.weekday ?? 0
  );
  const [period, setPeriod] = useState<number>(
    editLesson?.period ?? newLocation?.period ?? 1
  );
  const [title, setTitle]       = useState<string>(editLesson?.title ?? '');
  const [professor, setProfessor] = useState<string>(editLesson?.professor ?? '');
  const [room, setRoom]         = useState<string>(editLesson?.room ?? '');
  const [required, setRequired] = useState<number>(editLesson?.required ?? 0);
  const [absences, setAbsences] = useState<number>(editLesson?.absences ?? 0);
  const [color, setColor]       = useState<string>(editLesson?.color ?? '#e6194B');

  useEffect(() => {
    if (editLesson) {
      setWeekday(editLesson.weekday);
      setPeriod(editLesson.period);
      setTitle(editLesson.title);
      setProfessor(editLesson.professor);
      setRoom(editLesson.room);
      setRequired(editLesson.required);
      setAbsences(editLesson.absences);
      setColor(editLesson.color);
    } else if (newLocation) {
      setWeekday(newLocation.weekday);
      setPeriod(newLocation.period);
      setTitle('');
      setProfessor('');
      setRoom('');
      setRequired(0);
      setAbsences(0);
      setColor('#e6194B');
    }
  }, [editLesson, newLocation]);
  const handleDelete = () => {
        if (editLesson) {
          onDelete(editLesson.id);
          onClose();
        }
      };
    
  if (!isOpen) return null;

  const handleSubmit = () => {
    const lesson: Lesson = {
      id: editLesson ? editLesson.id : Date.now().toString(),
      weekday: weekday as 0 | 1 | 2 | 3 | 4,
      period: period   as 1 | 2 | 3 | 4 | 5 | 6,
      title,
      professor,
      room,
      required,
      absences,
      color,
    };
    onAdd(lesson);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>科目を追加／編集</h2>

        <label>
          曜日：
          <select
            value={weekday}
            onChange={e => setWeekday(Number(e.target.value))}
          >
            {[0,1,2,3,4].map(d => (
              <option key={d} value={d}>
                {['月曜日','火曜日','水曜日','木曜日','金曜日'][d]}
              </option>
            ))}
          </select>
        </label>

        <label>
          限：
          <select
            value={period}
            onChange={e => setPeriod(Number(e.target.value))}
          >
            {[1,2,3,4,5,6].map(n => (
              <option key={n} value={n}>
                {n}限
              </option>
            ))}
          </select>
        </label>

        <label>
          科目名：
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>

        <label>
          教授名：
          <input
            type="text"
            value={professor}
            onChange={e => setProfessor(e.target.value)}
          />
        </label>

        <label>
          教室：
          <input
            type="text"
            value={room}
            onChange={e => setRoom(e.target.value)}
          />
        </label>

        <label>
          必要出席回数：
          <input
            type="number"
            value={required}
            onChange={e => setRequired(Number(e.target.value))}
          />
        </label>

        <label>
        欠席回数：
        <input
            type="number"
            value={absences}
            onChange={e => {
        // 转成数字，并限定在 0～15 之间
            const v = Math.max(0, Math.min(15, Number(e.target.value)));
            setAbsences(v);
        }}
    min={0}
    max={15}    
          />
        </label>

        <label>
          色：
          <ColorPicker selected={color} onSelect={setColor} />
        </label>

        <div className="modal-buttons">
          <button onClick={handleSubmit}>保存</button>
          <button onClick={onClose}>キャンセル</button>
          {/* 编辑模式下才显示“削除” */}
          {editLesson && (
            <button className="delete-button" onClick={handleDelete}>
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

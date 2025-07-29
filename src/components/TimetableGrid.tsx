// src/components/TimetableGrid.tsx
import React from 'react';
import { Lesson } from '../hooks/useTimetable';

type Props = {
  /** 現在登録されているすべての科目 */
  lessons: Lesson[];
  /** 既存の科目をクリックしたときに編集用モーダルを開く */
  onEdit: (lesson: Lesson) => void;
  /** 空のセルをクリックしたときに追加用モーダルを開く */
  onAddAt: (weekday: number, period: number) => void;
  /** 科目の欠席数を更新するときに呼ばれる */
  onUpdate: (lesson: Lesson) => void;
  /** 科目の欠席率から丸アイコンの色を返す */
  getIndicatorColor: (lesson: Lesson) => string;
};

export const TimetableGrid: React.FC<Props> = ({
  lessons,
  onEdit,
  onAddAt,
  onUpdate,
  getIndicatorColor,
}) => {
  const weekdays = ['月', '火', '水', '木', '金'];

  return (
    <div className="timetable">
      {/* ヘッダー列 */}
      <div className="header-cell" />
      {weekdays.map(d => (
        <div key={d} className="header-cell">
          {d}曜
        </div>
      ))}

      {/* 1限～6限 */}
      {[1, 2, 3, 4, 5, 6].map(p => (
        <React.Fragment key={p}>
          <div className="period-cell">{p}限</div>
          {weekdays.map((_, w) => {
            const lesson = lessons.find(ls => ls.weekday === w && ls.period === p);
            return (
              <div
                key={w}
                className="lesson-cell"
                onClick={() =>
                  lesson
                    ? onEdit(lesson)     // 既存科目の編集
                    : onAddAt(w, p)     // 新規科目の追加
                }
              >
                {lesson && (
                  <div
                    className="lesson-block"
                    style={{ backgroundColor: lesson.color }}
                  >
                    <div>{lesson.title}</div>
                    <div>{lesson.room}</div>

                    {/* 欠席数コントロール */}
                    <div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          const prev = Math.max(0, lesson.absences - 1);
                          onUpdate({ ...lesson, absences: prev });
                        }}
                      >
                        −
                      </button>
                      <span>{lesson.absences}</span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          const next = Math.min(15, lesson.absences + 1);
                          onUpdate({ ...lesson, absences: next });
                        }}
                      >
                        ＋
                      </button>
                    </div>

                    {/* 欠席率指示灯 */}
                    <div
                      className="indicator"
                      style={{ backgroundColor: getIndicatorColor(lesson) }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

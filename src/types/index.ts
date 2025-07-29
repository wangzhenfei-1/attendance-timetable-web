// src/types/index.ts

/** 学期枚举型 */
export type Semester = '2025 前期' | '2025 後期';

/** 单堂课的类型定义 */
export type Lesson = {
  id: string;
  weekday: 0 | 1 | 2 | 3 | 4;      // 月～金
  period: 1 | 2 | 3 | 4 | 5 | 6;    // 1限～6限
  title: string;                   // 科目名
  professor: string;               // 教授名
  room: string;                    // 教室
  required: number;                // 必要出席回数
  color: string;                   // 颜色代码
  absences: number;                // 已缺席次数
};

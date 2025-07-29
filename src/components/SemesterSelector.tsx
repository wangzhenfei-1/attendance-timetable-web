import React from 'react';
import { Semester } from '../types';

const years = Array.from({length: 2030 - 2025 + 1}, (_, i) => 2025 + i);

type Props = {
  semester: Semester;
  setSemester: (s: Semester) => void;
};

export const SemesterSelector: React.FC<Props> = ({ semester, setSemester }) => (
  <div>
    <label htmlFor="semester">学期を選択：</label>
    <select
      id="semester"
      value={semester}
      onChange={e => setSemester(e.target.value as Semester)}
    >
      {years.map(y => (
        <React.Fragment key={y}>
          <option value={`${y} 前期` as Semester}>{y}年前期</option>
          <option value={`${y} 後期` as Semester}>{y}年後期</option>
        </React.Fragment>
      ))}
    </select>
  </div>
);


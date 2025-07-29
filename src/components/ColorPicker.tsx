// src/components/ColorPicker.tsx
import React from 'react';

type Props = {
  selected: string;
  onSelect: (color: string) => void;
};

const COLORS = [
  '#e6194B', '#3cb44b', '#ffe119', '#4363d8',
  '#f58231', '#911eb4', '#46f0f0', '#f032e6',
  '#bcf60c', '#fabebe', '#008080', '#e6beff',
  '#9A6324', '#fffac8', '#800000', '#aaffc3',
];

export const ColorPicker: React.FC<Props> = ({ selected, onSelect }) => (
  <div className="color-picker">
    {COLORS.map(c => (
      <div
        key={c}
        className={`color-swatch ${selected === c ? 'selected' : ''}`}
        style={{ backgroundColor: c }}
        onClick={() => onSelect(c)}
      />
    ))}
  </div>
);

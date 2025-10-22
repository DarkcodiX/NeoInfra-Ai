import React from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  colors?: string[];
}

const defaultColors = [
  '#FFFFFF', '#F7FAFC', '#EDF2F7', '#E2E8F0', '#CBD5E0', '#A0AEC0', '#718096', '#4A5568', '#2D3748', '#1A202C',
  '#FED7D7', '#FEB2B2', '#FC8181', '#F56565', '#E53E3E', '#C53030', '#9B2C2C', '#822727', '#63171B', '#1A202C',
  '#FEEBC8', '#FBD38D', '#F6AD55', '#ED8936', '#DD6B20', '#C05621', '#9C4221', '#7B341E', '#652B19', '#1A202C',
  '#D9F7BE', '#B7EB8F', '#95DE64', '#73D13D', '#52C41A', '#389E0D', '#237804', '#135200', '#092B00', '#1A202C',
  '#BAE7FF', '#91D5FF', '#69C0FF', '#40A9FF', '#1890FF', '#096DD9', '#0050B3', '#003A8C', '#002766', '#1A202C',
  '#EFDBFF', '#D3ADF7', '#B37FEB', '#9254DE', '#722ED1', '#531DAB', '#391085', '#22075E', '#120338', '#1A202C'
];

export function ColorPicker({ color, onChange, colors = defaultColors }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-10 h-10 p-0"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-10 gap-1">
          {colors.map((c) => (
            <button
              key={c}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
              onClick={() => onChange(c)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

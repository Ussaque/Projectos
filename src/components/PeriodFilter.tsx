import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { months } from "@/utils/months";
import { useState } from "react";

type Period = {
  month: number;
  year: number;
};

type PeriodFilterProps = {
  period: Period;
  onChange: (period: Period) => void;
};

export const PeriodFilter = ({ period, onChange }: PeriodFilterProps) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="flex flex-wrap gap-2 mb-6 items-center justify-center">
      <Select value={period.month.toString()} onValueChange={v => onChange({ ...period, month: Number(v) })}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m, idx) => (
            <SelectItem key={m} value={String(idx + 1)}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={period.year.toString()} onValueChange={v => onChange({ ...period, year: Number(v) })}>
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {years.map(y => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
export type { Period };
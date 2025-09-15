import { ReactNode } from 'react';

export interface Banner {
  id: number;
  gradient: string;
  title: ReactNode;
  description: ReactNode;
}
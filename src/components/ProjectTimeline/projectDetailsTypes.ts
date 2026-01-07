// projectDetailsTypes.ts
import type { ISODate } from "./types";

export type HealthStatus = "On Track" | "Em Risco" | "Crítico";

export interface ProjectDetailsHeaderChip {
  icon?: string;
  label: string;
}

export interface ProjectDetailsActions {
  reportLabel?: string;
  reportIcon?: string;
  onReport?: () => void;

  osObjectLabel?: string;
  osObjectIcon?: string;
  onOsObject?: () => void;
}

export interface ProjectDetailsKpis {
  expectedDeliveryLabel?: string;
  expectedDelivery: ISODate;

  physicalProgressLabel?: string;
  physicalProgressPercent: number;
  physicalTag?: HealthStatus;

  delayDaysLabel?: string;
  delayDays: number;

  overallStatusLabel?: string;
  overallStatus: HealthStatus;
}

/**
 * VIEWMODEL DO HEADER (SEM SELECT)
 * O select fica na AppBar, então o header não precisa dessas props.
 */
export interface ProjectDetailsViewModel {
  title: string;
  updatedText?: string;
  chips?: ProjectDetailsHeaderChip[];
  actions?: ProjectDetailsActions;
  kpis: ProjectDetailsKpis;
}

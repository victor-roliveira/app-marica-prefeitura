// projectDetailsTypes.ts
import type { ISODate } from "./types";

/** ====== Saúde / KPIs ====== */
export type HealthStatus = "Em Dia" | "Em Risco" | "Crítico";

const statusMap: Record<string, HealthStatus> = {
  "No prazo": "Em Dia",
  "Atrasada": "Crítico",
  "Atenção": "Em Risco" 
};

export interface ProjectDetailsHeaderChip {
  icon?: string;
  label: string;
}

export interface ProjectDetailsActions {
  // Ação: Relatório
  reportLabel?: string;
  reportIcon?: string;
  reportRoute?: string;
  onReport?: () => void;

  // Ação: Objeto da OS / Escopo
  osObjectLabel?: string;
  osObjectIcon?: string;
  osObjectRoute?: string;
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

  overallHealthLabel?: string;
  overallHealth: HealthStatus;
}

export interface ProjectDetailsViewModel {
  title: string;
  updatedText?: string;
  updatedAt?: ISODate;

  chips?: ProjectDetailsHeaderChip[];
  actions?: ProjectDetailsActions;
  kpis: ProjectDetailsKpis;
}

/* OS (Objeto da OS) */
export type OsStatus = "Ativa" | "Inativa" | "Encerrada";
export type ContractMilestoneStatus = "OK" | "Em atraso" | "Atenção";

export interface ProjectOsData {
  summary: {
    title: string;
    osCode: string;
    status: OsStatus;
    requester: string;
    durationText: string;
    contractStart: ISODate;
    expectedEnd: ISODate;
  };
  objectText: string;
  scope: {
    includes: string[];
    excludes: string[];
  };
  contractMilestones: Array<{
    id: string;
    title: string;
    linkText?: string;
    status: ContractMilestoneStatus;
  }>;
  expectedProducts: Array<{
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
  }>;
  notes: string[];
}

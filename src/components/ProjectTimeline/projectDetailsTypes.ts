// projectDetails.types.ts
import type { ISODate } from "./types";

export type HealthStatus = "On Track" | "Em Risco" | "Crítico";

export interface ProjectDetailsHeaderChip {
    icon?: string;          // ex: "mdi-pound", "mdi-domain"
    label: string;          // ex: "#2023-8841"
}

export interface ProjectDetailsActions {
    reportLabel?: string;   // ex: "RELATÓRIA"
    reportIcon?: string;    // ex: "mdi-file-chart"
    onReport?: () => void;

    osObjectLabel?: string; // ex: "OBJETO DA OS"
    osObjectIcon?: string;  // ex: "mdi-file-document-outline"
    onOsObject?: () => void;

    exitIcon?: string;      // ex: "mdi-exit-to-app"
    onExit?: () => void;
}

export interface ProjectDetailsKpis {
    expectedDeliveryLabel?: string; // "ENTREGA PREVISTA"
    expectedDelivery: ISODate;

    physicalProgressLabel?: string; // "AVANÇO FÍSICO"
    physicalProgressPercent: number; // 0..100
    physicalTag?: HealthStatus;      // chip no card (ex: "On Track")

    delayDaysLabel?: string;         // "DIAS DE ATRASO"
    delayDays: number;               // pode ser negativo/0/positivo

    overallStatusLabel?: string;      // "STATUS GERAL"
    overallStatus: HealthStatus;      // "Em Risco"
}

export interface ProjectDetailsViewModel {
    title: string; // "BATALHÃO"
    updatedText?: string; // "ATUALIZADO: HOJE, 09:30"

    chips?: ProjectDetailsHeaderChip[];

    actions?: ProjectDetailsActions;

    kpis: ProjectDetailsKpis;
}

import type { ISODate } from "./types";

export type OsStatus = "Ativa" | "Inativa" | "Encerrada";

export type MilestoneContractStatus = "OK" | "Em atraso" | "Atenção";

export interface OsSummaryCard {
    title: string;              // "CONSTRUÇÃO BATALHÃO PMM"
    osCode: string;             // "#OS-2023-014"
    status: OsStatus;           // "Ativa"
    requester: string;          // "Sec. de Educação (FDE)"
    durationText: string;       // "24 Meses" (ou number + unit)
    contractStart: ISODate;     // "2023-05-12"
    expectedEnd: ISODate;       // "2025-05-12"
}

export interface OsScopeList {
    includes: string[];
    excludes: string[];
}

export interface OsContractMilestone {
    id: string;
    title: string;              // "Marco 1 – Conclusão dos Projetos"
    linkText?: string;          // "Vínculo: Etapa de Planejamento e Projeto"
    status: MilestoneContractStatus;
}

export interface OsExpectedProduct {
    id: string;
    title: string;              // "Projetos técnicos entregues"
    subtitle?: string;          // "ARQUITETURA, ENGENHARIA E BIM"
    icon?: string;              // mdi-*
}

export interface ProjectOsData {
    headerTitle?: string;       // default: "OBJETO DA OS"
    summary: OsSummaryCard;
    objectText: string;         // texto longo
    scope: OsScopeList;
    contractMilestones: OsContractMilestone[];
    expectedProducts: OsExpectedProduct[];
    notes: string[];            // observações relevantes
}

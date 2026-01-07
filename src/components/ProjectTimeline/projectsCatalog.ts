import type { ProjectTimelineData } from "./types";
import type { ProjectDetailsViewModel } from "./projectDetailsTypes";
import { batalhaoMock } from "./mock";
import { curvaMock } from "./mockCUR";

export type ProjectId = string;

export interface ProjectOption {
    id: ProjectId;
    label: string;
    subtitle?: string;
}

export interface ProjectScreenData {
    timeline: ProjectTimelineData;
    details: ProjectDetailsViewModel;
}

export const projectOptions: ProjectOption[] = [
    { id: "BAT01", label: "Batalhão", subtitle: "SOMAR • 2023-8856" },
    { id: "CUR02", label: "Curva Di Branco", subtitle: "SOMAR • 2023-3262" },
];

export const projectsCatalog: Record<ProjectId, ProjectScreenData> = {
    BAT01: {
        timeline: batalhaoMock,
        details: {
            title: "BATALHÃO",
            chips: [
                { icon: "mdi-pound", label: "2023-8841" },
                { icon: "mdi-domain", label: "SOMAR" },
            ],
            updatedText: "ATUALIZADO: HOJE, 09:30",
            actions: {
                reportLabel: "Relatório IA",
                reportIcon: "mdi-creation",
                onReport: () => { },
                osObjectLabel: "Objeto da OS",
                osObjectIcon: "mdi-file-document-outline",
                onOsObject: () => { },
            },
            kpis: {
                expectedDelivery: "2024-11-12",
                physicalProgressPercent: 68,
                physicalTag: "Em Dia",
                delayDays: 14,
                overallStatus: "Em Risco",
            },
        },
    },
    CUR02: {
        timeline: curvaMock,
        details: {
            title: "Curva Di Branco",
            chips: [
                { icon: "mdi-pound", label: "2023-3262" },
                { icon: "mdi-domain", label: "SOMAR" },
            ],
            updatedText: "ATUALIZADO: HOJE, 09:30",
            actions: {
                reportLabel: "Relatório IA",
                reportIcon: "mdi-creation",
                onReport: () => { },
                osObjectLabel: "Objeto da OS",
                osObjectIcon: "mdi-file-document-outline",
                onOsObject: () => { },
            },
            kpis: {
                expectedDelivery: "2024-11-12",
                physicalProgressPercent: 68,
                physicalTag: "Em Dia",
                delayDays: 14,
                overallStatus: "Em Dia",
            },
        },
    },
};

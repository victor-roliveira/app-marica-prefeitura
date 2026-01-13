import type { InterferencesViewModel } from "./types";

export const interferencesFallbackMock: InterferencesViewModel = {
    headerTitle: "Interferências",
    kpis: {
        active: {
            label: "ATIVAS",
            value: "5",
            sublabel: "Ocorrências",
            tone: "ok",
            icon: "mdi-alert-circle-outline",
        },
        impact: {
            label: "IMPACTO",
            value: "+34",
            sublabel: "Dias no total",
            tone: "critical",
            icon: "mdi-trending-up",
        },
    },
    list: {
        title: "Lista de Ocorrências",
        rightLabel: "Gravidade",
        items: [
            {
                idTag: "#INT-004",
                dateLabel: "12 Out 2023",
                title: "Atraso na liberação ambiental para supressão vegetal",
                stageLabel: "ETAPA",
                stageValue: "Terraplanagem",
                impactLabel: "IMPACTO",
                impactValue: "+12 Dias",
                milestoneLabel: "MARCO",
                milestoneValue: "M3",
                severity: "Crítico",
            },
            {
                idTag: "#INT-002",
                dateLabel: "28 Set 2023",
                title: "Ruptura de adutora não mapeada durante escavação",
                stageLabel: "ETAPA",
                stageValue: "Fundações",
                impactLabel: "IMPACTO",
                impactValue: "+15 Dias",
                milestoneLabel: "MARCO",
                milestoneValue: "M3",
                severity: "Alto",
            },
            {
                idTag: "#INT-003",
                dateLabel: "05 Out 2023",
                title: "Mudança no projeto elétrico - Subestação",
                stageLabel: "ETAPA",
                stageValue: "Instalações",
                impactLabel: "IMPACTO",
                impactValue: "+5 Dias",
                milestoneLabel: "MARCO",
                milestoneValue: "M1",
                severity: "Médio",
            },
            {
                idTag: "#INT-001",
                dateLabel: "15 Set 2023",
                title: "Chuva intensa causando paralisação parcial",
                stageLabel: "ETAPA",
                stageValue: "Infra",
                impactLabel: "IMPACTO",
                impactValue: "+2 Dias",
                milestoneLabel: "MARCO",
                milestoneValue: "M3",
                severity: "Baixo",
            },
        ],
    },
};

export const interferencesMockByProjectId: Record<string, InterferencesViewModel> = {
    // você pode preencher depois; fallback já resolve
};

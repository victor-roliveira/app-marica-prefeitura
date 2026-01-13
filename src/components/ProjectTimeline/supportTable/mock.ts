import type { SupportTableViewModel } from "./types";

export const supportTableFallbackMock: SupportTableViewModel = {
    headerTitle: "TABELA DE APOIO",
    tabs: {
        all: "Todas",
        late: "Atrasadas",
        progress: "Em Andamento",
        done: "Concluídas",
    },
    columns: {
        stage: "ETAPA",
        situation: "SITUAÇÃO",
        end: "TÉRMINO",
        progress: "AVANÇO",
    },
    rows: [
        { stageName: "Geral", situation: "Concluída", endDateLabel: "14 de jun.", progressPct: 100 },
        { stageName: "Plano de Trabalho", situation: "Concluída", endDateLabel: "14 de jun.", progressPct: 100 },
        { stageName: "Serviços de Campo", situation: "Concluída", endDateLabel: "31 de jul.", progressPct: 100 },
        { stageName: "Arquitetura", situation: "Concluída", endDateLabel: "14 de nov.", progressPct: 100 },
        { stageName: "Engenharia", situation: "Concluída", endDateLabel: "19 de dez.", progressPct: 100 },
        { stageName: "Orçamento", situation: "Concluída", endDateLabel: "09 de jan.", progressPct: 100 },
        { stageName: "Mod. Eco-Fin", situation: "Concluída", endDateLabel: "04 de fev.", progressPct: 100 },
        { stageName: "Mod. Jur-Reg", situation: "Concluída", endDateLabel: "14 de jun.", progressPct: 100 },
        { stageName: "Licitação", situation: "Atrasado", endDateLabel: "14 de abr.", progressPct: 85 },
        { stageName: "Obra", situation: "Atrasado", endDateLabel: "29 de out.", progressPct: 68 },
    ],
};

export const supportTableMockByProjectId: Record<string, SupportTableViewModel> = {};

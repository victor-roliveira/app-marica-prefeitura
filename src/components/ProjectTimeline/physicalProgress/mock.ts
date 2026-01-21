import type { PhysicalProgressViewModel } from "./types";

export const physicalProgressFallbackMock: PhysicalProgressViewModel = {
    header: { title: "Avanço Físico" },
    summary: {
        label: "AVANÇO FÍSICO ATUAL",
        percent: 68,
        suffix: "Acumulado",
        statusLabel: "Em Risco",
        tone: "risk",
        message: "O avanço físico real para o projeto Batalhão encontra-se abaixo do planejado para este período.",
    },
    milestonesEvolution: {
        title: "Evolução do Escopo",
        deltaLabelRight: "DESVIO ACUMULADO",
        deltaValue: "-17%",
        deltaTone: "risk",
        months: ["Jan", "Fev", "Mar", "Abr", "Mai"],
        initialPlanned: [10, 25, 40, 65, 90],
        replanned: [10, 25, 42, 60, 78],
        actualScatter: [12, 24, 38, 52, 70],
    },
    progressComparison: {
        title: "Ritmo de Avanço Mensal",
        months: ["Jan", "Fev", "Mar", "Abr", "Mai"],
        planned: [12, 25, 45, 70, 90],
        replanned: [10, 24, 42, 60, 78],
        actual: [11, 23, 38, 52, 70],
        footnote:
            "O objetivo deste gráfico é mostrar como o avanço na obra é realmente comparado ao planejamento inicial e o replanejado.",
    },
    monthlyExecutionPace: {
        title: "Ritmo de Avanço Mensal",
        months: ["Jan", "Fev", "Mar", "Abr", "Mai"],
        planned: [12, 25, 45, 65, 85],
        actual: [10, 24, 38, 52, 70],
    },
    costVsProgress: {
        title: "Matriz de Impacto de Interferências por Etapa",
        months: ["Jan", "Fev", "Mar", "Abr", "Mai"],
        progressActual: [10, 25, 40, 55, 70],
        costActualM: [0.2, 0.4, 0.8, 1.2, 1.5],
        costUnitLabel: "R$",
    },
};

export const physicalProgressMockByProjectId: Record<string, PhysicalProgressViewModel> = {
    batalhao: physicalProgressFallbackMock,

    // exemplo do segundo projeto (troque a chave para seu projectId real)
    outro: {
        ...physicalProgressFallbackMock,
        summary: {
            ...physicalProgressFallbackMock.summary,
            percent: 74,
            statusLabel: "Em Dia",
            tone: "ok",
            message: "O avanço físico real para este projeto está alinhado ao replanejado neste período.",
        },
        milestonesEvolution: {
            ...physicalProgressFallbackMock.milestonesEvolution,
            deltaValue: "+3%",
            deltaTone: "ok",
            initialPlanned: [10, 22, 38, 58, 80],
            replanned: [10, 22, 38, 60, 82],
            actualScatter: [11, 23, 40, 61, 74],
        },
    },
};

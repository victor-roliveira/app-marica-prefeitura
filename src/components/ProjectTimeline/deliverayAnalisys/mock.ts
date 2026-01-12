import type { DeliveryAnalysisViewModel } from "./types";

export const deliveryAnalysisFallbackMock: DeliveryAnalysisViewModel = {
    title: "Análise de Entrega",
    deadlineCard: {
        plannedDate: "2024-10-29",
        currentForecastDate: "2024-11-12",
        startLabel: "Início: Maio 2023",
        deltaDays: 14,
        progressPct: 72,
        deltaLabel: "+14 dias de atraso",
        tone: "risco",
    },
    delayByDisciplineTitle: "Atraso por Disciplina",
    delayByDisciplineTag: "Impacto Direto",
    delayItems: [
        { name: "Engenharia", delayDays: 18, tone: "critical" },
        { name: "Arquitetura", delayDays: 12, tone: "risco" },
        { name: "Plano de Trabalho", delayDays: 5, tone: "risco" },
        { name: "Orçamento", delayDays: 0, tone: "ok" },
    ],
    impactTitle: "Distribuição de Impacto",
    impact: {
        totalPctLabel: "100%",
        subtitle: "IMPACTO",
        items: [
            { label: "Revisão Proj.", pct: 35, tone: "risco", colorKey: "rev_proj" },
            { label: "Ambiental", pct: 25, tone: "critical", colorKey: "ambiental" },
            { label: "Desapropriação", pct: 25, tone: "risco", colorKey: "desapropriacao" },
            { label: "Logística", pct: 15, tone: "ok", colorKey: "logistica" },
        ],

    },
    plannedRealizedTitle: "Planejado x Realizado",
    plannedRealized: {
        statusLabel: "STATUS ATUAL",
        headline: "DIFERENÇA DE RITMO (-17%)",
        headlineTone: "risco",
        legendPlannedLabel: "PLANEJADO",
        legendRealizedLabel: "REALIZADO",
        points: [
            { monthLabel: "Jan", planned: 12, realized: 10 },
            { monthLabel: "Fev", planned: 25, realized: 22 },
            { monthLabel: "Mar", planned: 45, realized: 39 },
            { monthLabel: "Abr", planned: 65, realized: 54 },
            { monthLabel: "Mai", planned: 88, realized: 70 },
        ],
        footnote:
            "A curva de realização mostra um descolamento progressivo em relação ao plano base desde Março.",
    },
};

export const deliveryAnalysisMockByProjectId: Record<string, DeliveryAnalysisViewModel> = {
    // Ajuste as chaves para os projectId reais das suas rotas
    batalhao: deliveryAnalysisFallbackMock,

    // exemplo de outro projeto (copie e personalize):
    // hospital: { ...deliveryAnalysisFallbackMock, deadlineCard: { ...deliveryAnalysisFallbackMock.deadlineCard, deltaDays: 5, deltaLabel: "+5 dias de atraso" } },
};

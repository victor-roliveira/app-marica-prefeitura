export type HealthStatus = "Em Dia" | "Em Risco" | "Crítico";
export type Tone = "ok" | "risk" | "critical";

export interface PhysicalProgressHeaderVm {
    title: string; // "Avanço Físico"
}

export interface PhysicalProgressSummaryVm {
    label: string;              // "AVANÇO FÍSICO ATUAL"
    percent: number;            // 68
    suffix: string;             // "Acumulado"
    statusLabel: HealthStatus;  // "Em Risco"
    message: string;            // texto explicativo
    tone: Tone;                 // para cor do chip
}

export interface MonthlyPointVm {
    monthLabel: string; // "Jan", "Fev"...
    value: number;      // 0..100 (ou custo em milhões, dependendo do gráfico)
}

/**
 * Evolução de Marcos:
 * - Planejamento inicial (linha)
 * - Replanejado (linha tracejada)
 * - Real (dispersão / pontos)
 */
export interface MilestonesEvolutionVm {
    title: string;             // "Evolução de Marcos"
    deltaLabelRight: string;   // "DESVIO ACUMULADO"
    deltaValue: string;        // "-17%"
    deltaTone: Tone;
    months: string[];
    initialPlanned: number[];    // %
    replanned: number[];         // %
    actualScatter: number[];     // % (mesmo eixo)
}

export interface ProgressComparisonVm {
    title: string; // "COMPARATIVO DE AVANÇO"
    months: string[];
    planned: number[];
    replanned: number[];
    actual: number[];
    footnote: string;
}

export interface MonthlyExecutionPaceVm {
    title: string; // "Ritmo de Execução Mensal"
    months: string[];
    planned: number[];
    actual: number[];
}

export interface CostVsPhysicalProgressVm {
    title: string; // "Custo x Avanço Físico"
    months: string[];
    progressActual: number[]; // %
    costActualM: number[];    // milhões (ex.: 0.4, 0.8, 1.2)
    costUnitLabel: string;    // "R$"
}

export interface PhysicalProgressViewModel {
    header: PhysicalProgressHeaderVm;
    summary: PhysicalProgressSummaryVm;
    milestonesEvolution: MilestonesEvolutionVm;
    progressComparison: ProgressComparisonVm;
    monthlyExecutionPace: MonthlyExecutionPaceVm;
    costVsProgress: CostVsPhysicalProgressVm;
}

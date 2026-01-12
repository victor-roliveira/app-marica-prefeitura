export type ISODate = string; // "YYYY-MM-DD"

export type DeliveryStatusTone = "critical" | "risco" | "ok";
export type ImpactColorKey = "rev_proj" | "ambiental" | "desapropriacao" | "logistica";

/** Card: Prazo Planejado x Atual */
export interface DeliveryDeadlineCardVm {
    plannedDate: ISODate;
    currentForecastDate: ISODate;

    /** Ex.: "Início: Maio 2023" */
    startLabel: string;

    /** Ex.: +14 (atraso) / -3 (adiantado) / 0 */
    deltaDays: number;

    /** Barra: proporção do tempo "planejado" vs "atual" (0..100) */
    progressPct: number;

    /** Texto do chip, ex.: "+14 dias de atraso" / "On time" */
    deltaLabel: string;

    tone: DeliveryStatusTone;
}

/** Lista: Atraso por Disciplina */
export interface DisciplineDelayItemVm {
    name: string;
    delayDays: number; // 0 = on time
    tone: DeliveryStatusTone;
}

/** Card: Distribuição de Impacto (donut) */
export interface ImpactDistributionItemVm {
  label: string;
  pct: number;
  tone: DeliveryStatusTone;      // mantém semântica (para chips/status)
  colorKey: ImpactColorKey;      // NEW: define a cor visual do gráfico/bolinha
}

export interface ImpactDistributionVm {
    totalPctLabel: string; // "100%"
    subtitle: string;      // "IMPACTO"
    items: ImpactDistributionItemVm[];
}

/** Card: Planejado x Realizado (barras mensais) */
export interface PlannedRealizedPointVm {
    monthLabel: string; // "Jan"
    planned: number;    // 0..100
    realized: number;   // 0..100
}

export interface PlannedRealizedVm {
    statusLabel: string;       // "STATUS ATUAL"
    headline: string;          // "DIFERENÇA DE RITMO (-17%)"
    headlineTone: DeliveryStatusTone;

    legendPlannedLabel: string;  // "PLANEJADO"
    legendRealizedLabel: string; // "REALIZADO"

    points: PlannedRealizedPointVm[];

    footnote: string;
}

export interface DeliveryAnalysisViewModel {
    title: string; // "Análise de Entrega"
    deadlineCard: DeliveryDeadlineCardVm;

    delayByDisciplineTitle: string;  // "Atraso por Disciplina"
    delayByDisciplineTag: string;    // "Impacto Direto"
    delayItems: DisciplineDelayItemVm[];

    impactTitle: string; // "Distribuição de Impacto"
    impact: ImpactDistributionVm;

    plannedRealizedTitle: string; // "Planejado x Realizado"
    plannedRealized: PlannedRealizedVm;
}

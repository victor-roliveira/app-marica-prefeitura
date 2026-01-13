export type InterferenceSeverity = "Crítico" | "Alto" | "Médio" | "Baixo";
export type Tone = "critical" | "risk" | "ok";

export interface InterferenceKpiVm {
    label: string;     // "ATIVAS" / "IMPACTO"
    value: string;     // "5" / "+34"
    sublabel: string;  // "Ocorrências" / "Dias no total"
    tone: Tone;        // para cor do destaque/ícone
    icon: string;      // mdi icon
}

export interface InterferenceItemVm {
    idTag: string;          // "#INT-004"
    dateLabel: string;      // "12 Out 2023"
    title: string;          // título principal
    stageLabel: string;     // "ETAPA"
    stageValue: string;     // "Terraplanagem"
    impactLabel: string;    // "IMPACTO"
    impactValue: string;    // "+12 Dias"
    milestoneLabel: string; // "MARCO"
    milestoneValue: string; // "M3"
    severity: InterferenceSeverity;
}

export interface InterferencesListVm {
    title: string;          // "Lista de Ocorrências"
    rightLabel: string;     // "Gravidade"
    items: InterferenceItemVm[];
}

export interface InterferencesViewModel {
    headerTitle: string; // "Interferências"
    kpis: {
        active: InterferenceKpiVm;
        impact: InterferenceKpiVm;
    };
    list: InterferencesListVm;
}

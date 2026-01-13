export type SupportTabKey = "all" | "late" | "progress" | "done";

export type SupportSituation = "Concluída" | "Atrasado" | "Em Andamento";

export interface SupportTabsVm {
    all: string;       // "Todas"
    late: string;      // "Atrasadas"
    progress: string;  // "Em Andamento"
    done: string;      // "Concluídas"
}

export interface SupportRowVm {
    stageName: string;       // "Plano de Trabalho"
    situation: SupportSituation;
    endDateLabel: string;    // "14 de jun."
    progressPct: number;     // 0..100
}

export interface SupportTableViewModel {
    headerTitle: string;     // "TABELA DE APOIO"
    tabs: SupportTabsVm;
    columns: {
        stage: string;         // "ETAPA"
        situation: string;     // "SITUAÇÃO"
        end: string;           // "TÉRMINO"
        progress: string;      // "AVANÇO"
    };
    rows: SupportRowVm[];
}

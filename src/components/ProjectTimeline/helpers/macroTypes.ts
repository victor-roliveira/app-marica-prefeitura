export type MacroStageStatus =
    | { kind: "ok" }
    | { kind: "delay"; days: number }
    | { kind: "none" };              

export interface MacroStageItem {
    id: string;
    title: string;       
    subtitle: string;     
    progressPct: number;  
    weightPct: number;    
    status: MacroStageStatus;
}

export interface MacroStagesVm {
    title: string;        
    items: MacroStageItem[];
    updatedLabel: string; 
}

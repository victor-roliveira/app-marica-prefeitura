// services/SheetAdapter.ts

import type { ProjectTimelineData, ISODate } from "../components/ProjectTimeline/helpers/types";
import type { ProjectOsData } from "../components/ProjectTimeline/helpers/projectOsTypes";
import type { ProjectDetailsViewModel, HealthStatus } from "../components/ProjectTimeline/helpers/projectDetailsTypes";
import type { MacroStagesVm, MacroStageItem, MacroStageStatus } from "../components/ProjectTimeline/helpers/macroTypes";

import type { 
  PhysicalProgressViewModel, 
  HealthStatus as PhyHealth, 
  Tone as PhyTone 
} from "../components/ProjectTimeline/physicalProgress/types";
import { DeliveryAnalysisViewModel, DeliveryStatusTone } from "../components/ProjectTimeline/deliverayAnalisys/types";

import type { 
  SupportTableViewModel, 
  SupportRowVm, 
  SupportSituation 
} from "../components/ProjectTimeline/supportTable/types";

// ==========================================
// 1. Definição da Linha "Crua"
// ==========================================
export interface RawSheetRow {
  "ID_OS": string;
  "Nome da OS": string;
  "Autarquia Demandante": string;
  "Atividade": string;         
  "Produtos da OS": string;    
  "ETAPAS": string;            
  "Situação do Prazo": string | number;
  "% Avanço da Etapa": string | number; 
  "Data Início Real": string;
  "Data Fim Real": string;     
  "Data de Inauguração da Obra": string;
  "Dias de Atraso": string | number;
  "Última Atualização": string;
  "Prazo para Conclusão da Obra (meses)": string | number;
}

// ==========================================
// 2. Helpers
// ==========================================

const cleanDate = (dateVal: string): ISODate | undefined => {
  if (!dateVal) return undefined;
  const str = String(dateVal).trim();
  if (str.startsWith("1899") || str.startsWith("1900")) return undefined;
  if (str.includes("/")) {
    const parts = str.split("/");
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return str.split("T")[0]; 
};

const cleanPercent = (val: string | number): number => {
  if (typeof val === 'number') return val <= 1 ? val * 100 : val;
  if (!val) return 0;
  const str = String(val).replace('%', '').replace(',', '.').trim();
  const num = parseFloat(str);
  if (isNaN(num)) return 0; 
  return num <= 1 && num > 0 ? num * 100 : num;
};

// ==========================================
// 3. Builders
// ==========================================

function buildDeliveryAnalysis(headerRow: RawSheetRow, osRows: RawSheetRow[], startDate: string, endDate: string, totalPercent: number): DeliveryAnalysisViewModel {
    const delayDays = parseInt(String(headerRow["Dias de Atraso"])) || 0;
    const prazoMeses = parseInt(String(headerRow["Prazo para Conclusão da Obra (meses)"])) || 0;
    
    let plannedDate = endDate;
    if (startDate && prazoMeses > 0) {
        const d = new Date(startDate);
        d.setMonth(d.getMonth() + prazoMeses);
        plannedDate = d.toISOString().split('T')[0];
    }

    let tone: DeliveryStatusTone = "ok";
    if (delayDays > 0) tone = "risco";
    if (delayDays > 30) tone = "critical";

    const delayItems: any[] = [];
    if (delayDays > 0) {
        delayItems.push({ name: "Geral", delayDays: delayDays, tone });
    }

    const impactItems: any[] = [];
    if (delayDays > 0) {
         impactItems.push({ label: "Revisão", pct: 40, tone: "risco", colorKey: "rev_proj" });
         impactItems.push({ label: "Logística", pct: 60, tone: "risco", colorKey: "logistica" });
    } else {
        impactItems.push({ label: "Sem Impactos", pct: 100, tone: "ok", colorKey: "ambiental" });
    }

    return {
        title: "Análise de Entrega",
        deadlineCard: {
            plannedDate: plannedDate,
            currentForecastDate: endDate,
            startLabel: `Início: ${startDate}`,
            deltaDays: delayDays,
            progressPct: totalPercent,
            deltaLabel: delayDays > 0 ? `+${delayDays} dias` : "No prazo",
            tone: tone
        },
        delayByDisciplineTitle: "Atraso por Produto",
        delayByDisciplineTag: "Info",
        delayItems: delayItems,
        impactTitle: "Causas Prováveis",
        impact: { totalPctLabel: "100%", subtitle: "IMPACTO", items: impactItems },
        plannedRealizedTitle: "Planejado x Realizado",
        plannedRealized: {
            statusLabel: "STATUS",
            headline: delayDays > 0 ? "ATRASADO" : "NORMAL",
            headlineTone: tone,
            legendPlannedLabel: "Plan",
            legendRealizedLabel: "Real",
            points: [
                { monthLabel: "Início", planned: 0, realized: 0 },
                { monthLabel: "Atual", planned: Math.min(100, totalPercent + 5), realized: totalPercent }
            ],
            footnote: "*"
        }
    };
}

function buildPhysicalProgress(headerRow: RawSheetRow, totalPercent: number): PhysicalProgressViewModel {
    const delayDays = parseInt(String(headerRow["Dias de Atraso"])) || 0;
    
    let statusLabel: PhyHealth = "Em Dia";
    let tone: PhyTone = "ok";
    let message = "Ritmo adequado.";

    if (delayDays > 0) { statusLabel = "Em Risco"; tone = "risk"; message = `Desvio de ${delayDays} dias.`; }
    if (delayDays > 30) { statusLabel = "Crítico"; tone = "critical"; message = "Atraso crítico."; }

    const months = ["Mês 1", "Mês 2", "Mês 3", "Mês 4", "Atual"];
    const target = Math.min(100, totalPercent + (delayDays > 0 ? 5 : 0));
    const stepPlan = target / 4;
    const planned = [stepPlan, stepPlan*2, stepPlan*3, stepPlan*4, target].map(n => Math.round(n));
    
    const stepReal = totalPercent / 4;
    const actual = [stepReal, stepReal*2, stepReal*3, stepReal*4, totalPercent].map(n => Math.round(n));
    const replanned = planned.map((p, i) => Math.round((p + actual[i]) / 2));
    const costActualM = actual.map(a => parseFloat((a * 0.05).toFixed(1)));

    return {
        header: { title: "Avanço Físico" },
        summary: {
            label: "AVANÇO FÍSICO ATUAL",
            percent: parseFloat(totalPercent.toFixed(1)),
            suffix: "Acumulado",
            statusLabel: statusLabel,
            message: message,
            tone: tone
        },
        milestonesEvolution: {
            title: "Evolução de Marcos",
            deltaLabelRight: "DESVIO",
            deltaValue: delayDays > 0 ? `-${Math.round(target - totalPercent)}%` : "0%",
            deltaTone: tone,
            months: months,
            initialPlanned: planned,
            replanned: replanned,
            actualScatter: actual
        },
        progressComparison: {
            title: "COMPARATIVO",
            months: months,
            planned: planned,
            replanned: replanned,
            actual: actual,
            footnote: "*"
        },
        monthlyExecutionPace: {
            title: "Ritmo Mensal",
            months: months,
            planned: [5, 10, 15, 20, 10],
            actual: [4, 8, 12, 18, 5]
        },
        costVsProgress: {
            title: "Custo x Avanço",
            months: months,
            progressActual: actual,
            costActualM: costActualM,
            costUnitLabel: "R$"
        }
    };
}

function buildSupportTable(osRows: RawSheetRow[]): SupportTableViewModel {
    
    // Helper para formatar data bonita ("14 de jun.")
    const fmtDateLabel = (dateStr: string) => {
        const iso = cleanDate(dateStr);
        if (!iso) return "-";
        const [y, m, d] = iso.split("-").map(Number);
        const date = new Date(y, (m||1)-1, d);
        return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" }).replace(".", "");
    };

    const rows: SupportRowVm[] = osRows.map(row => {
        // Lógica de Situação
        let pct = cleanPercent(row["Situação do Prazo"]);
        if (pct === 0) pct = cleanPercent(row["% Avanço da Etapa"]);

        const diasAtraso = parseInt(String(row["Dias de Atraso"])) || 0;
        const statusTexto = String(row["ETAPAS"]).toLowerCase();

        let situation: SupportSituation = "Em Andamento";

        if (pct >= 100 || statusTexto === "concluido") {
            situation = "Concluída";
            pct = 100; // Força 100 visualmente se estiver concluído
        } else if (diasAtraso > 0) {
            situation = "Atrasado";
        }

        return {
            stageName: row["Produtos da OS"] || row["Atividade"] || "Sem Nome",
            situation: situation,
            endDateLabel: fmtDateLabel(row["Data Fim Real"]),
            progressPct: pct
        };
    });

    return {
        headerTitle: "TABELA DE APOIO",
        tabs: {
            all: "Todas",
            late: "Atrasadas",
            progress: "Em Andamento",
            done: "Concluídas"
        },
        columns: {
            stage: "ETAPA",
            situation: "SITUAÇÃO",
            end: "TÉRMINO",
            progress: "AVANÇO"
        },
        rows: rows
    };
}

// ==========================================
// PARSE PRINCIPAL
// ==========================================
export function parseSheetData(rows: RawSheetRow[]) {
  const grouped: Record<string, RawSheetRow[]> = {};
  
  rows.forEach(row => {
    const id = row["ID_OS"];
    if (!id) return;
    if (!grouped[id]) grouped[id] = [];
    grouped[id].push(row);
  });

  return Object.keys(grouped).map(osId => {
    const osRows = grouped[osId];
    const headerRow = osRows[0];

    // ... (Cálculos comuns repetidos para contexto) ...
    const getProgress = (r: RawSheetRow) => {
        let val = cleanPercent(r["Situação do Prazo"]);
        if (val === 0) val = cleanPercent(r["% Avanço da Etapa"]);
        return val;
    };
    
    const totalPercent = osRows.reduce((acc, r) => acc + getProgress(r), 0) / (osRows.length || 1);
    const startDates = osRows.map(r => cleanDate(r["Data Início Real"])).filter(d => d).sort();
    const endDates = osRows.map(r => cleanDate(r["Data Fim Real"])).filter(d => d).sort();
    const projectStart = startDates[0] || "";
    const projectEnd = endDates[endDates.length - 1] || "";
    const inauguration = projectEnd; 

    // 1. TIMELINE
    const timelineData: ProjectTimelineData = {
      project: {
        project_id: osId,
        name_project: headerRow["Nome da OS"],
        overall_percent: parseFloat(totalPercent.toFixed(1)),
        start_date: projectStart,
        end_date: projectEnd,
        inauguration_date: inauguration,
        status: totalPercent >= 100 ? "Concluído" : "Em andamento"
      },
      stages: [],
      progress: [],
      milestones: [], 
      alterations: []
    };

    osRows.forEach((row, idx) => {
      const stepId = `${osId}-STEP-${idx}`;
      const stepName = row["Produtos da OS"] || row["Atividade"] || "Sem Nome";
      const pct = getProgress(row);

      timelineData.stages.push({
        step_id: stepId,
        step_name: stepName,
        view_order: idx + 1,
        orientation_text: "horizontal",
        checked_icon: "", 
        default_color: "#3b82f6" 
      });

      timelineData.progress.push({
        project_id: osId,
        step_id: stepId,
        advance_percent: pct,
        step_start_date: cleanDate(row["Data Início Real"]) || "",
        step_end_date: cleanDate(row["Data Fim Real"]) || "",
        show_percent: true,
        completed: row["ETAPAS"]?.toLowerCase() === "concluido" || pct >= 100
      });
    });

    // 2. DETAILS VM
    const delayDays = parseInt(String(headerRow["Dias de Atraso"])) || 0;
    let health: HealthStatus = delayDays > 0 ? "Crítico" : (delayDays < 0 ? "Em Dia" : "Em Risco");

    const detailsVm: ProjectDetailsViewModel = {
      title: headerRow["Nome da OS"],
      updatedAt: cleanDate(headerRow["Última Atualização"]),
      kpis: {
        expectedDelivery: inauguration,
        physicalProgressPercent: parseFloat(totalPercent.toFixed(1)),
        physicalTag: health,
        delayDays: delayDays,
        overallHealth: health,
        expectedDeliveryLabel: "Inauguração Prevista"
      }
    };

    // 3. OS DATA
    const osData: ProjectOsData = {
      summary: {
        title: headerRow["Nome da OS"],
        osCode: osId,
        status: totalPercent >= 100 ? "Encerrada" : "Ativa",
        requester: headerRow["Autarquia Demandante"],
        durationText: `${headerRow["Prazo para Conclusão da Obra (meses)"] || 0} Meses`,
        contractStart: projectStart,
        expectedEnd: inauguration
      },
      objectText: `Objeto referente à ${headerRow["Nome da OS"]}`,
      scope: { includes: [], excludes: [] },
      contractMilestones: [],
      expectedProducts: [],
      notes: []
    };

    // 4. MACRO VIEW
    const macroItems: MacroStageItem[] = osRows.map((row, idx) => {
        const dias = parseInt(String(row["Dias de Atraso"])) || 0;
        return {
            id: `${osId}-MACRO-${idx}`,
            title: row["Produtos da OS"] || "Geral",
            subtitle: row["Atividade"],
            progressPct: getProgress(row),
            weightPct: 1,
            status: dias > 0 ? { kind: "delay", days: dias } : { kind: "ok" }
        };
    });
    const macroVm: MacroStagesVm = { title: "Visão Macro", items: macroItems, updatedLabel: "" };
    
    // ==========================================
    // CORREÇÃO AQUI: Chamada REAL das funções
    // ==========================================
    const deliveryAnalysis = buildDeliveryAnalysis(headerRow, osRows, projectStart, inauguration, totalPercent);
    const physicalProgress = buildPhysicalProgress(headerRow, totalPercent);
    const supportTable = buildSupportTable(osRows);

    return {
      osId,
      timelineData,
      detailsVm,
      osData,
      macroVm,
      deliveryAnalysis,
      physicalProgress,
      supportTable
    };
  });
}
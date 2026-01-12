import type { ProjectTimelineData } from "./types";

export const curvaMock: ProjectTimelineData = {
    project: {
        project_id: "CUR02",
        name_project: "Curva Di Branco",
        overall_percent: 60,
        start_date: "2025-05-01",
        end_date: "2027-10-02",
        inauguration_date: "2027-10-02",
        status: "Em andamento",
    },

    stages: [
        { step_id: "ET01", step_name: "Plano de Trabalho", view_order: 1, orientation_text: "vertical", checked_icon: "✅", default_color: "#2196F3" },
        { step_id: "ET02", step_name: "Arquitetura", view_order: 2, orientation_text: "vertical", checked_icon: "✅", default_color: "#2196F3" },
        { step_id: "ET03", step_name: "Engenharia", view_order: 3, orientation_text: "vertical", checked_icon: "✅", default_color: "#2196F3" },
        { step_id: "ET04", step_name: "Orçamento", view_order: 4, orientation_text: "vertical", checked_icon: "✅", default_color: "#2196F3" },
        { step_id: "ET05", step_name: "Modelagem", view_order: 5, orientation_text: "vertical", checked_icon: "✅", default_color: "#2196F3" },
        { step_id: "ET06", step_name: "Validação", view_order: 6, orientation_text: "vertical", checked_icon: "✅", default_color: "#2196F3" },
        { step_id: "ET07", step_name: "Licitação", view_order: 7, orientation_text: "vertical", checked_icon: "✅", default_color: "#2196F3" },
        { step_id: "ET08", step_name: "Obra", view_order: 8, orientation_text: "vertical", checked_icon: "✅", default_color: "#2196F3" },
    ],

    progress: [
        { project_id: "CUR02", step_id: "ET01", advance_percent: 100, step_start_date: "2025-05-01", step_end_date: "2025-06-15", show_percent: true, completed: true },
        { project_id: "CUR02", step_id: "ET02", advance_percent: 100, step_start_date: "2025-06-10", step_end_date: "2025-08-30", show_percent: true, completed: true },
        { project_id: "CUR02", step_id: "ET03", advance_percent: 85, step_start_date: "2025-08-15", step_end_date: "2025-11-15", show_percent: true, completed: false },
        { project_id: "CUR02", step_id: "ET04", advance_percent: 60, step_start_date: "2025-09-01", step_end_date: "2026-02-20", show_percent: true, completed: false },
        { project_id: "CUR02", step_id: "ET05", advance_percent: 40, step_start_date: "2025-11-01", step_end_date: "2026-07-01", show_percent: true, completed: false },
        { project_id: "CUR02", step_id: "ET06", advance_percent: 20, step_start_date: "2026-01-15", step_end_date: "2026-10-01", show_percent: true, completed: false },
        { project_id: "CUR02", step_id: "ET07", advance_percent: 0, step_start_date: "2026-10-01", step_end_date: "2027-02-01", show_percent: true, completed: false },
        { project_id: "CUR02", step_id: "ET08", advance_percent: 0, step_start_date: "2027-02-01", step_end_date: "2027-10-02", show_percent: true, completed: false },
    ],

    milestones: [
        { project_id: "CUR02", milestone_id: "M01", description: "Início do Projeto", milestone_date: "2025-05-01", milestone_type: "início", fixed: true },
        { project_id: "CUR02", milestone_id: "M02", description: "Entrega Projeto Básico", milestone_date: "2025-11-15", milestone_type: "intermediário", fixed: false },
        { project_id: "CUR02", milestone_id: "M03", description: "Entrega Projeto Executivo", milestone_date: "2026-07-01", milestone_type: "intermediário", fixed: false },
        { project_id: "CUR02", milestone_id: "M04", description: "Inauguração", milestone_date: "2027-10-02", milestone_type: "final", fixed: true },
    ],

    alterations: [
        {
            project_id: "CUR02",
            change_number: 1,
            change_date: "2025-08-15",
            impact_start_date: "2025-08-15",
            impact_end_date: "2025-10-25",
            description: "Atraso por ajuste de escopo",

            step_impact_id: "ET03",
            step_impact_ids: ["ET03"],

            start_impact: false,
            end_impact: true,
            new_end_date: "2025-12-10",

            change_color: "#FF9800",
            icon: "⏸️",
        },
        {
            project_id: "CUR02",
            change_number: 2,
            change_date: "2025-11-15",
            impact_start_date: "2025-11-16",
            impact_end_date: "2026-04-05",
            description: "Revisão orçamentária solicitada",

            step_impact_id: "ET05",
            step_impact_ids: ["ET05"],

            start_impact: true,
            end_impact: true,
            new_start_date: "2025-11-10",
            new_end_date: "2026-08-01",

            change_color: "#FF9800",
            icon: "⏸️",
        },
        {
            project_id: "CUR02",
            change_number: 3,
            change_date: "2026-02-20",
            impact_start_date: "2026-01-26",
            impact_end_date: "2026-03-05",
            description: "Ajuste de cronograma por licitação",

            step_impact_id: "ET06",
            step_impact_ids: ["ET06"],

            start_impact: false,
            end_impact: true,

            // Ajustado para atraso (baseline ET06 era 2026-10-01)
            new_end_date: "2026-11-15",

            change_color: "#FF9800",
            icon: "⏸️",
        },
    ],

    config: {
        color_inauguration: "#0A2A66",
        width_bar_inauguration: 24,
        height_bar_step: 32,
        show_icons_checked: true,
    },
};

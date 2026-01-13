import type { ProjectTimelineData } from "./types";
import type { ProjectDetailsViewModel, ProjectOsData } from "./projectDetailsTypes";

import { batalhaoMock } from "./mock";
import { curvaMock } from "./mockCUR";

export type ProjectId = string;

export interface ProjectOption {
  id: ProjectId;
  label: string;
  subtitle?: string;
}

export interface ProjectScreenData {
  timeline: ProjectTimelineData;
  details: ProjectDetailsViewModel;
  os: ProjectOsData; 
}

export const projectOptions: ProjectOption[] = [
  { id: "BAT01", label: "Batalhão", subtitle: "SOMAR • 2023-8856" },
  { id: "CUR02", label: "Curva Di Branco", subtitle: "SOMAR • 2023-3262" },
];

export const projectsCatalog: Record<ProjectId, ProjectScreenData> = {
  BAT01: {
    timeline: batalhaoMock,
    details: {
      title: "Batalhão",
      chips: [
        { icon: "mdi-pound", label: "2023-8841" },
        { icon: "mdi-domain", label: "SOMAR" },
      ],
      updatedText: "ATUALIZADO: HOJE, 09:30",
      actions: {
        reportLabel: "Relatório IA",
        reportIcon: "mdi-creation",
        reportRoute: "/projetos/BAT01/relatorio",
        onReport: () => {},

        osObjectLabel: "Objeto da OS",
        osObjectIcon: "mdi-file-document-outline",
        osObjectRoute: "/acompanhamento/BAT01/os",
        onOsObject: () => {},
      },
      kpis: {
        expectedDeliveryLabel: "Previsão de entrega",
        expectedDelivery: batalhaoMock.project.end_date,

        physicalProgressLabel: "Progresso físico",
        physicalProgressPercent: 68,
        physicalTag: "Em Dia",

        delayDaysLabel: "Dias de atraso",
        delayDays: 14,

        overallHealthLabel: "Saúde do projeto",
        overallHealth: "Em Risco",
      },
    },

    os: {
      summary: {
        title: "CONSTRUÇÃO BATALHÃO PMM",
        osCode: "#OS-2023-014",
        status: "Ativa",
        requester: "SOMAR",
        durationText: "24 Meses",
        contractStart: "2025-05-01",
        expectedEnd: "2027-10-02",
      },
      objectText:
        "Esta Ordem de Serviço tem como objetivo a elaboração de projetos, execução de obras e serviços necessários para a implantação do Batalhão, conforme diretrizes contratuais e especificações estabelecidas no escopo.",
      scope: {
        includes: [
          "Elaboração de projetos (arquitetura, engenharia e orçamento)",
          "Modelagem e compatibilização",
          "Apoio ao processo licitatório",
          "Execução da obra",
        ],
        excludes: [
          "Operação da unidade após entrega",
          "Manutenção pós-obra",
          "Serviços fora do perímetro contratual",
        ],
      },
      contractMilestones: [
        {
          id: "BAT-CM1",
          title: "Marco 1 – Conclusão dos Projetos",
          linkText: "Vínculo: Etapas técnicas (ET01–ET06)",
          status: "OK",
        },
        {
          id: "BAT-CM2",
          title: "Marco 2 – Finalização da Licitação",
          linkText: "Vínculo: ET07 (Licitação)",
          status: "Atenção",
        },
        {
          id: "BAT-CM3",
          title: "Marco 3 – Entrega da Obra",
          linkText: "Vínculo: ET08 (Obra)",
          status: "Em atraso",
        },
      ],
      expectedProducts: [
        {
          id: "BAT-P1",
          title: "Projetos técnicos entregues",
          subtitle: "Arquitetura, Engenharia e Orçamento",
          icon: "mdi-file-document-outline",
        },
        {
          id: "BAT-P2",
          title: "Documentações e laudos",
          subtitle: "Memoriais, ART/RRT, relatórios",
          icon: "mdi-text-box-check-outline",
        },
        {
          id: "BAT-P3",
          title: "Obra concluída",
          subtitle: "Infraestrutura finalizada",
          icon: "mdi-domain",
        },
      ],
      notes: [
        "Premissas contratuais podem exigir reprogramação em caso de impedimentos externos.",
        "Dependências de aprovações e liberações de órgãos competentes podem impactar o cronograma.",
      ],
    },
  },

  CUR02: {
    timeline: curvaMock,
    details: {
      title: "Curva Di Branco",
      chips: [
        { icon: "mdi-pound", label: "2023-3262" },
        { icon: "mdi-domain", label: "SOMAR" },
      ],
      updatedText: "ATUALIZADO: HOJE, 09:30",
      actions: {
        reportLabel: "Relatório IA",
        reportIcon: "mdi-creation",
        reportRoute: "/projetos/CUR02/relatorio",
        onReport: () => {},

        osObjectLabel: "Objeto da OS",
        osObjectIcon: "mdi-file-document-outline",
        osObjectRoute: "/acompanhamento/CUR02/os",
        onOsObject: () => {},
      },
      kpis: {
        expectedDeliveryLabel: "Previsão de entrega",
        expectedDelivery: curvaMock.project.end_date,

        physicalProgressLabel: "Progresso físico",
        physicalProgressPercent: 68,
        physicalTag: "Em Risco",

        delayDaysLabel: "Dias de atraso",
        delayDays: 14,

        overallHealthLabel: "Saúde do projeto",
        overallHealth: "Em Dia",
      },
    },

    os: {
      summary: {
        title: "INTERVENÇÃO CURVA DI BRANCO",
        osCode: "#OS-2023-026",
        status: "Ativa",
        requester: "SOMAR",
        durationText: "24 Meses",
        contractStart: "2025-05-01",
        expectedEnd: "2027-10-02",
      },
      objectText:
        "Esta Ordem de Serviço tem como objetivo a elaboração de projetos e execução de serviços necessários para a intervenção na Curva Di Branco, garantindo adequações técnicas e entrega conforme escopo contratual.",
      scope: {
        includes: [
          "Projetos e compatibilização",
          "Orçamento e planejamento",
          "Apoio à contratação/licitação",
          "Execução da intervenção",
        ],
        excludes: [
          "Manutenção corretiva após entrega",
          "Intervenções fora da área definida",
        ],
      },
      contractMilestones: [
        {
          id: "CUR-CM1",
          title: "Marco 1 – Conclusão dos Projetos",
          linkText: "Vínculo: Etapas técnicas (ET01–ET06)",
          status: "OK",
        },
        {
          id: "CUR-CM2",
          title: "Marco 2 – Finalização da Licitação",
          linkText: "Vínculo: ET07 (Licitação)",
          status: "OK",
        },
        {
          id: "CUR-CM3",
          title: "Marco 3 – Entrega da Obra",
          linkText: "Vínculo: ET08 (Obra)",
          status: "Atenção",
        },
      ],
      expectedProducts: [
        {
          id: "CUR-P1",
          title: "Projetos técnicos entregues",
          subtitle: "Arquitetura, Engenharia e Orçamento",
          icon: "mdi-file-document-outline",
        },
        {
          id: "CUR-P2",
          title: "Documentações e laudos",
          subtitle: "Memoriais, ART/RRT, relatórios",
          icon: "mdi-text-box-check-outline",
        },
        {
          id: "CUR-P3",
          title: "Intervenção concluída",
          subtitle: "Execução finalizada",
          icon: "mdi-road-variant",
        },
      ],
      notes: [
        "Marcos podem sofrer ajustes conforme condições de campo e aprovações.",
        "Execução depende de liberações e condições climáticas em períodos críticos.",
      ],
    },
  },
};

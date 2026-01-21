import { MacroStagesVm } from "./macroTypes";


export const macroStagesMock: MacroStagesVm = {
  title: "STATUS DAS MACROETAPAS",
  updatedLabel: "AGORA",
  items: [
    {
      id: "estudos",
      title: "Estudos Iniciais",
      subtitle: "PLANO + ESTUDOS",
      progressPct: 100,
      weightPct: 5,
      status: { kind: "ok" },
    },
    {
      id: "projeto",
      title: "Projeto",
      subtitle: "ARQ+ENG+ORÇ+BIM",
      progressPct: 100,
      weightPct: 10,
      status: { kind: "ok" },
    },
    {
      id: "licitacao",
      title: "Licitação",
      subtitle: "PROCESSO ADM.",
      progressPct: 85,
      weightPct: 5,
      status: { kind: "delay", days: 15 },
    },
    {
      id: "obra",
      title: "Obra",
      subtitle: "EXECUÇÃO FÍSICA",
      progressPct: 68,
      weightPct: 75,
      status: { kind: "delay", days: 14 },
    },
    {
      id: "orc-bim",
      title: "Orçamento e Modela...",
      subtitle: "DOC + MODELAGEM BIM",
      progressPct: 0,
      weightPct: 5,
      status: { kind: "none" },
    },
  ],
};

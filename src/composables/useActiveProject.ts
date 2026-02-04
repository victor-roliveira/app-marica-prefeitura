// composables/useActiveProject.ts
import { computed, ref } from "vue";
import { parseSheetData, type RawSheetRow } from "../services/SheetAdapter";

// IMPORTANTE: Importe todas as interfaces que compõem o projeto
import type { ProjectTimelineData } from "../components/ProjectTimeline/helpers/types";
import type { ProjectDetailsViewModel } from "../components/ProjectTimeline/helpers/projectDetailsTypes";
import type { MacroStagesVm } from "../components/ProjectTimeline/helpers/macroTypes";
import type { ProjectOsData } from "../components/ProjectTimeline/helpers/projectOsTypes";
import { DeliveryAnalysisViewModel } from "../components/ProjectTimeline/deliverayAnalisys/types";
import { PhysicalProgressViewModel } from "../components/ProjectTimeline/physicalProgress/types";
import { SupportTableViewModel } from "../components/ProjectTimeline/supportTable/types";

// === CORREÇÃO: Definição do Tipo Combinado ===
// Coloque isso aqui, antes das variáveis de estado
export type ProjectCompleteData = ProjectTimelineData & {
  details: ProjectDetailsViewModel;
  macro: MacroStagesVm;
  osData: ProjectOsData;
  deliveryAnalysis: DeliveryAnalysisViewModel;
  physicalProgress: PhysicalProgressViewModel;
  supportTable: SupportTableViewModel;
};

// --- ESTADO GLOBAL (Singleton) ---
const activeProjectId = ref<string>("");
const isLoading = ref(false);
const error = ref<string | null>(null);

// Agora o TypeScript sabe o que é ProjectCompleteData
const projectsCatalog = ref<Record<string, ProjectCompleteData>>({});
const projectOptions = ref<Array<{ id: string; label: string }>>([]);

export function useActiveProject() {

  // URL da sua API (Backend Proxy)
  // Ajuste conforme seu ambiente (ex: 'http://localhost:3000/api/projects' localmente)
  const API_URL = "/api/projects";

  const loadProjects = async () => {
    // Evita recarregar se já tiver dados
    if (projectOptions.value.length > 0) return;

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erro ao conectar na API");

      const rawData: RawSheetRow[] = await response.json();

      // O Adapter processa o JSON
      const parsedProjects = parseSheetData(rawData);

      const newCatalog: Record<string, ProjectCompleteData> = {};
      const newOptions: Array<{ id: string; label: string }> = [];

      parsedProjects.forEach(p => {
        // Monta o objeto completo juntando as partes
        newCatalog[p.osId] = {
          ...p.timelineData, // Espalha as propriedades da timeline na raiz
          details: p.detailsVm,
          macro: p.macroVm,
          osData: p.osData, 
          deliveryAnalysis: p.deliveryAnalysis,
          physicalProgress: p.physicalProgress,
          supportTable: p.supportTable
        };

        newOptions.push({
          id: p.osId,
          label: `${p.osId} - ${p.detailsVm.title}`
        });
      });

      projectsCatalog.value = newCatalog;
      projectOptions.value = newOptions;

      // Seleciona o primeiro projeto automaticamente
      if (!activeProjectId.value && newOptions.length > 0) {
        activeProjectId.value = newOptions[0].id;
      }

    } catch (err) {
      console.error(err);
      error.value = "Falha ao carregar dados do projeto.";
    } finally {
      isLoading.value = false;
    }
  };

  const setActiveProject = (id: string) => {
    if (!id) return;
    if (!projectsCatalog.value[id]) return;
    activeProjectId.value = id;
  };

  const screenData = computed(() => {
    return projectsCatalog.value[activeProjectId.value] || null;
  });

  return {
    activeProjectId,
    options: projectOptions,
    isLoading,
    error,
    loadProjects,
    setActiveProject,
    setActiveProjectId: setActiveProject,
    screenData,
  };
}
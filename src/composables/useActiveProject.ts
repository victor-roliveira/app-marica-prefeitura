import { computed, ref } from "vue";
import { projectOptions, projectsCatalog } from "../components/ProjectTimeline/projectsCatalog";

const activeProjectId = ref(projectOptions[0]?.id ?? "BAT01");

export function useActiveProject() {
  const options = projectOptions;

  const setActiveProject = (id: string) => {
    if (!id) return;
    if (!projectsCatalog[id]) return;
    activeProjectId.value = id;
  };

  const setActiveProjectId = setActiveProject;

  const screenData = computed(() => projectsCatalog[activeProjectId.value]);

  return {
    activeProjectId,
    options,
    setActiveProject,
    setActiveProjectId,
    screenData,
  };
}

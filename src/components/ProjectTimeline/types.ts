export type ISODate = string;

export type ProjectStatus = "Planejado" | "Em andamento" | "Concluído";

export type TextOrientation = "vertical" | "horizontal";

export type MilestoneType = "início" | "intermediário" | "final";

export type AxisMarker =
  | {
      kind: "milestone";
      key: string;
      date: ISODate;
      milestone: Milestone;
    }
  | {
      kind: "step-end";
      key: string;
      date: ISODate;
      step_id: string;
      step_name: string;
      end_type: "baseline" | "replanned";
    }
  | {
      kind: "alteration";
      key: string;
      date: ISODate;
      alteration: Alteration;
    };

export interface Project {
  project_id: string;
  name_project: string;
  overall_percent: number;
  start_date: ISODate;
  end_date: ISODate;
  inauguration_date: ISODate;
  status: ProjectStatus;
}

export interface Stage {
  step_id: string;
  step_name: string;
  view_order: number;
  orientation_text: TextOrientation;
  checked_icon: string;
  default_color: string;
}

export interface StageProgress {
  project_id: string;
  step_id: string;
  advance_percent: number;
  step_start_date: ISODate;
  step_end_date: ISODate;
  show_percent: boolean;
  completed: boolean;
}

export interface Milestone {
  project_id: string;
  milestone_id: string;
  description: string;
  milestone_date: ISODate;
  milestone_type: MilestoneType;
  fixed: boolean;
}

export interface Alteration {
  project_id: string;
  change_number: number;
  change_date: ISODate;
  impact_start_date?: ISODate;
  impact_end_date?: ISODate;
  description: string;
  step_impact_ids?: string[];
  step_impact_id?: string;
  start_impact: boolean;
  end_impact: boolean;
  new_start_date?: ISODate;
  new_end_date?: ISODate;
  change_color: string;
  icon: string;
}

export interface TimelineConfig {
  color_inauguration?: string;
  width_bar_inauguration?: number;
  height_bar_step?: number;
  show_icons_checked?: boolean;
}

export interface ProjectTimelineData {
  project: Project;
  stages: Stage[];
  progress: StageProgress[];
  milestones: Milestone[];
  alterations: Alteration[];
  config?: TimelineConfig;
}

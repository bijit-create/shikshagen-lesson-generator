
export interface LessonParams {
  grade: string;
  subject: string;
  loCode: string;
  learningObjective: string;
  topicOutcome: string;
  regionalLanguage: string;
  ncertContext?: string;
  ncertPdf?: {
    name: string;
    data: string;
    mimeType: string;
  };
  customIcon?: string;
  refinedBlocks?: EditableBlocks; // New field for regeneration
}

export interface EditableBlocks {
  title: string;
  objective: string;
  intro_text: string;
  worked_example_steps: string[];
  practice_questions: { question: string; answer: string }[];
  word_problem: { question: string; steps: string[]; answer: string };
  reflection_question: string;
}

export interface GeneratedLesson {
  regional_html_pages: string[];
  english_html_pages: string[];
  editable_blocks: EditableBlocks;
}

export enum ViewMode {
  FORM = 'FORM',
  SPLIT = 'SPLIT',
  REGIONAL = 'REGIONAL',
  ENGLISH = 'ENGLISH',
  EDIT = 'EDIT'
}

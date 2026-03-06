export type MigrationProfile = {
  targetCountry: string;
  jobTrack: string;
  nativeLang: string;
  targetLang: string;
};

export type DocumentStatus = "missing" | "uploaded" | "needs_translation";

export type DocumentItem = {
  id: string;
  type: string;
  title: string;
  status: DocumentStatus;
  fileUri?: string;
  updatedAt: number;
  requiresTranslation?: boolean;
};

export type ProcessStatus = {
  recognitionStatus: "not_started" | "in_review" | "approved" | "rejected";
  visaStatus: "not_started" | "in_review" | "approved" | "rejected";
};

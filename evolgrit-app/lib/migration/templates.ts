import type { DocumentItem, MigrationProfile, ProcessStatus } from "./types";

export function defaultProfile(): MigrationProfile {
  return {
    targetCountry: "Germany",
    jobTrack: "Pflege",
    nativeLang: "en",
    targetLang: "de",
  };
}

export function defaultProcessStatus(): ProcessStatus {
  return {
    recognitionStatus: "not_started",
    visaStatus: "not_started",
  };
}

export function defaultDocuments(): DocumentItem[] {
  const now = Date.now();
  return [
    {
      id: "passport",
      type: "passport",
      title: "Passport",
      status: "missing",
      updatedAt: now,
      requiresTranslation: false,
    },
    {
      id: "diploma",
      type: "diploma",
      title: "Diploma",
      status: "missing",
      updatedAt: now,
      requiresTranslation: true,
    },
    {
      id: "transcript",
      type: "transcript",
      title: "Transcript",
      status: "missing",
      updatedAt: now,
      requiresTranslation: true,
    },
    {
      id: "license",
      type: "license",
      title: "License",
      status: "missing",
      updatedAt: now,
      requiresTranslation: true,
    },
    {
      id: "cv",
      type: "cv",
      title: "CV",
      status: "missing",
      updatedAt: now,
      requiresTranslation: false,
    },
    {
      id: "work_experience",
      type: "work_experience",
      title: "Work experience proof",
      status: "missing",
      updatedAt: now,
      requiresTranslation: true,
    },
  ];
}

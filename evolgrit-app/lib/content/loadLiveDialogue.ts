import { loadAvatars } from "../avatars/loadAvatars";
import { DEFAULT_AVATAR_ID } from "../avatars/avatarStore";
import type { Avatar } from "../../types/avatars";

export type LiveDialogue = any;

const liveIndex = require("../../content/b1/live/index.json");

export function loadLiveDialogue(id: string, avatarId?: string): LiveDialogue {
  const b1Registry: Record<string, any> = {
    b1_live_01_meinung_markt: require("../../content/b1/live/b1_live_01_meinung_markt.json"),
    b1_live_02_problem_job: require("../../content/b1/live/b1_live_02_problem_job.json"),
    b1_live_03_termin_umplanen: require("../../content/b1/live/b1_live_03_termin_umplanen.json"),
    b1_live_02_termin_verschieben: require("../../content/b1/live/b1_live_02_termin_verschieben.json"),
    b1_live_03_beschwerde_loesung: require("../../content/b1/live/b1_live_03_beschwerde_loesung.json"),
    pflege_live_01_handover: require("../../content/b1/live/pflege_live_01_handover.json"),
    pflege_live_02_pain: require("../../content/b1/live/pflege_live_02_pain.json"),
    pflege_live_03_call_doctor: require("../../content/b1/live/pflege_live_03_call_doctor.json"),
  };

  const jobRegistry: Record<string, any> = {
    job_pflege_live_01_aufnahme: require("../../content/job/pflege/live/job_pflege_live_01_aufnahme.json"),
    job_pflege_live_02_schmerzen: require("../../content/job/pflege/live/job_pflege_live_02_schmerzen.json"),
    job_pflege_live_03_uebergabe: require("../../content/job/pflege/live/job_pflege_live_03_uebergabe.json"),
    job_pflege_live_04_schmerz_verlauf: require("../../content/job/pflege/live/job_pflege_live_04_schmerz_verlauf.json"),
    job_pflege_live_05_massnahmen_ankuendigen: require("../../content/job/pflege/live/job_pflege_live_05_massnahmen_ankuendigen.json"),
    job_pflege_live_06_alarmzeichen_hilfe: require("../../content/job/pflege/live/job_pflege_live_06_alarmzeichen_hilfe.json"),
    job_pflege_live_07_medikament_ankuendigen: require("../../content/job/pflege/live/job_pflege_live_07_medikament_ankuendigen.json"),
    job_pflege_live_08_zeitplan_erklaeren: require("../../content/job/pflege/live/job_pflege_live_08_zeitplan_erklaeren.json"),
    job_pflege_live_09_rueckfragen_allergie: require("../../content/job/pflege/live/job_pflege_live_09_rueckfragen_allergie.json"),
    job_pflege_live_10_uebergabe_struktur: require("../../content/job/pflege/live/job_pflege_live_10_uebergabe_struktur.json"),
    job_pflege_live_11_kurz_dokumentieren: require("../../content/job/pflege/live/job_pflege_live_11_kurz_dokumentieren.json"),
    job_pflege_live_12_rueckfragen_bestaetigen: require("../../content/job/pflege/live/job_pflege_live_12_rueckfragen_bestaetigen.json"),
    job_pflege_live_04_vital_bp_puls: require("../../content/job/pflege/live/job_pflege_live_04_vital_bp_puls.json"),
    job_pflege_live_05_vital_temp_spo2: require("../../content/job/pflege/live/job_pflege_live_05_vital_temp_spo2.json"),
    job_pflege_live_06_vital_auffaellig: require("../../content/job/pflege/live/job_pflege_live_06_vital_auffaellig.json"),
    job_pflege_live_07_hygiene_haende: require("../../content/job/pflege/live/job_pflege_live_07_hygiene_haende.json"),
    job_pflege_live_08_sicherheit_sturz: require("../../content/job/pflege/live/job_pflege_live_08_sicherheit_sturz.json"),
    job_pflege_live_09_lagerung_klingel: require("../../content/job/pflege/live/job_pflege_live_09_lagerung_klingel.json"),
    job_pflege_live_10_deeskalation_patient: require("../../content/job/pflege/live/job_pflege_live_10_deeskalation_patient.json"),
    job_pflege_live_11_deeskalation_angehoerige: require("../../content/job/pflege/live/job_pflege_live_11_deeskalation_angehoerige.json"),
    job_pflege_live_12_erklaeren_wartezeit: require("../../content/job/pflege/live/job_pflege_live_12_erklaeren_wartezeit.json"),
  };

  const indexed = Array.isArray(liveIndex?.items)
    ? liveIndex.items.find((item: any) => item?.id === id)
    : null;

  const dialogue = indexed ? b1Registry[id] : jobRegistry[id];

  if (!dialogue) {
    throw new Error(`[live] unknown id: ${id}`);
  }

  const avatars = loadAvatars();
  const selectedId = avatarId ?? DEFAULT_AVATAR_ID;
  const selectedAvatar = avatars.find((a: Avatar) => a.id === selectedId) ?? avatars[0] ?? null;
  return { ...dialogue, avatar: selectedAvatar, indexed };
}

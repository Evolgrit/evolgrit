import type { A1Week } from "../../types/a1Content";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const week1 = require("../../content/a1/a1_week1.json") as A1Week;

export function loadA1Week(week: number): A1Week {
  switch (week) {
    case 1:
      return week1;
    default:
      throw new Error(`A1 week ${week} not implemented`);
  }
}

"use client";
import { useState } from "react";
import type { Dictionary } from "@/content/types";
import { recoveryDay } from "@/lib/recovery/recovery-day";
import { DoctorOkRules } from "./DoctorOkRules";
import { RecoveryWeek } from "./RecoveryWeek";
export function RecoveryExplorer({
  doctorOk,
  recovery,
}: Pick<Dictionary, "doctorOk" | "recovery">) {
  const [day, setDay] = useState(3);
  const view = recoveryDay(day, doctorOk.rows, recovery.rows);
  return (
    <>
      <DoctorOkRules copy={doctorOk} view={view} onDay={setDay} />
      <RecoveryWeek copy={recovery} activeRow={view.rowIndex} />
    </>
  );
}

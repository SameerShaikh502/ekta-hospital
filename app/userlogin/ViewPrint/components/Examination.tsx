"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

import { VitalsData } from "./Vitals";
import { ClinicalNotesData } from "./ClinicalNotes";

// ==========================================
// INVESTIGATIONS DATA
// ==========================================

type InvestigationsData = {
  Normal_Sinus_ECG: string;
  Other_Ecg_Findings: string;

  Normal_NO_RWMA_2D_Echo: string;
  Grade_1_2D_Echo: string;
  other_2D_Echo: string;

  TMT_Blood: string;
  CAG_Blood: string;

  CBC_Blood: string;
  MT_Blood: string;
  HIV_Blood: string;
  HbA1C_Blood: string;
  Anti_HCV_Blood: string;
  Serum_Lipids_Blood: string;

  FI_CBC: string;
  FI_SerumCreatinine: string;
  FI_SerumElectrolyte: string;
  FI_TSH: string;
  FI_T3: string;
  FI_T4: string;
  FI_Hb: string;
  FI_HbA1c: string;
  FI_RFT: string;
  FI_LFT: string;
  FI_TroponinI: string;
  FI_SerumLipids: string;
  FI_MP_Widal: string;
};

// ==========================================
// CHIEF COMPLAINTS DATA
// ==========================================

type ChiefComplaintsData = {
  Typical_Chest_Pain_Since: string;
  Angina_on_Exertion_Since: string;
  Breathlessness_Exertion_Since: string;
  Breathlessness_Not_on_Exertion_Since: string;
  Other_Chief_Complaints: string;
};

// ==========================================
// PROPS
// ==========================================

type ExaminationProps = {
  patientId: string | null;
  appointmentId: string | null;

  isSaved: boolean;

  // Complete examination data
  vitals: VitalsData;

  clinicalNotes: ClinicalNotesData;

  investigations: InvestigationsData;

  chiefComplaints: ChiefComplaintsData;
};

// ==========================================
// COMPONENT
// ==========================================

export default function Examination({
  patientId,
  appointmentId,
  isSaved,
  vitals,
  clinicalNotes,
  investigations,
  chiefComplaints,
}: ExaminationProps) {

  const [saving, setSaving] = useState(false);

  const [examinationSaved, setExaminationSaved] =
    useState(false);

  // ==========================================
  // SAVE PATIENT EXAMINATION
  // ==========================================

  async function handleSaveExamination() {

    // ========================================
    // VALIDATION
    // ========================================

    if (!patientId) {
      alert("Patient ID not found");
      return;
    }

    if (!appointmentId) {
      alert("Appointment ID not found");
      return;
    }

    // ========================================
    // COMPLETE API DATA
    // ========================================

    const data = {

      // ======================================
      // PATIENT
      // ======================================

      UserId: patientId,

      Appointmentid: appointmentId,

      // ======================================
      // VITALS
      // ======================================

      // Weight: vitals.Weight,

      PulseRate: vitals.PulseRate,

      // RespRate: vitals.RespRate,

      SpO2: vitals.SpO2,

      BpSystolic: vitals.BpSystolic,

      // BpDiastolic: vitals.BpDiastolic,

      // Temperature: vitals.Temperature,

      // RBS: vitals.RBS,

      // ======================================
      // CLINICAL NOTES
      // ======================================

      K_C_O: clinicalNotes.K_C_O,

      Past_history:
        clinicalNotes.Past_history,

      Observations:
        clinicalNotes.Observations,

      Diagnosis:
        clinicalNotes.Diagnosis,

      Personal_Notes:
        clinicalNotes.Personal_Notes,

      // ======================================
      // INVESTIGATIONS
      // ======================================

      Normal_Sinus_ECG:
        investigations.Normal_Sinus_ECG,

      Other_Ecg_Findings:
        investigations.Other_Ecg_Findings,

      Normal_NO_RWMA_2D_Echo:
        investigations.Normal_NO_RWMA_2D_Echo,

      Grade_1_2D_Echo:
        investigations.Grade_1_2D_Echo,

      other_2D_Echo:
        investigations.other_2D_Echo,

      TMT_Blood:
        investigations.TMT_Blood,

      CAG_Blood:
        investigations.CAG_Blood,

      CBC_Blood:
        investigations.CBC_Blood,

      MT_Blood:
        investigations.MT_Blood,

      HIV_Blood:
        investigations.HIV_Blood,

      HbA1C_Blood:
        investigations.HbA1C_Blood,

      Anti_HCV_Blood:
        investigations.Anti_HCV_Blood,

      Serum_Lipids_Blood:
        investigations.Serum_Lipids_Blood,

      FI_CBC:
        investigations.FI_CBC,

      FI_SerumCreatinine:
        investigations.FI_SerumCreatinine,

      FI_SerumElectrolyte:
        investigations.FI_SerumElectrolyte,

      FI_TSH:
        investigations.FI_TSH,

      FI_T3:
        investigations.FI_T3,

      FI_T4:
        investigations.FI_T4,

      FI_Hb:
        investigations.FI_Hb,

      FI_HbA1c:
        investigations.FI_HbA1c,

      FI_RFT:
        investigations.FI_RFT,

      FI_LFT:
        investigations.FI_LFT,

      FI_TroponinI:
        investigations.FI_TroponinI,

      FI_SerumLipids:
        investigations.FI_SerumLipids,

      FI_MP_Widal:
        investigations.FI_MP_Widal,

      // ======================================
      // CHIEF COMPLAINTS
      // ======================================

      Typical_Chest_Pain_Since:
        chiefComplaints
          .Typical_Chest_Pain_Since,

      Angina_on_Exertion_Since:
        chiefComplaints
          .Angina_on_Exertion_Since,

      Breathlessness_Exertion_Since:
        chiefComplaints
          .Breathlessness_Exertion_Since,

      Breathlessness_Not_on_Exertion_Since:
        chiefComplaints
          .Breathlessness_Not_on_Exertion_Since,

      Other_Chief_Complaints:
        chiefComplaints
          .Other_Chief_Complaints,
    };

    // ========================================
    // CONSOLE
    // ========================================

    console.log(
      "Patient Examination Request:"
    );

    console.log(data);

    // ========================================
    // API CALL
    // ========================================

    try {

      setSaving(true);

      const response =
        await apiFetch<any>(
          "UserLogin/insertPatientExamination",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(data),
          }
        );

      // ======================================
      // RESPONSE
      // ======================================

      console.log(
        "Patient Examination Response:",
        response
      );

      // ======================================
      // SUCCESS
      // ======================================

      if (response?.IsSuccess) {

        setExaminationSaved(true);

        alert(
          "Patient Examination saved successfully"
        );

      } else {

        alert(
          response?.Message ||
            "Error saving Patient Examination"
        );
      }

    } catch (error) {

      console.error(
        "Patient Examination Error:",
        error
      );

      alert(
        "Error saving Patient Examination"
      );

    } finally {

      setSaving(false);

    }
  }

  // ==========================================
  // HIDE BEFORE PRESCRIPTION SAVE
  // ==========================================

  if (!isSaved) {
    return null;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="ibox mt-3">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="ibox-head">

        <div className="ibox-title">
          Patient Examination
        </div>

      </div>

      {/* =====================================
          BODY
      ===================================== */}

      <div className="ibox-body">

        <div className="row">

          {/* PATIENT ID */}

          <div className="col-md-6">

            <div className="form-group">

              <label>
                Patient ID
              </label>

              <input
                type="text"
                className="form-control"
                value={patientId || ""}
                readOnly
              />

            </div>

          </div>

          {/* APPOINTMENT ID */}

          <div className="col-md-6">

            <div className="form-group">

              <label>
                Appointment ID
              </label>

              <input
                type="text"
                className="form-control"
                value={appointmentId || ""}
                readOnly
              />

            </div>

          </div>

        </div>

        {/* =====================================
            SAVE BUTTON
        ===================================== */}

        {!examinationSaved && (

          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={
              handleSaveExamination
            }
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : "💾 Save Patient Examination"}

          </button>

        )}

        {/* =====================================
            SUCCESS
        ===================================== */}

      {examinationSaved && (
  <>
    <div className="alert alert-success mt-3">
      Patient Examination saved successfully.
    </div>

    <div className="mt-3">
      <a
        href="/userlogin/CompletePayment"
        className="btn btn-success"
      >
        Complete Payment
      </a>
    </div>
  </>
)}

      </div>

    </div>
  );
}
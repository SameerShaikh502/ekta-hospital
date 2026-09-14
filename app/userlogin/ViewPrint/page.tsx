"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import PatientProfile from "./components/PatientProfile";
import Vitals, { VitalsData } from "./components/Vitals";
import ClinicalNotes, {
  ClinicalNotesData,
} from "./components/ClinicalNotes";
import Investigations from "./components/Investigations";
import ChiefComplaints from "./components/ChiefComplaints";
import Prescription from "./components/Prescription";
import Examination from "./components/Examination";

function ViewPrintContent() {
  const searchParams = useSearchParams();

  const patientId = searchParams.get("id");
  const appointmentId = searchParams.get("appointmentId");

  // =========================
  // EXAMINATION SAVED
  // =========================

  const [examinationSaved, setExaminationSaved] =
    useState(false);


  // =========================
  // OPEN / CLOSE SECTIONS
  // =========================

  const [openSections, setOpenSections] = useState({
    patientProfile: true,
    vitals: true,
    clinicalNotes: true,
    investigations: true,
    chiefComplaints: true,
    prescription: true,
  });

  function toggleSection(
    section: keyof typeof openSections
  ) {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  // =========================
  // VITALS
  // =========================

  const [vitals, setVitals] =
    useState<VitalsData>({
      Weight: "",
      PulseRate: "",
      RespRate: "",
      SpO2: "",
      BpSystolic: "",
      BpDiastolic: "",
      Temperature: "",
      RBS: "",
    });

  // =========================
  // CLINICAL NOTES
  // =========================

  const [clinicalNotes, setClinicalNotes] =
    useState<ClinicalNotesData>({
      K_C_O: "",
      Past_history: "",
      Observations: "",
      Diagnosis: "",
      Personal_Notes: "",
    });

  // =========================
  // CHIEF COMPLAINTS
  // =========================

  const [chiefComplaints, setChiefComplaints] =
    useState({
      Typical_Chest_Pain_Since: "",
      Angina_on_Exertion_Since: "",
      Breathlessness_Exertion_Since: "",
      Breathlessness_Not_on_Exertion_Since: "",
      Other_Chief_Complaints: "",
    });

  // =========================
  // INVESTIGATIONS
  // =========================

  const [investigations, setInvestigations] =
    useState({
      Normal_Sinus_ECG: "",
      Other_Ecg_Findings: "",

      Normal_NO_RWMA_2D_Echo: "",
      Grade_1_2D_Echo: "",
      other_2D_Echo: "",

      TMT_Blood: "",
      CAG_Blood: "",

      CBC_Blood: "",
      MT_Blood: "",
      HIV_Blood: "",
      HbA1C_Blood: "",
      Anti_HCV_Blood: "",
      Serum_Lipids_Blood: "",

      FI_CBC: "",
      FI_SerumCreatinine: "",
      FI_SerumElectrolyte: "",
      FI_TSH: "",
      FI_T3: "",
      FI_T4: "",
      FI_Hb: "",
      FI_HbA1c: "",
      FI_RFT: "",
      FI_LFT: "",
      FI_TroponinI: "",
      FI_SerumLipids: "",
      FI_MP_Widal: "",
    });

  // =========================
  // SAVE PATIENT EXAMINATION
  // =========================

  // async function insertPatientExamination() {
  //   if (!patientId) {
  //     alert("UserId not found");
  //     return;
  //   }

  //   if (!appointmentId) {
  //     alert("AppointmentId not found");
  //     return;
  //   }

  //   const data = {
  //     UserId: patientId,
  //     Appointmentid: appointmentId,

  //     // =========================
  //     // VITALS
  //     // =========================

  //     Weight: vitals.Weight,
  //     PulseRate: vitals.PulseRate,
  //     RespRate: vitals.RespRate,
  //     SpO2: vitals.SpO2,
  //     BpSystolic: vitals.BpSystolic,
  //     BpDiastolic: vitals.BpDiastolic,
  //     Temperature: vitals.Temperature,
  //     RBS: vitals.RBS,

  //     // =========================
  //     // CLINICAL NOTES
  //     // =========================

  //     K_C_O: clinicalNotes.K_C_O,
  //     Past_history: clinicalNotes.Past_history,
  //     Observations: clinicalNotes.Observations,
  //     Diagnosis: clinicalNotes.Diagnosis,
  //     Personal_Notes:
  //       clinicalNotes.Personal_Notes,

  //     // =========================
  //     // INVESTIGATIONS
  //     // =========================

  //     Normal_Sinus_ECG:
  //       investigations.Normal_Sinus_ECG,

  //     Other_Ecg_Findings:
  //       investigations.Other_Ecg_Findings,

  //     Normal_NO_RWMA_2D_Echo:
  //       investigations.Normal_NO_RWMA_2D_Echo,

  //     Grade_1_2D_Echo:
  //       investigations.Grade_1_2D_Echo,

  //     other_2D_Echo:
  //       investigations.other_2D_Echo,

  //     TMT_Blood:
  //       investigations.TMT_Blood,

  //     CAG_Blood:
  //       investigations.CAG_Blood,

  //     CBC_Blood:
  //       investigations.CBC_Blood,

  //     MT_Blood:
  //       investigations.MT_Blood,

  //     HIV_Blood:
  //       investigations.HIV_Blood,

  //     HbA1C_Blood:
  //       investigations.HbA1C_Blood,

  //     Anti_HCV_Blood:
  //       investigations.Anti_HCV_Blood,

  //     Serum_Lipids_Blood:
  //       investigations.Serum_Lipids_Blood,

  //     FI_CBC:
  //       investigations.FI_CBC,

  //     FI_SerumCreatinine:
  //       investigations.FI_SerumCreatinine,

  //     FI_SerumElectrolyte:
  //       investigations.FI_SerumElectrolyte,

  //     FI_TSH:
  //       investigations.FI_TSH,

  //     FI_T3:
  //       investigations.FI_T3,

  //     FI_T4:
  //       investigations.FI_T4,

  //     FI_Hb:
  //       investigations.FI_Hb,

  //     FI_HbA1c:
  //       investigations.FI_HbA1c,

  //     FI_RFT:
  //       investigations.FI_RFT,

  //     FI_LFT:
  //       investigations.FI_LFT,

  //     FI_TroponinI:
  //       investigations.FI_TroponinI,

  //     FI_SerumLipids:
  //       investigations.FI_SerumLipids,

  //     FI_MP_Widal:
  //       investigations.FI_MP_Widal,

  //     // =========================
  //     // CHIEF COMPLAINTS
  //     // =========================

  //     Typical_Chest_Pain_Since:
  //       chiefComplaints.Typical_Chest_Pain_Since,

  //     Angina_on_Exertion_Since:
  //       chiefComplaints.Angina_on_Exertion_Since,

  //     Breathlessness_Exertion_Since:
  //       chiefComplaints.Breathlessness_Exertion_Since,

  //     Breathlessness_Not_on_Exertion_Since:
  //       chiefComplaints.Breathlessness_Not_on_Exertion_Since,

  //     Other_Chief_Complaints:
  //       chiefComplaints.Other_Chief_Complaints,
  //   };

  //   console.log(
  //     "Patient Examination Data:"
  //   );
  //   console.log(data);

  //   try {
  //     const response =
  //       await apiFetch<any>(
  //         "UserLogin/insertPatientExamination",
  //         {
  //           method: "POST",

  //           headers: {
  //             "Content-Type":
  //               "application/json",
  //           },

  //           body: JSON.stringify(data),
  //         }
  //       );

  //     console.log(
  //       "API Response:",
  //       response
  //     );

  //     if (response?.IsSuccess) {
  //       // IMPORTANT:
  //       // Examination component ab show hoga
  //       setExaminationSaved(true);

  //       alert(
  //         "Patient Examination saved successfully"
  //       );
  //     } else {
  //       alert(
  //         response?.Message ||
  //         "Error saving patient examination"
  //       );
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error saving patient examination:",
  //       error
  //     );

  //     alert(
  //       "Error saving patient examination"
  //     );
  //   }
  // }

  return (
    <main className="page-content">

      {/* =========================
          PATIENT PROFILE
      ========================= */}

      <PatientProfile
        patientId={patientId}
        isOpen={
          openSections.patientProfile
        }
        onToggle={() =>
          toggleSection(
            "patientProfile"
          )
        }
      />

      {/* =========================
          VITALS
      ========================= */}

      <Vitals
        values={vitals}
        onChange={setVitals}
        isOpen={openSections.vitals}
        onToggle={() =>
          toggleSection("vitals")
        }
      />

      {/* =========================
          CLINICAL NOTES
      ========================= */}

      <ClinicalNotes
        values={clinicalNotes}
        onChange={setClinicalNotes}
        isOpen={
          openSections.clinicalNotes
        }
        onToggle={() =>
          toggleSection(
            "clinicalNotes"
          )
        }
      />

      {/* =========================
          INVESTIGATIONS
      ========================= */}

      <Investigations
        values={investigations}
        onChange={setInvestigations}
        isOpen={
          openSections.investigations
        }
        onToggle={() =>
          toggleSection(
            "investigations"
          )
        }
      />

      {/* =========================
          CHIEF COMPLAINTS
      ========================= */}

      <ChiefComplaints
        values={chiefComplaints}
        onChange={setChiefComplaints}
        isOpen={
          openSections.chiefComplaints
        }
        onToggle={() =>
          toggleSection(
            "chiefComplaints"
          )
        }
      />

      {/* =========================
          PRESCRIPTION
      ========================= */}

     <Prescription
  isOpen={openSections.prescription}
  onToggle={() =>
    toggleSection("prescription")
  }
  onPrescriptionSaved={() => {
    setExaminationSaved(true);
  }}
/>

      {/* =========================
          SAVE PATIENT EXAMINATION
      ========================= */}
      {/* 
      {!examinationSaved && (
        <div className="ibox mt-3">

          <div className="ibox-head">
            <div className="ibox-title">
              Save Patient Examination
            </div>
          </div>

          <div className="ibox-body">

            <p>
              Patient ID:{" "}
              <strong>
                {patientId}
              </strong>
            </p>

            <p>
              Appointment ID:{" "}
              <strong>
                {appointmentId}
              </strong>
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={
                insertPatientExamination
              }
            >
              Save Patient Examination
            </button>

          </div>

        </div>
      )} */}

      {/* =========================
          EXAMINATION COMPONENT
      ========================= */}

     <Examination
  patientId={patientId}
  appointmentId={appointmentId}
  isSaved={examinationSaved}

  vitals={vitals}

  clinicalNotes={clinicalNotes}

  investigations={investigations}

  chiefComplaints={chiefComplaints}
/>

    </main>
  );
}

export default function ViewPrintPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewPrintContent />
    </Suspense>
  );
}
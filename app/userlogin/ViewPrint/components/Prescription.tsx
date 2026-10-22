"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type MedicineSuggestion = {
  BrandName?: string;
};

type PrescriptionItem = {
  id: number;
  medicine: string;
  dosage: string;
  unit: string;
  frequency: string;
  instruction: string;
  duration: string;
  appointmentId?: string;
  patientId?: string;
  createdOn?: string;
};

type PrescriptionResponse = {
  IsSuccess?: boolean;
  Message?: string;
  Data?: any;
};

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  onPrescriptionSaved?: () => void;
};

export default function Prescription({
  isOpen,
  onToggle,
  onPrescriptionSaved,
}: Props) {
  const searchParams = useSearchParams();

  const patientId = searchParams.get("id");
  const appointmentId = searchParams.get("appointmentId");
  const [deletingPreviousId, setDeletingPreviousId] =
    useState<number | null>(null);


  // =====================================================
  // ADD PRESCRIPTION FORM
  // =====================================================

  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [unit, setUnit] = useState("");
  const [frequency, setFrequency] = useState<string[]>([]);
  const [instruction, setInstruction] = useState("");
  const [otherInstruction, setOtherInstruction] = useState("");
  const [duration, setDuration] = useState("");

  // =====================================================
  // MEDICINE SEARCH
  // =====================================================

  const [medicineSuggestions, setMedicineSuggestions] =
    useState<MedicineSuggestion[]>([]);

  const [showMedicineSuggestions, setShowMedicineSuggestions] =
    useState(false);

  const [medicineLoading, setMedicineLoading] = useState(false);

  const medicineSearchTimer = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const medicineWrapperRef = useRef<HTMLDivElement | null>(null);

  // =====================================================
  // PRESCRIPTIONS
  // =====================================================

  const [prescriptions, setPrescriptions] =
    useState<PrescriptionItem[]>([]);

  const [previousPrescriptions, setPreviousPrescriptions] =
    useState<PrescriptionItem[]>([]);

  const [loadingPreviousPrescriptions, setLoadingPreviousPrescriptions] =
    useState(false);

  const [loadingPrescriptions, setLoadingPrescriptions] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // =====================================================
  // EDIT STATES
  // =====================================================

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editMedicine, setEditMedicine] =
    useState("");

  const [editDosage, setEditDosage] =
    useState("");

  const [editUnit, setEditUnit] =
    useState("");

  const [editFrequency, setEditFrequency] =
    useState<string[]>([]);

  const [editInstruction, setEditInstruction] =
    useState("");

  const [editDuration, setEditDuration] =
    useState("");

  const [editSaving, setEditSaving] =
    useState(false);

  // =====================================================
  // CHARGE
  // =====================================================

  const [charge, setCharge] = useState("");

  const [otherAmount, setOtherAmount] =
    useState("");

  // =====================================================
  // LOAD CURRENT PRESCRIPTIONS
  // =====================================================

  async function loadCurrentPrescriptions() {
    if (!patientId) {
      return;
    }

    try {
      setLoadingPrescriptions(true);
      setLoadingPreviousPrescriptions(true);

      const params = new URLSearchParams();

      params.set("Patientid", patientId);

      if (appointmentId) {
        params.set("Appointmentid", appointmentId);
      }

      const response =
        await apiFetch<PrescriptionResponse>(
          `UserLogin/GetPrescriptionByUserAndAppointment?${params.toString()}`
        );

      console.log(
        "All Prescription Response:",
        response
      );

      if (!response?.IsSuccess) {
        setPrescriptions([]);
        setPreviousPrescriptions([]);
        return;
      }

      const data = Array.isArray(response.Data)
        ? response.Data
        : [];

      const mappedData: PrescriptionItem[] =
        data.map((item: any) => ({
          id: Number(
            item.Id ??
            item.PrescId ??
            item.PrescriptionId ??
            0
          ),

          medicine:
            item.Medicine ?? "",

          dosage:
            item.Dose ?? "",

          unit:
            item.Unit ?? "",

          frequency:
            item.Frequency ?? "",

          instruction:
            item.Instruction ?? "",

          duration:
            item.DurationDays !== null &&
              item.DurationDays !== undefined
              ? String(item.DurationDays)
              : "",

          appointmentId:
            item.Appointmentid !== null &&
              item.Appointmentid !== undefined
              ? String(item.Appointmentid)
              : "",

          patientId:
            item.PatientId !== null &&
              item.PatientId !== undefined
              ? String(item.PatientId)
              : patientId,

          createdOn:
            item.CreatedOn ?? "",
        }));

      /*
       * API is ordered:
       * CreatedOn DESC
       *
       * First record = Current
       * Remaining records = Previous
       */

      const current =
        mappedData.length > 0
          ? [mappedData[0]]
          : [];

      const previous =
        mappedData.length > 1
          ? mappedData.slice(1)
          : [];

      setPrescriptions(current);
      setPreviousPrescriptions(previous);

    } catch (error) {
      console.error(
        "Load prescriptions error:",
        error
      );

      setPrescriptions([]);
      setPreviousPrescriptions([]);

    } finally {
      setLoadingPrescriptions(false);
      setLoadingPreviousPrescriptions(false);
    }
  }

  //   async function loadPreviousPrescriptions() {
  //   if (!patientId) {
  //     return;
  //   }

  //   try {
  //     setLoadingPreviousPrescriptions(true);

  //     const response =
  //       await apiFetch<PrescriptionResponse>(
  //         `UserLogin/GetPreviousPrescriptions?PatientId=${encodeURIComponent(
  //           patientId
  //         )}`
  //       );

  //     console.log(
  //       "Previous Prescription Response:",
  //       response
  //     );

  //     if (!response?.IsSuccess) {
  //       setPreviousPrescriptions([]);
  //       return;
  //     }

  //     const data = Array.isArray(response.Data)
  //       ? response.Data
  //       : [];

  //     const mappedData: PrescriptionItem[] =
  //       data
  //         .map((item: any) => ({
  //           id: Number(
  //             item.PrescriptionId ??
  //               item.Id ??
  //               item.PrescId
  //           ),

  //           medicine:
  //             item.Medicine ?? "",

  //           dosage:
  //             item.Dose ?? "",

  //           unit:
  //             item.Unit ?? "",

  //           frequency:
  //             item.Frequency ?? "",

  //           instruction:
  //             item.Instruction ?? "",

  //           duration:
  //             item.DurationDays !== null &&
  //             item.DurationDays !== undefined
  //               ? String(item.DurationDays)
  //               : "",

  //           appointmentId:
  //             item.AppointmentId !== null &&
  //             item.AppointmentId !== undefined
  //               ? String(item.AppointmentId)
  //               : "",

  //           patientId:
  //             item.PatientId !== null &&
  //             item.PatientId !== undefined
  //               ? String(item.PatientId)
  //               : patientId,

  //           createdOn:
  //             item.AppointmentDate ??
  //             item.CreatedOn ??
  //             "",
  //         }))
  //         .filter(
  //           (item) =>
  //             item.appointmentId !==
  //             String(appointmentId)
  //         );

  //     setPreviousPrescriptions(mappedData);
  //   } catch (error) {
  //     console.error(
  //       "Load previous prescriptions error:",
  //       error
  //     );

  //     setPreviousPrescriptions([]);
  //   } finally {
  //     setLoadingPreviousPrescriptions(false);
  //   }
  // }

  function formatPrescriptionDate(
    value: string
  ) {
    if (!value) {
      return "-";
    }

    try {
      const match =
        value.match(
          /\/Date\((\d+)\)\//
        );

      if (match) {
        const date = new Date(
          Number(match[1])
        );

        return date.toLocaleDateString(
          "en-IN"
        );
      }

      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return value;
      }

      return date.toLocaleDateString(
        "en-IN"
      );
    } catch {
      return value;
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (patientId) {
      loadCurrentPrescriptions();
    }
  }, [
    patientId,
    appointmentId,
  ]);

  // =====================================================
  // MEDICINE SEARCH
  // =====================================================

  async function searchMedicine(
    value: string
  ) {
    const searchText =
      value.trim();

    if (searchText.length < 2) {
      setMedicineSuggestions([]);
      setShowMedicineSuggestions(false);
      return;
    }

    try {
      setMedicineLoading(true);

      const response =
        await apiFetch<
          MedicineSuggestion[]
        >(
          `UserLogin/Searchbymedicine?query=${encodeURIComponent(
            searchText
          )}`
        );

      const result =
        Array.isArray(response)
          ? response
          : [];

      setMedicineSuggestions(result);

      setShowMedicineSuggestions(
        result.length > 0
      );
    } catch (error) {
      console.error(
        "Medicine search error:",
        error
      );

      setMedicineSuggestions([]);
      setShowMedicineSuggestions(false);
    } finally {
      setMedicineLoading(false);
    }
  }

  // =====================================================
  // MEDICINE CHANGE
  // =====================================================

  function handleMedicineChange(
    value: string
  ) {
    setMedicine(value);

    if (medicineSearchTimer.current) {
      clearTimeout(
        medicineSearchTimer.current
      );
    }

    if (value.trim().length < 2) {
      setMedicineSuggestions([]);
      setShowMedicineSuggestions(false);
      return;
    }

    setShowMedicineSuggestions(true);

    medicineSearchTimer.current =
      setTimeout(() => {
        searchMedicine(value);
      }, 300);
  }

  // =====================================================
  // SELECT MEDICINE
  // =====================================================

  function selectMedicine(
    medicineName: string
  ) {
    setMedicine(medicineName);

    setMedicineSuggestions([]);

    setShowMedicineSuggestions(false);
  }

  // =====================================================
  // OUTSIDE CLICK
  // =====================================================

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        medicineWrapperRef.current &&
        !medicineWrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setShowMedicineSuggestions(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =====================================================
  // ESCAPE
  // =====================================================

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        setShowMedicineSuggestions(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // TIMER CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      if (medicineSearchTimer.current) {
        clearTimeout(
          medicineSearchTimer.current
        );
      }
    };
  }, []);

  // =====================================================
  // FREQUENCY
  // =====================================================

  function handleFrequencyChange(
    value: string
  ) {
    setFrequency((prev) => {
      if (
        prev.includes(value)
      ) {
        return prev.filter(
          (item) =>
            item !== value
        );
      }

      return [
        ...prev,
        value,
      ];
    });
  }

  // =====================================================
  // EDIT FREQUENCY
  // =====================================================

  function handleEditFrequencyChange(
    value: string
  ) {
    setEditFrequency(
      (prev) => {
        if (
          prev.includes(value)
        ) {
          return prev.filter(
            (item) =>
              item !== value
          );
        }

        return [
          ...prev,
          value,
        ];
      }
    );
  }

  // =====================================================
  // INSERT PRESCRIPTION
  // =====================================================

  async function insertPrescription() {
    if (!patientId) {
      alert(
        "Patient ID not found."
      );
      return;
    }

    if (!appointmentId) {
      alert(
        "Appointment ID not found."
      );
      return;
    }

    if (!medicine.trim()) {
      alert(
        "Please enter medicine."
      );
      return;
    }

    if (!dosage.trim()) {
      alert(
        "Please enter dosage."
      );
      return;
    }

    if (!unit) {
      alert(
        "Please select medicine type."
      );
      return;
    }

    if (
      frequency.length === 0
    ) {
      alert(
        "Please select frequency."
      );
      return;
    }

    if (!instruction) {
      alert(
        "Please select instruction."
      );
      return;
    }

    if (
      instruction === "Other" &&
      !otherInstruction.trim()
    ) {
      alert(
        "Please enter custom instruction."
      );
      return;
    }

    if (!duration) {
      alert(
        "Please enter duration."
      );
      return;
    }

    const prescriptionData = {
      UserId: patientId,

      Medicine:
        medicine.trim(),

      Dose:
        dosage.trim(),

      Unit:
        unit,

      // IMPORTANT:
      // Send array.
      // C# DAL will join it.
      Frequencies:
        frequency,

      Instruction:
        instruction === "Other"
          ? otherInstruction.trim()
          : instruction,

      DurationDays:
        duration,

      Appointmentid:
        appointmentId,
    };

    try {
      setSaving(true);

      const response =
        await apiFetch<PrescriptionResponse>(
          "UserLogin/insertPrescription",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              prescriptionData
            ),
          }
        );

      console.log(
        "Insert prescription response:",
        response
      );

      if (
        response?.IsSuccess
      ) {
        alert(
          "Prescription saved successfully."
        );

        setMedicine("");
        setDosage("");
        setUnit("");
        setFrequency([]);
        setInstruction("");
        setOtherInstruction("");
        setDuration("");

        setMedicineSuggestions([]);
        setShowMedicineSuggestions(false);

        onPrescriptionSaved?.();

        await loadCurrentPrescriptions();
      } else {
        alert(
          response?.Message ||
          "Error saving prescription."
        );
      }
    } catch (error) {
      console.error(
        "Insert prescription error:",
        error
      );

      alert(
        "Error saving prescription."
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // START EDIT
  // =====================================================

  function startEdit(
    item: PrescriptionItem
  ) {
    setEditingId(item.id);

    setEditMedicine(
      item.medicine
    );

    setEditDosage(
      item.dosage
    );

    setEditUnit(
      item.unit
    );

    const frequencies =
      item.frequency
        ? item.frequency
          .split(",")
          .map(
            (x) =>
              x.trim()
          )
          .filter(Boolean)
        : [];

    setEditFrequency(
      frequencies
    );

    setEditInstruction(
      item.instruction
    );

    setEditDuration(
      item.duration
    );
  }

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  function cancelEdit() {
    setEditingId(null);

    setEditMedicine("");
    setEditDosage("");
    setEditUnit("");
    setEditFrequency([]);
    setEditInstruction("");
    setEditDuration("");
  }

  // =====================================================
  // SAVE EDIT
  // =====================================================

  async function saveEditedPrescription() {
    if (!editingId) {
      return;
    }

    if (!editMedicine.trim()) {
      alert(
        "Please enter medicine."
      );
      return;
    }

    if (!editDosage.trim()) {
      alert(
        "Please enter dosage."
      );
      return;
    }

    if (!editUnit) {
      alert(
        "Please select medicine type."
      );
      return;
    }

    if (
      editFrequency.length === 0
    ) {
      alert(
        "Please select frequency."
      );
      return;
    }

    if (!editInstruction) {
      alert(
        "Please select instruction."
      );
      return;
    }

    if (!editDuration) {
      alert(
        "Please enter duration."
      );
      return;
    }

    try {
      setEditSaving(true);

      const editData = {
        PrescriptionId:
          editingId,

        PatientId:
          patientId || "",

        Medicine:
          editMedicine.trim(),

        Dose:
          editDosage.trim(),

        Unit:
          editUnit,

        Frequency:
          editFrequency.join(","),

        Instruction:
          editInstruction,

        DurationDays:
          editDuration,
      };

      console.log(
        "Edit Prescription Request:",
        editData
      );

      const response =
        await apiFetch<PrescriptionResponse>(
          "UserLogin/EditPreviousPrescription",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              editData
            ),
          }
        );

      console.log(
        "Edit Prescription Response:",
        response
      );

      if (
        response?.IsSuccess
      ) {
        alert(
          "Prescription updated successfully."
        );

        cancelEdit();

        await loadCurrentPrescriptions();

        onPrescriptionSaved?.();
      } else {
        alert(
          response?.Message ||
          "Unable to update prescription."
        );
      }
    } catch (error) {
      console.error(
        "Edit prescription error:",
        error
      );

      alert(
        "Error updating prescription."
      );
    } finally {
      setEditSaving(false);
    }
  }

  async function saveEditedPreviousPrescription() {
    if (!editingId) {
      return;
    }

    if (!editMedicine.trim()) {
      alert("Please enter medicine.");
      return;
    }

    if (!editDosage.trim()) {
      alert("Please enter dosage.");
      return;
    }

    if (!editUnit) {
      alert("Please select medicine type.");
      return;
    }

    if (editFrequency.length === 0) {
      alert("Please select frequency.");
      return;
    }

    if (!editInstruction) {
      alert("Please select instruction.");
      return;
    }

    if (!editDuration) {
      alert("Please enter duration.");
      return;
    }

    try {
      setEditSaving(true);

      const editData = {
        PrescriptionId: editingId,

        PatientId:
          patientId || "",

        Medicine:
          editMedicine.trim(),

        Dose:
          editDosage.trim(),

        Unit:
          editUnit,

        Frequency:
          editFrequency.join(","),

        Instruction:
          editInstruction,

        DurationDays:
          editDuration,
      };

      console.log(
        "Previous Prescription Edit:",
        editData
      );

      const response =
        await apiFetch<PrescriptionResponse>(
          "UserLogin/EditPreviousPrescription",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              editData
            ),
          }
        );

      if (response?.IsSuccess) {
        alert(
          "Previous prescription updated successfully."
        );

        cancelEdit();

        await loadCurrentPrescriptions();

        onPrescriptionSaved?.();
      } else {
        alert(
          response?.Message ||
          "Unable to update prescription."
        );
      }
    } catch (error) {
      console.error(
        "Previous prescription edit error:",
        error
      );

      alert(
        "Error updating previous prescription."
      );
    } finally {
      setEditSaving(false);
    }
  }

  async function deletePreviousPrescription(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this previous prescription?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingPreviousId(id);

      const response = await apiFetch<any>(
        "UserLogin/DeletePreviousPrescription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PrescriptionId: id,
          }),
        }
      );

      console.log(
        "Delete Previous Prescription Response:",
        response
      );

      if (
        response?.Result === "Success" ||
        response?.IsSuccess === true
      ) {
        alert("Previous prescription deleted successfully.");

        // Reload previous prescription list
        await loadCurrentPrescriptions();
      } else {
        alert(
          response?.Message ||
          "Failed to delete previous prescription."
        );
      }
    } catch (error) {
      console.error(
        "Delete previous prescription error:",
        error
      );

      alert(
        "Something went wrong while deleting previous prescription."
      );
    } finally {
      setDeletingPreviousId(null);
    }
  }

  // =====================================================
  // DELETE PRESCRIPTION
  // =====================================================

  async function deletePrescription(
    id: number
  ) {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this prescription?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const response =
        await apiFetch<PrescriptionResponse>(
          "UserLogin/deletePrescriptionbyid",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              PrescId: id,
            }),
          }
        );

      console.log(
        "Delete Prescription Response:",
        response
      );

      if (
        response?.IsSuccess
      ) {
        alert(
          "Prescription deleted successfully."
        );

        if (
          editingId === id
        ) {
          cancelEdit();
        }

        await loadCurrentPrescriptions();

        onPrescriptionSaved?.();
      } else {
        alert(
          response?.Message ||
          "Unable to delete prescription."
        );
      }
    } catch (error) {
      console.error(
        "Delete prescription error:",
        error
      );

      alert(
        "Error deleting prescription."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="ibox mt-3">

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="ibox-head"
        onClick={onToggle}
        style={{
          cursor: "pointer",
        }}
      >
        <div className="ibox-title">
          💊 Prescription
        </div>

        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {isOpen
            ? "▲"
            : "▼"}
        </div>
      </div>

      {isOpen && (
        <div className="ibox-body">

          <h4 className="mb-3">
            Prescription Details
          </h4>

          {/* =================================================
              MEDICINE / DOSAGE / UNIT
          ================================================= */}

          <div className="row">

            {/* MEDICINE */}

            <div className="col-md-4">

              <div
                ref={
                  medicineWrapperRef
                }
                className="form-group"
                style={{
                  position:
                    "relative",
                }}
              >

                <label>
                  🔍 Medicine
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search medicine"
                  value={medicine}
                  autoComplete="off"
                  onChange={(e) =>
                    handleMedicineChange(
                      e.target.value
                    )
                  }
                  onFocus={() => {
                    if (
                      medicineSuggestions.length >
                      0
                    ) {
                      setShowMedicineSuggestions(
                        true
                      );
                    }
                  }}
                />

                {showMedicineSuggestions &&
                  medicineSuggestions.length >
                  0 && (
                    <div
                      style={{
                        position:
                          "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        background:
                          "#fff",
                        border:
                          "1px solid #ddd",
                        borderRadius:
                          "0 0 6px 6px",
                        boxShadow:
                          "0 5px 15px rgba(0,0,0,0.12)",
                        maxHeight:
                          "240px",
                        overflowY:
                          "auto",
                      }}
                    >

                      {medicineSuggestions.map(
                        (
                          item,
                          index
                        ) => (
                          <button
                            key={`${item.BrandName}-${index}`}
                            type="button"
                            style={{
                              display:
                                "block",
                              width:
                                "100%",
                              border:
                                "none",
                              background:
                                "#fff",
                              padding:
                                "10px 12px",
                              textAlign:
                                "left",
                              cursor:
                                "pointer",
                              borderBottom:
                                "1px solid #eee",
                            }}
                            onMouseDown={(
                              e
                            ) => {
                              e.preventDefault();

                              if (
                                item.BrandName
                              ) {
                                selectMedicine(
                                  item.BrandName
                                );
                              }
                            }}
                          >
                            {
                              item.BrandName
                            }
                          </button>
                        )
                      )}

                    </div>
                  )}

                {medicineLoading && (
                  <small className="text-muted">
                    Searching medicine...
                  </small>
                )}

              </div>

            </div>

            {/* DOSAGE */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  💊 Dosage
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter quantity"
                  value={dosage}
                  onChange={(e) =>
                    setDosage(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* UNIT */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  💊 Medicine Type
                </label>

                <select
                  className="form-control"
                  value={unit}
                  onChange={(e) =>
                    setUnit(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select unit
                  </option>

                  <option value="Tablet">
                    Tablet
                  </option>

                  <option value="Capsule">
                    Capsule
                  </option>

                  <option value="Syrup (ml)">
                    Syrup (ml)
                  </option>

                  <option value="Liquid (ml)">
                    Liquid (ml)
                  </option>

                  <option value="Drops (ml)">
                    Drops (ml)
                  </option>

                  <option value="mg">
                    mg
                  </option>

                  <option value="g">
                    g
                  </option>

                  <option value="mcg">
                    mcg
                  </option>

                  <option value="Injection (ml)">
                    Injection (ml)
                  </option>

                  <option value="Cream (g)">
                    Cream (g)
                  </option>

                  <option value="Ointment (g)">
                    Ointment (g)
                  </option>

                  <option value="Gel (g)">
                    Gel (g)
                  </option>

                  <option value="Powder (g)">
                    Powder (g)
                  </option>

                  <option value="Inhaler (dose)">
                    Inhaler (dose)
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* =================================================
              FREQUENCY
          ================================================= */}

          <div className="form-group mt-3">

            <label>
              🕐 Frequency
            </label>

            <div
              className="d-flex flex-wrap"
              style={{
                gap: "15px",
              }}
            >

              {[
                [
                  "Morning",
                  "🌅 Morning",
                ],
                [
                  "Midday",
                  "☀️ Midday",
                ],
                [
                  "Evening",
                  "🌆 Evening",
                ],
                [
                  "Night",
                  "🌙 Night",
                ],
              ].map(
                ([value, label]) => (
                  <label
                    key={value}
                  >

                    <input
                      type="checkbox"
                      checked={frequency.includes(
                        value
                      )}
                      onChange={() =>
                        handleFrequencyChange(
                          value
                        )
                      }
                    />{" "}
                    {label}

                  </label>
                )
              )}

            </div>

          </div>

          {/* =================================================
              INSTRUCTION / DURATION
          ================================================= */}

          <div className="row mt-3">

            <div className="col-md-6">

              <div className="form-group">

                <label>
                  ℹ️ Instruction
                </label>

                <select
                  className="form-control"
                  value={instruction}
                  onChange={(e) => {
                    const value =
                      e.target.value;

                    setInstruction(
                      value
                    );

                    if (
                      value !==
                      "Other"
                    ) {
                      setOtherInstruction(
                        ""
                      );
                    }
                  }}
                >

                  <option value="">
                    Select Instruction
                  </option>

                  <option value="Before Food">
                    Before Food
                  </option>

                  <option value="After Food">
                    After Food
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

                {instruction ===
                  "Other" && (
                    <input
                      type="text"
                      className="form-control mt-2"
                      placeholder="Custom Instruction"
                      value={
                        otherInstruction
                      }
                      onChange={(e) =>
                        setOtherInstruction(
                          e.target.value
                        )
                      }
                    />
                  )}

              </div>

            </div>

            <div className="col-md-6">

              <div className="form-group">

                <label>
                  📅 Duration (Days)
                </label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="Enter duration in days"
                  value={duration}
                  onChange={(e) =>
                    setDuration(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>

          {/* =================================================
              SAVE
          ================================================= */}

          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={
              insertPrescription
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "💾 Save Prescription"}
          </button>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="table-responsive mt-4">

            {loadingPrescriptions ? (
              <div className="table-message">
                Loading prescriptions...
              </div>
            ) : prescriptions.length ===
              0 ? (
              <div className="table-message">
                No Previous Prescription Found
              </div>
            ) : (

              <table className="table table-bordered">

                <thead>

                  <tr>

                    <th>
                      💊 Medicine
                    </th>

                    <th>
                      💊 Dose
                    </th>

                    <th>
                      🕐 Frequency
                    </th>

                    <th>
                      ℹ️ Instruction
                    </th>

                    <th>
                      📅 Duration
                    </th>

                    <th
                      style={{
                        width:
                          "180px",
                      }}
                    >
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {prescriptions.map(
                    (item) => (

                      <tr
                        key={
                          item.id
                        }
                      >

                        {/* MEDICINE */}

                        <td>
                          {editingId ===
                            item.id ? (
                            <input
                              type="text"
                              className="form-control"
                              value={
                                editMedicine
                              }
                              onChange={(
                                e
                              ) =>
                                setEditMedicine(
                                  e.target
                                    .value
                                )
                              }
                            />
                          ) : (
                            item.medicine
                          )}
                        </td>

                        {/* DOSE */}

                        <td>
                          {editingId ===
                            item.id ? (

                            <div
                              className="d-flex"
                              style={{
                                gap:
                                  "5px",
                              }}
                            >

                              <input
                                type="text"
                                className="form-control"
                                value={
                                  editDosage
                                }
                                onChange={(
                                  e
                                ) =>
                                  setEditDosage(
                                    e.target
                                      .value
                                  )
                                }
                              />

                              <select
                                className="form-control"
                                value={
                                  editUnit
                                }
                                onChange={(
                                  e
                                ) =>
                                  setEditUnit(
                                    e.target
                                      .value
                                  )
                                }
                              >

                                <option value="">
                                  Unit
                                </option>

                                <option value="Tablet">
                                  Tablet
                                </option>

                                <option value="Capsule">
                                  Capsule
                                </option>

                                <option value="Syrup (ml)">
                                  Syrup (ml)
                                </option>

                                <option value="Liquid (ml)">
                                  Liquid (ml)
                                </option>

                                <option value="Drops (ml)">
                                  Drops (ml)
                                </option>

                                <option value="mg">
                                  mg
                                </option>

                                <option value="g">
                                  g
                                </option>

                                <option value="mcg">
                                  mcg
                                </option>

                                <option value="Injection (ml)">
                                  Injection (ml)
                                </option>

                                <option value="Cream (g)">
                                  Cream (g)
                                </option>

                                <option value="Ointment (g)">
                                  Ointment (g)
                                </option>

                                <option value="Gel (g)">
                                  Gel (g)
                                </option>

                                <option value="Powder (g)">
                                  Powder (g)
                                </option>

                                <option value="Inhaler (dose)">
                                  Inhaler (dose)
                                </option>

                              </select>

                            </div>

                          ) : (
                            <>
                              {
                                item.dosage
                              }{" "}
                              {
                                item.unit
                              }
                            </>
                          )}
                        </td>

                        {/* FREQUENCY */}

                        <td>

                          {editingId ===
                            item.id ? (

                            <div
                              className="d-flex flex-column"
                              style={{
                                gap:
                                  "4px",
                              }}
                            >

                              {[
                                "Morning",
                                "Midday",
                                "Evening",
                                "Night",
                              ].map(
                                (
                                  value
                                ) => (

                                  <label
                                    key={
                                      value
                                    }
                                    style={{
                                      fontSize:
                                        "13px",
                                    }}
                                  >

                                    <input
                                      type="checkbox"
                                      checked={editFrequency.includes(
                                        value
                                      )}
                                      onChange={() =>
                                        handleEditFrequencyChange(
                                          value
                                        )
                                      }
                                    />{" "}
                                    {
                                      value
                                    }

                                  </label>

                                )
                              )}

                            </div>

                          ) : (
                            item.frequency ||
                            "-"
                          )}

                        </td>

                        {/* INSTRUCTION */}

                        <td>

                          {editingId ===
                            item.id ? (

                            <select
                              className="form-control"
                              value={
                                editInstruction
                              }
                              onChange={(
                                e
                              ) =>
                                setEditInstruction(
                                  e.target
                                    .value
                                )
                              }
                            >

                              <option value="">
                                Select
                              </option>

                              <option value="Before Food">
                                Before Food
                              </option>

                              <option value="After Food">
                                After Food
                              </option>

                              <option value="Other">
                                Other
                              </option>

                            </select>

                          ) : (
                            item.instruction ||
                            "-"
                          )}

                        </td>

                        {/* DURATION */}

                        <td>

                          {editingId ===
                            item.id ? (

                            <input
                              type="number"
                              min="1"
                              className="form-control"
                              value={
                                editDuration
                              }
                              onChange={(
                                e
                              ) =>
                                setEditDuration(
                                  e.target
                                    .value
                                )
                              }
                            />

                          ) : (
                            item.duration
                              ? `${item.duration} Days`
                              : "-"
                          )}

                        </td>

                        {/* ACTION */}

                        <td>

                          {editingId ===
                            item.id ? (

                            <div
                              className="d-flex flex-wrap"
                              style={{
                                gap:
                                  "5px",
                              }}
                            >

                              <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={
                                  saveEditedPrescription
                                }
                                disabled={
                                  editSaving
                                }
                              >
                                {editSaving
                                  ? "Saving..."
                                  : "💾 Save"}
                              </button>

                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={
                                  cancelEdit
                                }
                                disabled={
                                  editSaving
                                }
                              >
                                Cancel
                              </button>

                            </div>

                          ) : (

                            <div
                              className="d-flex flex-wrap"
                              style={{
                                gap:
                                  "5px",
                              }}
                            >

                              <button
                                type="button"
                                className="btn btn-warning btn-sm"
                                onClick={() =>
                                  startEdit(
                                    item
                                  )
                                }
                              >
                                ✏️ Edit
                              </button>

                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  deletePrescription(
                                    item.id
                                  )
                                }
                                disabled={
                                  deletingId ===
                                  item.id
                                }
                              >
                                {deletingId ===
                                  item.id
                                  ? "Deleting..."
                                  : "🗑️ Delete"}
                              </button>

                            </div>

                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

          {/* =====================================================
    PREVIOUS PRESCRIPTION
===================================================== */}

          <div
            className="mt-5"
            style={{
              borderTop: "2px solid #ddd",
              paddingTop: "20px",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center mb-3"
            >
              <h4
                style={{
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                📋 Previous Prescription
              </h4>

              <span className="badge bg-secondary">
                Patient ID: {patientId}
              </span>
            </div>

            {loadingPreviousPrescriptions ? (
              <div className="table-message">
                Loading previous prescriptions...
              </div>
            ) : previousPrescriptions.length === 0 ? (
              <div className="table-message">
                No Previous Prescription Found
              </div>
            ) : (
              <div className="table-responsive">
                <table
                  className="table table-bordered"
                  id="previous-prescription-table"
                >
                  <thead>
                    <tr>
                      <th>Visit Date</th>
                      <th>Medicine</th>
                      <th>Dose</th>
                      <th>Frequency</th>
                      <th>Instruction</th>
                      <th>Duration</th>
                      <th className="no-print">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {previousPrescriptions.map(
                      (item) => (
                        <tr key={item.id}>

                          {/* VISIT DATE */}

                          <td>
                            {item.createdOn
                              ? formatPrescriptionDate(
                                item.createdOn
                              )
                              : "-"}
                          </td>

                          {/* MEDICINE */}

                          <td>
                            {editingId === item.id ? (
                              <input
                                type="text"
                                className="form-control"
                                value={editMedicine}
                                onChange={(e) =>
                                  setEditMedicine(
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              item.medicine || "-"
                            )}
                          </td>

                          {/* DOSE */}

                          <td>
                            {editingId === item.id ? (
                              <div
                                className="d-flex"
                                style={{
                                  gap: "5px",
                                }}
                              >
                                <input
                                  type="text"
                                  className="form-control"
                                  value={editDosage}
                                  onChange={(e) =>
                                    setEditDosage(
                                      e.target.value
                                    )
                                  }
                                />

                                <select
                                  className="form-control"
                                  value={editUnit}
                                  onChange={(e) =>
                                    setEditUnit(
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">
                                    Unit
                                  </option>

                                  <option value="Tablet">
                                    Tablet
                                  </option>

                                  <option value="Capsule">
                                    Capsule
                                  </option>

                                  <option value="Syrup (ml)">
                                    Syrup (ml)
                                  </option>

                                  <option value="Liquid (ml)">
                                    Liquid (ml)
                                  </option>

                                  <option value="Drops (ml)">
                                    Drops (ml)
                                  </option>

                                  <option value="mg">
                                    mg
                                  </option>

                                  <option value="g">
                                    g
                                  </option>

                                  <option value="mcg">
                                    mcg
                                  </option>

                                  <option value="Injection (ml)">
                                    Injection (ml)
                                  </option>

                                  <option value="Cream (g)">
                                    Cream (g)
                                  </option>

                                  <option value="Ointment (g)">
                                    Ointment (g)
                                  </option>

                                  <option value="Gel (g)">
                                    Gel (g)
                                  </option>

                                  <option value="Powder (g)">
                                    Powder (g)
                                  </option>

                                  <option value="Inhaler (dose)">
                                    Inhaler (dose)
                                  </option>
                                </select>
                              </div>
                            ) : (
                              <>
                                {item.dosage || "-"}{" "}
                                {item.unit || ""}
                              </>
                            )}
                          </td>

                          {/* FREQUENCY */}

                          <td>
                            {editingId === item.id ? (
                              <div
                                className="d-flex flex-column"
                                style={{
                                  gap: "4px",
                                }}
                              >
                                {[
                                  "Morning",
                                  "Midday",
                                  "Evening",
                                  "Night",
                                ].map(
                                  (value) => (
                                    <label
                                      key={value}
                                      style={{
                                        fontSize:
                                          "13px",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={editFrequency.includes(
                                          value
                                        )}
                                        onChange={() =>
                                          handleEditFrequencyChange(
                                            value
                                          )
                                        }
                                      />{" "}
                                      {value}
                                    </label>
                                  )
                                )}
                              </div>
                            ) : (
                              item.frequency || "-"
                            )}
                          </td>

                          {/* INSTRUCTION */}

                          <td>
                            {editingId === item.id ? (
                              <select
                                className="form-control"
                                value={
                                  editInstruction
                                }
                                onChange={(e) =>
                                  setEditInstruction(
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">
                                  Select
                                </option>

                                <option value="Before Food">
                                  Before Food
                                </option>

                                <option value="After Food">
                                  After Food
                                </option>

                                <option value="Other">
                                  Other
                                </option>
                              </select>
                            ) : (
                              item.instruction || "-"
                            )}
                          </td>

                          {/* DURATION */}

                          <td>
                            {editingId === item.id ? (
                              <input
                                type="number"
                                min="1"
                                className="form-control"
                                value={editDuration}
                                onChange={(e) =>
                                  setEditDuration(
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              item.duration
                                ? `${item.duration} Days`
                                : "-"
                            )}
                          </td>

                          {/* ACTION */}

                          <td className="no-print">
                            {editingId === item.id ? (
                              <div
                                className="d-flex"
                                style={{
                                  gap: "5px",
                                }}
                              >
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                  onClick={
                                    saveEditedPreviousPrescription
                                  }
                                  disabled={editSaving}
                                >
                                  {editSaving
                                    ? "Saving..."
                                    : "💾 Save"}
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={cancelEdit}
                                  disabled={editSaving}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div
                                className="d-flex"
                                style={{
                                  gap: "5px",
                                }}
                              >
                                <button
                                  type="button"
                                  className="btn btn-warning btn-sm"
                                  onClick={() =>
                                    startEdit(item)
                                  }
                                  disabled={
                                    deletingPreviousId === item.id
                                  }
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    deletePrescription(
                                      item.id
                                    )
                                  }
                                  disabled={
                                    deletingPreviousId === item.id
                                  }
                                >
                                  {deletingPreviousId === item.id
                                    ? "Deleting..."
                                    : "🗑️ Delete"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* =================================================
              CHARGEABLE AMOUNT
          ================================================= */}

          {prescriptions.length >
            0 && (

              <div className="form-group mt-4">

                <label>
                  💰 Chargeable Amount
                </label>

                <div
                  className="d-flex flex-wrap"
                  style={{
                    gap: "20px",
                  }}
                >

                  <label>

                    <input
                      type="radio"
                      name="charge"
                      value="700"
                      checked={
                        charge ===
                        "700"
                      }
                      onChange={(e) =>
                        setCharge(
                          e.target
                            .value
                        )
                      }
                    />{" "}
                    ₹700

                  </label>

                  <label>

                    <input
                      type="radio"
                      name="charge"
                      value="1000"
                      checked={
                        charge ===
                        "1000"
                      }
                      onChange={(e) =>
                        setCharge(
                          e.target
                            .value
                        )
                      }
                    />{" "}
                    ₹1000

                  </label>

                  <label>

                    <input
                      type="radio"
                      name="charge"
                      value="Other"
                      checked={
                        charge ===
                        "Other"
                      }
                      onChange={(e) =>
                        setCharge(
                          e.target
                            .value
                        )
                      }
                    />{" "}
                    Other

                  </label>

                  {charge ===
                    "Other" && (

                      <input
                        type="number"
                        className="form-control"
                        style={{
                          width:
                            "120px",
                        }}
                        placeholder="Amount"
                        value={
                          otherAmount
                        }
                        onChange={(e) =>
                          setOtherAmount(
                            e.target
                              .value
                          )
                        }
                      />

                    )}

                </div>

              </div>

            )}

        </div>
      )}

    </div>
  );
}
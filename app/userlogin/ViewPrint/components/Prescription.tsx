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
};

type PrescriptionResponse = {
  IsSuccess?: boolean;
  Message?: string;
  Data?: PrescriptionItem[];
};

type Props = {
    isOpen: boolean;
    onToggle: () => void;
    onPrescriptionSaved?: () => void;
};


export default function Prescription({
  isOpen,
  onToggle,
  onPrescriptionSaved
}: Props) {

  const searchParams = useSearchParams();

  const patientId = searchParams.get("id");
  const appointmentId = searchParams.get("appointmentId");

  // =========================
  // FORM STATES
  // =========================

  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [unit, setUnit] = useState("");

  const [frequency, setFrequency] = useState<string[]>([]);

  const [instruction, setInstruction] = useState("");
  const [otherInstruction, setOtherInstruction] = useState("");

  const [duration, setDuration] = useState("");

  // =========================
  // MEDICINE SEARCH
  // =========================

  const [medicineSuggestions, setMedicineSuggestions] =
    useState<MedicineSuggestion[]>([]);

  const [showMedicineSuggestions, setShowMedicineSuggestions] =
    useState(false);

  const [medicineLoading, setMedicineLoading] =
    useState(false);

  const medicineSearchTimer = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const medicineWrapperRef =
    useRef<HTMLDivElement | null>(null);

  // =========================
  // PRESCRIPTION TABLE
  // =========================

  const [prescriptions, setPrescriptions] =
    useState<PrescriptionItem[]>([]);

  const [saving, setSaving] = useState(false);

  // =========================
  // CHARGE
  // =========================

  const [charge, setCharge] = useState("");

  const [otherAmount, setOtherAmount] =
    useState("");

  // =========================
  // MEDICINE SEARCH API
  // =========================

  async function searchMedicine(value: string) {
    const searchText = value.trim();

    if (searchText.length < 2) {
      setMedicineSuggestions([]);
      setShowMedicineSuggestions(false);
      return;
    }

    try {
      setMedicineLoading(true);

      const response = await apiFetch<
        MedicineSuggestion[]
      >(
        `UserLogin/Searchbymedicine?query=${encodeURIComponent(
          searchText
        )}`
      );

      console.log(
        "Medicine Search Response:",
        response
      );

      const result = Array.isArray(response)
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

  // =========================
  // MEDICINE INPUT CHANGE
  // =========================

  function handleMedicineChange(
    value: string
  ) {
    setMedicine(value);

    setShowMedicineSuggestions(true);

    if (medicineSearchTimer.current) {
      clearTimeout(
        medicineSearchTimer.current
      );
    }

    medicineSearchTimer.current =
      setTimeout(() => {
        searchMedicine(value);
      }, 300);
  }

  // =========================
  // SELECT MEDICINE
  // =========================

  function selectMedicine(
    medicineName: string
  ) {
    setMedicine(medicineName);

    setMedicineSuggestions([]);

    setShowMedicineSuggestions(false);
  }

  // =========================
  // OUTSIDE CLICK
  // =========================

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

  // =========================
  // ESCAPE KEY
  // =========================

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
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

  // =========================
  // CLEAN TIMER
  // =========================

  useEffect(() => {
    return () => {
      if (medicineSearchTimer.current) {
        clearTimeout(
          medicineSearchTimer.current
        );
      }
    };
  }, []);

  // =========================
  // FREQUENCY
  // =========================

  function handleFrequencyChange(
    value: string
  ) {
    setFrequency((prev) => {
      if (prev.includes(value)) {
        return prev.filter(
          (item) => item !== value
        );
      }

      return [...prev, value];
    });
  }

  // =========================
  // INSERT PRESCRIPTION API
  // =========================

  async function insertPrescription() {
    if (!patientId) {
      alert("User ID not found in URL");
      return;
    }

    if (!appointmentId) {
      alert("Appointment ID not found in URL");
      return;
    }

    if (!medicine.trim()) {
      alert("Please enter medicine.");
      return;
    }

    if (!dosage.trim()) {
      alert("Please enter dosage.");
      return;
    }

    if (!unit) {
      alert("Please select medicine type.");
      return;
    }

    if (frequency.length === 0) {
      alert("Please select frequency.");
      return;
    }

    if (!instruction) {
      alert("Please select instruction.");
      return;
    }

    if (
      instruction === "Other" &&
      !otherInstruction.trim()
    ) {
      alert("Please enter custom instruction.");
      return;
    }

    if (!duration) {
      alert("Please enter duration.");
      return;
    }

    const prescriptionData = {
      UserId: patientId,

      Medicine: medicine.trim(),

      Dose: dosage.trim(),

      Unit: unit,

      Frequencies: frequency.join(","),

      Instruction:
        instruction === "Other"
          ? otherInstruction.trim()
          : instruction,

      DurationDays: duration,

      appointmentId: appointmentId,
    };

    console.log(
      "Prescription API Request:",
      prescriptionData
    );

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
        "Prescription API Response:",
        response
      );

      if (response?.IsSuccess) {
  alert("Prescription saved successfully");

  // Add to local table
  const newPrescription: PrescriptionItem = {
    id: Date.now(),

    medicine: medicine.trim(),

    dosage: dosage.trim(),

    unit,

    frequency: frequency.join(", "),

    instruction:
      instruction === "Other"
        ? otherInstruction.trim()
        : instruction,

    duration,
  };

  setPrescriptions((prev) => [
    ...prev,
    newPrescription,
  ]);

  // Reset form
  setMedicine("");
  setDosage("");
  setUnit("");
  setFrequency([]);
  setInstruction("");
  setOtherInstruction("");
  setDuration("");

  setMedicineSuggestions([]);
  setShowMedicineSuggestions(false);

  // ⭐ Prescription API success hone ke baad
  // parent component ko notify karega
  onPrescriptionSaved?.();

} else {
  alert(
    response?.Message ||
      "Error saving prescription"
  );
}
    } catch (error) {
      console.error(
        "Insert prescription error:",
        error
      );

      alert(
        "Error saving prescription"
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // DELETE PRESCRIPTION
  // =========================

  function deletePrescription(
    id: number
  ) {
    setPrescriptions((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
     <div className="ibox mt-3">

    <div
      className="ibox-head"
      onClick={onToggle}
      style={{ cursor: "pointer" }}
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
        {isOpen ? "▲" : "▼"}
      </div>
    </div>

    {isOpen && (
      <div className="ibox-body">

        <h4 className="mb-3">
          Prescription Details
        </h4>

        {/* ================= MEDICINE ROW ================= */}

        <div className="row">

          {/* MEDICINE */}

          <div className="col-md-4">

            <div
              ref={medicineWrapperRef}
              className="form-group"
              style={{
                position: "relative",
              }}
            >

              <label htmlFor="txtMedicine">
                🔍 Medicine
              </label>

              <input
                type="text"
                id="txtMedicine"
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

              {/* SEARCH DROPDOWN */}

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
                      background: "#fff",
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
                            width: "100%",
                            border: "none",
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
                          onMouseEnter={(
                            e
                          ) => {
                            e.currentTarget.style.background =
                              "#f3f4f6";
                          }}
                          onMouseLeave={(
                            e
                          ) => {
                            e.currentTarget.style.background =
                              "#fff";
                          }}
                        >
                          {item.BrandName}
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

              <label htmlFor="txtQuantity">
                💊 Dosage
              </label>

              <input
                type="text"
                id="txtQuantity"
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


          {/* MEDICINE TYPE */}

          <div className="col-md-4">

            <div className="form-group">

              <label htmlFor="ddlUnit">
                💊 Medicine Type
              </label>

              <select
                id="ddlUnit"
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


        {/* ================= FREQUENCY ================= */}

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
              ["Morning", "🌅 Morning"],
              ["Midday", "☀️ Midday"],
              ["Evening", "🌆 Evening"],
              ["Night", "🌙 Night"],
            ].map(
              ([value, label]) => (
                <label
                  key={value}
                  style={{
                    margin: 0,
                  }}
                >
                  <input
                    type="checkbox"
                    value={value}
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


        {/* ================= INSTRUCTION + DURATION ================= */}

        <div className="row mt-3">

          {/* INSTRUCTION */}

          <div className="col-md-6">

            <div className="form-group">

              <label htmlFor="ddlInstruction">
                ℹ️ Instruction
              </label>

              <select
                id="ddlInstruction"
                className="form-control"
                value={instruction}
                onChange={(e) => {
                  const value =
                    e.target.value;

                  setInstruction(value);

                  if (
                    value !== "Other"
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
                  id="txtInstructionOther"
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


          {/* DURATION */}

          <div className="col-md-6">

            <div className="form-group">

              <label htmlFor="txtDuration">
                📅 Duration (Days)
              </label>

              <input
                type="number"
                id="txtDuration"
                className="form-control"
                placeholder="Enter duration in days"
                min="1"
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


        {/* ================= SAVE PRESCRIPTION ================= */}

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


        {/* ================= TABLE ================= */}

        {prescriptions.length >
          0 && (
          <div
            className="table-responsive mt-4"
          >

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

                  <th>
                    Action
                  </th>
                </tr>

              </thead>

              <tbody>

                {prescriptions.map(
                  (item) => (
                    <tr
                      key={item.id}
                    >

                      <td>
                        {item.medicine}
                      </td>

                      <td>
                        {item.dosage}{" "}
                        {item.unit}
                      </td>

                      <td>
                        {
                          item.frequency
                        }
                      </td>

                      <td>
                        {
                          item.instruction
                        }
                      </td>

                      <td>
                        {
                          item.duration
                        }{" "}
                        Days
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            deletePrescription(
                              item.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}


        {/* ================= CHARGEABLE AMOUNT ================= */}

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
                    charge === "700"
                  }
                  onChange={(e) =>
                    setCharge(
                      e.target.value
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
                    charge === "1000"
                  }
                  onChange={(e) =>
                    setCharge(
                      e.target.value
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
                    charge === "Other"
                  }
                  onChange={(e) =>
                    setCharge(
                      e.target.value
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
                    width: "120px",
                  }}
                  placeholder="Amount"
                  value={
                    otherAmount
                  }
                  onChange={(e) =>
                    setOtherAmount(
                      e.target.value
                    )
                  }
                />
              )}

            </div>

          </div>
        )}

      </div>)}
    </div>
  );
}
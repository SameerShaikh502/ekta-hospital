"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AddPatientPage() {
  // =========================
  // GENERAL FIELDS
  // =========================

  const [title, setTitle] = useState("0");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();
const [patientAdded, setPatientAdded] = useState(false);

  const [ageYears, setAgeYears] = useState("");

  const [gender, setGender] = useState("");

  const [mobile, setMobile] = useState("");

  const [emergencyName, setEmergencyName] =
    useState("");

  const [emergencyNumber, setEmergencyNumber] =
    useState("");

  const [referredBy, setReferredBy] =
    useState("");

  const [clinicSource, setClinicSource] =
    useState("");

  const [patientType, setPatientType] =
    useState("Self");

  const [saving, setSaving] = useState(false);function goToCreateAppointment() {
  router.push("/userlogin/CreateAppointment");
}

  // =========================
  // ADD PATIENT
  // =========================

async function addPatient() {
  // =========================
  // VALIDATION
  // =========================

  if (title === "0") {
    alert("Please select title");
    return;
  }

  if (!firstName.trim()) {
    alert("Please enter first name");
    return;
  }

  if (!lastName.trim()) {
    alert("Please enter last name");
    return;
  }

  if (!gender) {
    alert("Please select gender");
    return;
  }

  if (!mobile.trim()) {
    alert("Please enter mobile number");
    return;
  }
  

  // =========================
  // OLD ASP.NET API PAYLOAD
  // =========================

  const patientData = {
    // General
    Title: title,
    FirstName: firstName.trim(),
    LastName: lastName.trim(),
    AgeYears: ageYears,
    AgeMonths: "",
    AgeDays: "",
    DOB: "",
    Gender: gender,
    MobileNo: mobile.trim(),

    EmergencyContactName:
      emergencyName.trim(),

    EmergencyContactNumber:
      emergencyNumber.trim(),

    Email: "",

    PatientUniqueID: "",

    ReferredByDoctor:
      referredBy.trim(),

    ConsultingDoctors: "",

    ClinicInfoSource:
      clinicSource.trim(),

    // Self / Caregiver
    // Old ASP.NET radio button "on" value
    PatientType: patientType,

    // Other fields required by old API
    // but not shown in our UI
    Language: "0",
    BloodGroup: "0",

    HeightCm: "",
    WeightKg: "",

    Address: "",
    Landmark: "",

    State: "0",
    City: "",
    Locality: "",
    PinCode: "",

    GSTNo: "",

    SmokingHabits: "0",
    AlcoholConsumption: "0",
    FoodPreference: "0",
    Occupation: "0",

    OtherlifestyleActivities: "",

    FamilyHealthHistory: "",

    Injuries: "",
    Surgeries: "",

    FoodAllergies: "",
    MedicineAllergies: "",
    OtherAllergies: "",

    ModeOfDelivery: null,
    TypeOfPregnancy: null,

    GestationalAgeWeeks: "",
    GestationalAgeDays: "",

    BirthWeightKg: "",
    BabyLength: "",
    APGARScore: "",
    HeadCircumference: "",

    MotherMedication: "",
    MotherPastMedicalCondition: "",

    GeneticDisorder: "",
    ComplicationsDuringBirth: "",
    FatherGeneticCondition: "",
  };

  console.log(
    "Insert Patient Request:",
    patientData
  );

  // =========================
  // API CALL
  // =========================

  try {
    setSaving(true);

    const response = await apiFetch<any>(
      "UserLogin/InsertPatinentdetails",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          patientData
        ),
      }
    );

    console.log(
      "Insert Patient Response:",
      response
    );

    // =========================
    // SUCCESS
    // =========================

   if (
  response?.IsSuccess === true ||
  response?.isSuccess === true
) {
  console.log(
    "Insert Patient Response:",
    response
  );

  // Patient successfully added
  setPatientAdded(true);

  alert("Patient added successfully");

  // IMPORTANT:
  // Form reset nahi karna hai.
} else {
  alert(
    response?.Message ||
      response?.message ||
      "Error adding patient"
  );
}
  } catch (error) {
    console.error(
      "Insert Patient Error:",
      error
    );

    alert(
      "Error adding patient"
    );
  } finally {
    setSaving(false);
  }
}

  // =========================
  // UI
  // =========================

  return (
    <main className="page-content">

      <div className="ibox">

        {/* =========================
            HEADER
        ========================= */}

        <div className="ibox-head">

          <div className="ibox-title">
            Add Patient
          </div>

        </div>

        {/* =========================
            BODY
        ========================= */}

        <div className="ibox-body">

          <h4 className="mb-4">
            General
          </h4>

          {/* =========================
              ROW 1
          ========================= */}

          <div className="row">

            {/* TITLE */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  Title
                </label>

                <select
                  id="ddlTitle"
                  className="form-control"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                >

                  <option value="0">
                    Select Title
                  </option>

                  <option value="Mr">
                    Mr
                  </option>

                  <option value="Mrs">
                    Mrs
                  </option>

                  <option value="Ms">
                    Ms
                  </option>

                  <option value="Miss">
                    Miss
                  </option>

                  <option value="Dr">
                    Dr
                  </option>

                </select>

              </div>

            </div>

            {/* FIRST NAME */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  First Name
                </label>

                <input
                  id="txtFirstName"
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* LAST NAME */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  Last Name
                </label>

                <input
                  id="txtLastName"
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>

          {/* =========================
              ROW 2
          ========================= */}

          <div className="row">

            {/* AGE */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  Age (Y)
                </label>

                <input
                  id="txtAgeYears"
                  type="number"
                  className="form-control"
                  placeholder="Age (Y)"
                  min="0"
                  value={ageYears}
                  onChange={(e) =>
                    setAgeYears(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* GENDER */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  Gender
                </label>

                <select
                  id="ddlGender"
                  className="form-control"
                  value={gender}
                  onChange={(e) =>
                    setGender(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>

            {/* MOBILE */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  Mobile No
                </label>

                <input
                  id="txtMobile"
                  type="tel"
                  className="form-control"
                  placeholder="Mobile No"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>

          {/* =========================
              ROW 3
          ========================= */}

          <div className="row">

            {/* EMERGENCY NAME */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  Emergency Contact Name
                </label>

                <input
                  id="txtEmergencyName"
                  type="text"
                  className="form-control"
                  placeholder="Emergency Contact Name"
                  value={emergencyName}
                  onChange={(e) =>
                    setEmergencyName(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* EMERGENCY NUMBER */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  Emergency Contact Number
                </label>

                <input
                  id="txtEmergencyNumber"
                  type="tel"
                  className="form-control"
                  placeholder="Emergency Contact Number"
                  value={emergencyNumber}
                  onChange={(e) =>
                    setEmergencyNumber(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* REFERRED BY */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  Referred By Doctor
                </label>

                <input
                  id="txtReferredBy"
                  type="text"
                  className="form-control"
                  placeholder="Referred By Doctor"
                  value={referredBy}
                  onChange={(e) =>
                    setReferredBy(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>

          {/* =========================
              ROW 4
          ========================= */}

          <div className="row">

            {/* CLINIC SOURCE */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  Clinic Info Source
                </label>

                <input
                  id="txtClinicSource"
                  type="text"
                  className="form-control"
                  placeholder="Clinic Info Source"
                  value={clinicSource}
                  onChange={(e) =>
                    setClinicSource(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            {/* SELF / CAREGIVER */}

            <div className="col-md-4">

              <div className="form-group">

                <label>
                  Patient Type
                </label>

                <div className="mt-2">

                  <label className="mr-4">

                    <input
                      type="radio"
                      name="patientType"
                      value="Self"
                      checked={
                        patientType ===
                        "Self"
                      }
                      onChange={(e) =>
                        setPatientType(
                          e.target.value
                        )
                      }
                    />

                    {" "}Self

                  </label>

                  <label>

                    <input
                      type="radio"
                      name="patientType"
                      value="Caregiver"
                      checked={
                        patientType ===
                        "Caregiver"
                      }
                      onChange={(e) =>
                        setPatientType(
                          e.target.value
                        )
                      }
                    />

                    {" "}Caregiver

                  </label>

                </div>

              </div>

            </div>

          </div>

          {/* =========================
              ADD PATIENT BUTTON
          ========================= */}

<div className="patient-action-buttons">

  <button
    type="button"
    id="btnAddPatient"
    className="btn btn-primary"
    onClick={addPatient}
    disabled={saving}
  >
    {saving ? "Saving..." : "Add Patient"}
  </button>

  {patientAdded && (
    <button
      type="button"
      id="btnCreateAppointment"
      className="btn btn-info"
      onClick={goToCreateAppointment}
    >
      CREATE APPOINTMENT
    </button>
  )}

</div>

        </div>

      </div>

    </main>
  );
}
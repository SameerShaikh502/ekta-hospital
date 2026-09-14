"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Patient = {
  PatientUniqueID?: string;
  Title?: string;
  FirstName?: string;
  LastName?: string;
  Gender?: string;
  MaritalStatus?: string;
  DOB?: string;

  AgeYears?: number;
  AgeMonths?: number;
  AgeDays?: number;

  Language?: string;
  Occupation?: string;

  MobileNo?: string;
  Email?: string;
  EmergencyContactName?: string;
  EmergencyContactNumber?: string;

  Address?: string;
  Locality?: string;
  Landmark?: string;
  City?: string;
  State?: string;
  PinCode?: string;

  BloodGroup?: string;
  HeightCm?: string;
  WeightKg?: string;
  PatientType?: string;

  SmokingHabits?: string;
  AlcoholConsumption?: string;
  FoodPreference?: string;
  FamilyHealthHistory?: string;

  FoodAllergies?: string;
  MedicineAllergies?: string;
  OtherAllergies?: string;

  ModeOfDelivery?: string;
  TypeOfPregnancy?: string;

  GestationalAgeWeeks?: number;
  GestationalAgeDays?: number;

  BirthWeightKg?: string;
  BabyLength?: string;
  HeadCircumference?: string;
  APGARScore?: string;
  ComplicationsDuringBirth?: string;
};

type PatientResponse = {
  IsSuccess?: boolean;
  Data?: Patient[];
};

type Props = {
  patientId: string | null;
  isOpen: boolean;
  onToggle: () => void;
};


export default function PatientProfile({
  patientId,
  isOpen,
  onToggle,
}: Props) {

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (!patientId) {
    setPatient(null);
    return;
  }

  const id = patientId;

  async function loadPatient() {
    try {
      setLoading(true);

      const body = new URLSearchParams();
      body.set("id", id);

      const response = await apiFetch<PatientResponse>(
        "UserLogin/GetPatientById",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        }
      );

      if (
        response?.IsSuccess &&
        response.Data &&
        response.Data.length > 0
      ) {
        setPatient(response.Data[0]);
      } else {
        setPatient(null);
      }
    } catch (error) {
      console.error("Error loading patient:", error);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }

  loadPatient();
}, [patientId]);

  if (loading) {
    return (
      <div className="ibox">
        <div className="ibox-body">
          Loading patient profile...
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="ibox">
        <div className="ibox-body">
          Patient information not found.
        </div>
      </div>
    );
  }

  const fullName = [
    patient.Title,
    patient.FirstName,
    patient.LastName,
  ]
    .filter(Boolean)
    .join(" ");

  const fullAddress = [
    patient.Address,
    patient.Locality,
    patient.Landmark,
    patient.City,
    patient.State,
  ]
    .filter(Boolean)
    .join(", ");

  return (
     <div className="ibox">

    {/* HEADER */}
    <div
      className="ibox-head"
      onClick={onToggle}
      style={{ cursor: "pointer" }}
    >
      <div className="ibox-title">
        👤 Patient Full Profile
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

    {/* BODY */}
    {isOpen && (<div className="ibox-body">

        {/* PERSONAL INFORMATION */}
        <h5 className="profile-section-title">
          Personal Information
        </h5>

        <div className="profile-grid">

          <div>
            <b>Patient ID:</b>
            <span>{patient.PatientUniqueID || "-"}</span>
          </div>

          <div>
            <b>Name:</b>
            <span>{fullName || "-"}</span>
          </div>

          <div>
            <b>Gender:</b>
            <span>{patient.Gender || "-"}</span>
          </div>

            <div>
            <b>Age:</b>
            <span>
              {patient.AgeYears ?? 0} 
              {patient.AgeMonths ?? 0} 
              {patient.AgeDays ?? 0}
            </span>
          </div>
{/* 
          <div>
            <b>Marital Status:</b>
            <span>{patient.MaritalStatus || "-"}</span>
          </div>

          <div>
            <b>DOB:</b>
            <span>{patient.DOB || "-"}</span>
          </div> */}

        
{/* 
          <div>
            <b>Language:</b>
            <span>{patient.Language || "-"}</span>
          </div>

          <div>
            <b>Occupation:</b>
            <span>{patient.Occupation || "-"}</span>
          </div> */}

        </div>


        {/* CONTACT INFORMATION */}
        {/* <h5 className="profile-section-title">
          Contact Information
        </h5>

        <div className="profile-grid">

          <div>
            <b>Mobile:</b>
            <span>{patient.MobileNo || "-"}</span>
          </div>

          <div>
            <b>Email:</b>
            <span>{patient.Email || "-"}</span>
          </div>

          <div>
            <b>Emergency:</b>
            <span>
              {patient.EmergencyContactName || "-"}
            </span>
          </div>

          <div>
            <b>Emergency Number:</b>
            <span>
              {patient.EmergencyContactNumber || "-"}
            </span>
          </div>

          <div className="profile-full-width">
            <b>Address:</b>
            <span>{fullAddress || "-"}</span>
          </div>

        </div> */}


        {/* MEDICAL INFORMATION */}
        {/* <h5 className="profile-section-title">
          Medical Information
        </h5>

        <div className="profile-grid">

          <div>
            <b>Blood Group:</b>
            <span>{patient.BloodGroup || "-"}</span>
          </div>

          <div>
            <b>Height:</b>
            <span>
              {patient.HeightCm || "-"} cm
            </span>
          </div>

          <div>
            <b>Weight:</b>
            <span>
              {patient.WeightKg || "-"} kg
            </span>
          </div>

          <div>
            <b>Patient Type:</b>
            <span>{patient.PatientType || "-"}</span>
          </div>

          <div>
            <b>Smoking:</b>
            <span>{patient.SmokingHabits || "-"}</span>
          </div>

          <div>
            <b>Alcohol:</b>
            <span>
              {patient.AlcoholConsumption || "-"}
            </span>
          </div>

          <div>
            <b>Food Preference:</b>
            <span>
              {patient.FoodPreference || "-"}
            </span>
          </div>

          <div>
            <b>Family History:</b>
            <span>
              {patient.FamilyHealthHistory || "-"}
            </span>
          </div>

        </div> */}


        {/* ALLERGIES */}
        {/* <h5 className="profile-section-title">
          Allergies
        </h5>

        <div className="profile-grid">

          <div>
            <b>Food:</b>
            <span>{patient.FoodAllergies || "-"}</span>
          </div>

          <div>
            <b>Medicine:</b>
            <span>
              {patient.MedicineAllergies || "-"}
            </span>
          </div>

          <div>
            <b>Other:</b>
            <span>{patient.OtherAllergies || "-"}</span>
          </div>

        </div> */}


        {/* BIRTH DETAILS */}
        {/* <h5 className="profile-section-title">
          Birth & Pregnancy Details
        </h5>

        <div className="profile-grid">

          <div>
            <b>Delivery Mode:</b>
            <span>
              {patient.ModeOfDelivery || "-"}
            </span>
          </div>

          <div>
            <b>Pregnancy Type:</b>
            <span>
              {patient.TypeOfPregnancy || "-"}
            </span>
          </div>

          <div>
            <b>Gestation:</b>
            <span>
              {patient.GestationalAgeWeeks ?? 0} Weeks{" "}
              {patient.GestationalAgeDays ?? 0} Days
            </span>
          </div>

          <div>
            <b>Birth Weight:</b>
            <span>
              {patient.BirthWeightKg || "-"} Kg
            </span>
          </div>

          <div>
            <b>Baby Length:</b>
            <span>
              {patient.BabyLength || "-"} cm
            </span>
          </div>

          <div>
            <b>Head Circumference:</b>
            <span>
              {patient.HeadCircumference || "-"} cm
            </span>
          </div>

          <div>
            <b>APGAR Score:</b>
            <span>{patient.APGARScore || "-"}</span>
          </div>

          <div>
            <b>Complications:</b>
            <span>
              {patient.ComplicationsDuringBirth || "-"}
            </span>
          </div>

        </div> */}

      </div>)}
    </div>
  );
}
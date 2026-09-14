"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Patient = {
  ID?: number;
  Id?: number;
  PatientUniqueID?: string;

  Title?: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;

  Gender?: string;
  MaritalStatus?: string;
  DOB?: string;
  Age?: number | string;
  Language?: string;
  Occupation?: string;

  Mobile?: string;
  Email?: string;
  EmergencyContactName?: string;
  EmergencyContactNumber?: string;
  Address?: string;

  BloodGroup?: string;
  Height?: string | number;
  Weight?: string | number;
  PatientType?: string;
  Smoking?: string;
  Alcohol?: string;
  FoodPreference?: string;
  FamilyHistory?: string;

  FoodAllergy?: string;
  MedicineAllergy?: string;
  OtherAllergy?: string;

  DeliveryMode?: string;
  PregnancyType?: string;
  Gestation?: string;
  BirthWeight?: string | number;
  BabyLength?: string | number;
  HeadCircumference?: string | number;
  APGARScore?: string | number;
  BirthComplications?: string;
};

type ApiResponse = {
  IsSuccess?: boolean;
  Message?: string;
  Data?: any;
};

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const patientId = searchParams.get("id") || "";

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patientId) {
      setError("Patient ID not found.");
      setLoading(false);
      return;
    }

    loadPatient();
  }, [patientId]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch<ApiResponse>(
        "UserLogin/GetPatientById",
        {
          method: "POST",
          body: JSON.stringify({
            ID: Number(patientId),
          }),
        }
      );

      console.log("GetPatientById Response:", response);

      const patientData =
        response?.Data?.Table?.[0] ||
        response?.Data?.[0] ||
        response?.Data ||
        null;

      if (!patientData) {
        setError("Patient details not found.");
        return;
      }

      setPatient(patientData);
    } catch (err) {
      console.error("Load patient error:", err);
      setError("Unable to load patient details.");
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    if (!patientId) {
      alert("Patient ID not found.");
      return;
    }

    try {
      setBooking(true);

      const response = await apiFetch<ApiResponse>(
        "UserLogin/Bookappointment",
        {
          method: "POST",
          body: JSON.stringify({
            Patientid: Number(patientId),
          }),
        }
      );

      console.log("Book Appointment Response:", response);

      if (response?.IsSuccess === false) {
        alert(response?.Message || "Unable to book appointment.");
        return;
      }

      alert(response?.Message || "Appointment booked successfully.");

      router.push("/userlogin/CreateAppointment");
    } catch (err) {
      console.error("Book appointment error:", err);
      alert("Unable to book appointment.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <h5>Loading patient details...</h5>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          {error}
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-warning">
          Patient details not found.
        </div>
      </div>
    );
  }

  const patientName = [
    patient.Title,
    patient.FirstName,
    patient.MiddleName,
    patient.LastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="container-fluid p-4">

      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Patient Full Profile</h3>
          <p className="text-muted mb-0">
            Patient details and appointment booking
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>

      {/* PERSONAL INFORMATION */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Personal Information</h5>
        </div>

        <div className="card-body">
          <div className="row">

            <div className="col-md-3 mb-3">
              <strong>Patient ID</strong>
              <div>
                {patient.PatientUniqueID ||
                  patient.ID ||
                  patient.Id ||
                  patientId}
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Name</strong>
              <div>{patientName || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Gender</strong>
              <div>{patient.Gender || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Marital Status</strong>
              <div>{patient.MaritalStatus || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Date of Birth</strong>
              <div>{patient.DOB || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Age</strong>
              <div>{patient.Age || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Language</strong>
              <div>{patient.Language || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Occupation</strong>
              <div>{patient.Occupation || "-"}</div>
            </div>

          </div>
        </div>
      </div>

      {/* CONTACT INFORMATION */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Contact Information</h5>
        </div>

        <div className="card-body">
          <div className="row">

            <div className="col-md-4 mb-3">
              <strong>Mobile</strong>
              <div>{patient.Mobile || "-"}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Email</strong>
              <div>{patient.Email || "-"}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Emergency Contact</strong>
              <div>{patient.EmergencyContactName || "-"}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Emergency Number</strong>
              <div>{patient.EmergencyContactNumber || "-"}</div>
            </div>

            <div className="col-md-8 mb-3">
              <strong>Address</strong>
              <div>{patient.Address || "-"}</div>
            </div>

          </div>
        </div>
      </div>

      {/* MEDICAL INFORMATION */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Medical Information</h5>
        </div>

        <div className="card-body">
          <div className="row">

            <div className="col-md-3 mb-3">
              <strong>Blood Group</strong>
              <div>{patient.BloodGroup || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Height</strong>
              <div>{patient.Height || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Weight</strong>
              <div>{patient.Weight || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Patient Type</strong>
              <div>{patient.PatientType || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Smoking</strong>
              <div>{patient.Smoking || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Alcohol</strong>
              <div>{patient.Alcohol || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Food Preference</strong>
              <div>{patient.FoodPreference || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Family History</strong>
              <div>{patient.FamilyHistory || "-"}</div>
            </div>

          </div>
        </div>
      </div>

      {/* ALLERGIES */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Allergies</h5>
        </div>

        <div className="card-body">
          <div className="row">

            <div className="col-md-4 mb-3">
              <strong>Food Allergy</strong>
              <div>{patient.FoodAllergy || "-"}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Medicine Allergy</strong>
              <div>{patient.MedicineAllergy || "-"}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>Other Allergy</strong>
              <div>{patient.OtherAllergy || "-"}</div>
            </div>

          </div>
        </div>
      </div>

      {/* BIRTH DETAILS */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">Birth Details</h5>
        </div>

        <div className="card-body">
          <div className="row">

            <div className="col-md-3 mb-3">
              <strong>Delivery Mode</strong>
              <div>{patient.DeliveryMode || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Pregnancy Type</strong>
              <div>{patient.PregnancyType || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Gestation</strong>
              <div>{patient.Gestation || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Birth Weight</strong>
              <div>{patient.BirthWeight || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Baby Length</strong>
              <div>{patient.BabyLength || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Head Circumference</strong>
              <div>{patient.HeadCircumference || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>APGAR Score</strong>
              <div>{patient.APGARScore || "-"}</div>
            </div>

            <div className="col-md-3 mb-3">
              <strong>Complications</strong>
              <div>{patient.BirthComplications || "-"}</div>
            </div>

          </div>
        </div>
      </div>

      {/* BOOK APPOINTMENT */}
      <div className="card shadow-sm mb-4">
        <div className="card-body text-center py-4">

          <button
            type="button"
            className="btn btn-primary btn-lg px-5"
            onClick={bookAppointment}
            disabled={booking}
          >
            {booking ? "BOOKING..." : "BOOK APPOINTMENT"}
          </button>

        </div>
      </div>

    </div>
  );
}

/*
 * IMPORTANT:
 * useSearchParams() is inside BookAppointmentContent.
 * The content is wrapped inside Suspense so Vercel/Next.js
 * production build does not fail during prerendering.
 */
export default function BookAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="container-fluid p-4">
          <div className="card shadow-sm">
            <div className="card-body text-center py-5">
              <h5>Loading...</h5>
            </div>
          </div>
        </div>
      }
    >
      <BookAppointmentContent />
    </Suspense>
  );
}
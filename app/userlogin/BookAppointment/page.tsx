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
  Age?: string | number;

  Language?: string;
  Occupation?: string;

  MobileNo?: string;
  Email?: string;

  EmergencyContactName?: string;
  EmergencyContactNumber?: string;

  FullAddress?: string;
  Address?: string;
  Landmark?: string;
  State?: string;
  City?: string;
  Locality?: string;
  PinCode?: string;

  BloodGroup?: string;

  HeightCm?: string | number;
  WeightKg?: string | number;

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

  GestationalAgeWeeks?: string | number;
  GestationalAgeDays?: string | number;

  BirthWeightKg?: string | number;
  BabyLength?: string | number;

  HeadCircumference?: string | number;
  APGARScore?: string | number;

  ComplicationsDuringBirth?: string;
};

type ApiResponse = {
  IsSuccess?: boolean;
  Message?: string;
  Data?: any;
};

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const patientId =
    searchParams.get("id") || "";

  const [patient, setPatient] =
    useState<Patient | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [booking, setBooking] =
    useState(false);

  // =========================
  // LOAD PATIENT
  // =========================

  async function loadPatient() {
    if (!patientId) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await apiFetch<ApiResponse>(
          "UserLogin/GetPatientById",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ID: Number(patientId),
            }),
          }
        );

      console.log(
        "GetPatientById Response:",
        response
      );

      if (response?.IsSuccess) {
        const data =
          response?.Data?.Table?.[0] ||
          response?.Data?.[0] ||
          response?.Data ||
          null;

        setPatient(data);
      } else {
        setPatient(null);

        alert(
          response?.Message ||
            "Patient details not found."
        );
      }
    } catch (error) {
      console.error(
        "GetPatientById error:",
        error
      );

      setPatient(null);

      alert(
        "Unable to load patient details."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    loadPatient();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  // =========================
  // DISPLAY VALUE
  // =========================

  function value(
    val: any
  ) {
    if (
      val === null ||
      val === undefined ||
      val === ""
    ) {
      return "-";
    }

    return String(val);
  }

  // =========================
  // FULL NAME
  // =========================

  function getFullName() {
    if (!patient) {
      return "-";
    }

    return (
      `${patient.Title || ""} ${
        patient.FirstName || ""
      } ${
        patient.MiddleName || ""
      } ${
        patient.LastName || ""
      }`
        .replace(/\s+/g, " ")
        .trim() || "-"
    );
  }

  // =========================
  // FULL ADDRESS
  // =========================

  function getFullAddress() {
    if (!patient) {
      return "-";
    }

    if (patient.FullAddress) {
      return patient.FullAddress;
    }

    const addressParts = [
      patient.Address,
      patient.Landmark,
      patient.Locality,
      patient.City,
      patient.State,
      patient.PinCode,
    ].filter(
      (item) =>
        item !== null &&
        item !== undefined &&
        String(item).trim() !== ""
    );

    return addressParts.length
      ? addressParts.join(", ")
      : "-";
  }

  // =========================
  // AGE
  // =========================

  function getAge() {
    if (!patient) {
      return "-";
    }

    if (
      patient.Age !== undefined &&
      patient.Age !== null &&
      patient.Age !== ""
    ) {
      return patient.Age;
    }

    return "-";
  }

  // =========================
  // GESTATION
  // =========================

  function getGestation() {
    if (!patient) {
      return "-";
    }

    const weeks =
      patient.GestationalAgeWeeks;

    const days =
      patient.GestationalAgeDays;

    if (
      (weeks === undefined ||
        weeks === null ||
        weeks === "") &&
      (days === undefined ||
        days === null ||
        days === "")
    ) {
      return "-";
    }

    return `${value(weeks)} weeks, ${value(
      days
    )} days`;
  }

  // =========================
  // BOOK APPOINTMENT
  // =========================

  async function bookAppointment() {
    if (!patientId) {
      alert(
        "Patient ID not found."
      );

      return;
    }

    if (!patient) {
      alert(
        "Patient details are not loaded."
      );

      return;
    }

    try {
      setBooking(true);

      /*
       * Old ASP.NET:
       *
       * [HttpPost]
       * public JsonResult Bookappointment(int Patientid)
       *
       * Therefore send only Patientid.
       */

      const response =
        await apiFetch<ApiResponse>(
          "UserLogin/Bookappointment",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              Patientid: Number(patientId),
            }),
          }
        );

      console.log(
        "Bookappointment Response:",
        response
      );

      if (response?.IsSuccess) {
        alert(
          response?.Message ||
            "Appointment booked successfully."
        );

        // Go back to Create Appointment
        router.push(
          "/userlogin/CreateAppointment"
        );
      } else {
        alert(
          response?.Message ||
            "Failed to book appointment."
        );
      }
    } catch (error) {
      console.error(
        "Bookappointment error:",
        error
      );

      alert(
        "Something went wrong while booking appointment."
      );
    } finally {
      setBooking(false);
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="page-content">
        <div className="ibox">

          <div className="ibox-head bg-primary text-white">
            <div className="ibox-title">
              <i className="fa fa-id-card mr-2"></i>
              Patient Full Profile
            </div>
          </div>

          <div
            className="ibox-body text-center"
            style={{
              padding: "50px",
            }}
          >
            Loading patient details...
          </div>

        </div>
      </main>
    );
  }

  // =========================
  // PATIENT NOT FOUND
  // =========================

  if (!patient) {
    return (
      <main className="page-content">
        <div className="ibox">

          <div className="ibox-head bg-primary text-white">
            <div className="ibox-title">
              <i className="fa fa-id-card mr-2"></i>
              Patient Full Profile
            </div>
          </div>

          <div
            className="ibox-body text-center"
            style={{
              padding: "50px",
            }}
          >
            <p>
              Patient details not found.
            </p>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                router.push(
                  "/userlogin/CreateAppointment"
                )
              }
            >
              Back
            </button>
          </div>

        </div>
      </main>
    );
  }

  // =========================
  // MAIN
  // =========================

  return (
    <main className="page-content">

      <div className="row">

        <div className="col-md-12">

          <div className="ibox">

            {/* =========================
                HEADER
            ========================= */}

            <div className="ibox-head bg-primary text-white">

              <div className="ibox-title">
                <i className="fa fa-id-card mr-2"></i>

                Patient Full Profile
              </div>

              <div className="ibox-tools">
                <a className="text-white">
                  <i className="fa fa-plus"></i>
                </a>

                <a className="text-white ml-2">
                  <i className="fa fa-expand"></i>
                </a>
              </div>

            </div>

            {/* =========================
                BODY
            ========================= */}

            <div className="ibox-body">

              {/* =========================
                  PERSONAL INFORMATION
              ========================= */}

              <h5 className="text-primary border-bottom pb-2">
                Personal Information
              </h5>

              <div className="row">

                <div className="col-md-3 mb-3">
                  <b>Patient ID:</b>{" "}
                  {value(
                    patient.PatientUniqueID ||
                      patient.ID ||
                      patient.Id ||
                      patientId
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Name:</b>{" "}
                  {getFullName()}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Gender:</b>{" "}
                  {value(
                    patient.Gender
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Marital Status:</b>{" "}
                  {value(
                    patient.MaritalStatus
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>DOB:</b>{" "}
                  {value(
                    patient.DOB
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Age:</b>{" "}
                  {getAge()}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Language:</b>{" "}
                  {value(
                    patient.Language
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Occupation:</b>{" "}
                  {value(
                    patient.Occupation
                  )}
                </div>

              </div>

              {/* =========================
                  CONTACT INFORMATION
              ========================= */}

              <h5 className="text-primary border-bottom pb-2 mt-3">
                Contact Information
              </h5>

              <div className="row">

                <div className="col-md-2 mb-3">
                  <b>Mobile:</b>{" "}
                  {value(
                    patient.MobileNo
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  <b>Email:</b>{" "}
                  {value(
                    patient.Email
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Emergency:</b>{" "}
                  {value(
                    patient.EmergencyContactName
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Emergency Number:</b>{" "}
                  {value(
                    patient.EmergencyContactNumber
                  )}
                </div>

                <div className="col-md-12 mb-3">
                  <b>Address:</b>{" "}
                  {getFullAddress()}
                </div>

              </div>

              {/* =========================
                  MEDICAL INFORMATION
              ========================= */}

              <h5 className="text-primary border-bottom pb-2 mt-3">
                Medical Information
              </h5>

              <div className="row">

                <div className="col-md-3 mb-3">
                  <b>Blood Group:</b>{" "}

                  <span className="badge badge-danger">
                    {value(
                      patient.BloodGroup
                    )}
                  </span>
                </div>

                <div className="col-md-3 mb-3">
                  <b>Height (cm):</b>{" "}
                  {value(
                    patient.HeightCm
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Weight (kg):</b>{" "}
                  {value(
                    patient.WeightKg
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Patient Type:</b>{" "}
                  {value(
                    patient.PatientType
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Smoking:</b>{" "}
                  {value(
                    patient.SmokingHabits
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Alcohol:</b>{" "}
                  {value(
                    patient.AlcoholConsumption
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Food Preference:</b>{" "}
                  {value(
                    patient.FoodPreference
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Family History:</b>{" "}
                  {value(
                    patient.FamilyHealthHistory
                  )}
                </div>

              </div>

              {/* =========================
                  ALLERGIES
              ========================= */}

              <h5 className="text-primary border-bottom pb-2 mt-3">
                Allergies
              </h5>

              <div className="row">

                <div className="col-md-4 mb-3">
                  <b>Food:</b>{" "}
                  {value(
                    patient.FoodAllergies
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  <b>Medicine:</b>{" "}
                  {value(
                    patient.MedicineAllergies
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  <b>Other:</b>{" "}
                  {value(
                    patient.OtherAllergies
                  )}
                </div>

              </div>

              {/* =========================
                  BIRTH DETAILS
              ========================= */}

              <h5 className="text-primary border-bottom pb-2 mt-3">
                Birth & Pregnancy Details
              </h5>

              <div className="row">

                <div className="col-md-3 mb-3">
                  <b>Delivery Mode:</b>{" "}
                  {value(
                    patient.ModeOfDelivery
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Pregnancy Type:</b>{" "}
                  {value(
                    patient.TypeOfPregnancy
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Gestation:</b>{" "}
                  {getGestation()}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Birth Weight:</b>{" "}
                  {value(
                    patient.BirthWeightKg
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Baby Length:</b>{" "}
                  {value(
                    patient.BabyLength
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Head Circumference:</b>{" "}
                  {value(
                    patient.HeadCircumference
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>APGAR Score:</b>{" "}
                  {value(
                    patient.APGARScore
                  )}
                </div>

                <div className="col-md-3 mb-3">
                  <b>Complications:</b>{" "}
                  {value(
                    patient.ComplicationsDuringBirth
                  )}
                </div>

              </div>

            </div>

          </div>

          {/* =========================
              BOOK APPOINTMENT BUTTON
          ========================= */}

          <div className="form-row mt-3">

            <div className="col-md-3">

              <button
                type="button"
                className="btn btn-info"
                onClick={
                  bookAppointment
                }
                disabled={booking}
              >
                {booking
                  ? "BOOKING..."
                  : "BOOK APPOINTMENT"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

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
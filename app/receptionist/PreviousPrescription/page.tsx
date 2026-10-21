"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Patient = {
  ID?: number | string;
  Title?: string;
  FirstName?: string;
  LastName?: string;
};

type ApiResponse = {
  IsSuccess?: boolean;
  Message?: string;
  Data?: {
    Table?: Patient[];
    Table1?: {
      TotalRecords?: number;
    }[];
  };
};

export default function PreviousPatientsPage() {
  // =========================================
  // STATES
  // =========================================

  const [patients, setPatients] = useState<Patient[]>([]);

  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [pageNumber, setPageNumber] = useState(1);

  const [pageSize] = useState(10);

  const [totalRecords, setTotalRecords] = useState(0);

  const [bookingPatientId, setBookingPatientId] = useState<
    number | string | null
  >(null);

  // =========================================
  // LOAD PATIENTS
  // GetLatestPatient API
  // =========================================

  const loadPreviousPatients = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set(
        "PageNumber",
        String(pageNumber)
      );

      params.set(
        "PageSize",
        String(pageSize)
      );

      params.set(
        "SearchText",
        searchText.trim()
      );

      const response =
        await apiFetch<ApiResponse>(
          `UserLogin/GetLatestPatient?${params.toString()}`
        );

      console.log(
        "GetLatestPatient Response:",
        response
      );

      if (!response?.IsSuccess) {
        setPatients([]);
        setTotalRecords(0);

        return;
      }

      // =========================================
      // PATIENT LIST
      // =========================================

      const patientList =
        Array.isArray(response.Data?.Table)
          ? response.Data.Table
          : [];

      // =========================================
      // TOTAL RECORDS
      // =========================================

      const total =
        Number(
          response.Data?.Table1?.[0]
            ?.TotalRecords
        ) || 0;

      setPatients(patientList);

      setTotalRecords(total);

    } catch (error) {
      console.error(
        "GetLatestPatient error:",
        error
      );

      setPatients([]);

      setTotalRecords(0);

    } finally {
      setLoading(false);
    }
  }, [
    pageNumber,
    pageSize,
    searchText,
  ]);

  // =========================================
  // LOAD ON PAGE LOAD / PAGE CHANGE
  // =========================================

  useEffect(() => {
    loadPreviousPatients();
  }, [loadPreviousPatients]);

  // =========================================
  // SEARCH
  // =========================================

  function handleSearch(
    value: string
  ) {
    setSearchText(value);
    setPageNumber(1);
  }

  // =========================================
  // BOOK APPOINTMENT
  // =========================================

  async function bookAppointment(
    patient: Patient
  ) {
    const patientId = patient.ID;

    if (
      patientId === undefined ||
      patientId === null
    ) {
      alert(
        "Patient ID not found."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Book appointment for ${patient.Title || ""} ${
          patient.FirstName || ""
        } ${patient.LastName || ""}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setBookingPatientId(
        patientId
      );

      const requestBody = {
        Patientid: Number(
          patientId
        ),

        IsFollowUp: true,
      };

      console.log(
        "Book Appointment Request:",
        requestBody
      );

      const response =
        await apiFetch<ApiResponse>(
          "UserLogin/Bookappointment",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              requestBody
            ),
          }
        );

      console.log(
        "Book Appointment Response:",
        response
      );

      if (response?.IsSuccess) {
        alert(
          "Appointment booked successfully."
        );

        // Reload patient list
        await loadPreviousPatients();

      } else {
        alert(
          response?.Message ||
            "Unable to book appointment."
        );
      }

    } catch (error) {
      console.error(
        "Book appointment error:",
        error
      );

      alert(
        "Error while booking appointment."
      );

    } finally {
      setBookingPatientId(
        null
      );
    }
  }

  // =========================================
  // PAGINATION
  // =========================================

  const totalPages =
    Math.ceil(
      totalRecords / pageSize
    );

  function goToPreviousPage() {
    if (pageNumber > 1) {
      setPageNumber(
        pageNumber - 1
      );
    }
  }

  function goToNextPage() {
    if (
      pageNumber < totalPages
    ) {
      setPageNumber(
        pageNumber + 1
      );
    }
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div className="container-fluid">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="row">

        <div className="col-md-12">

          <div className="ibox">

            <div className="ibox-head">

              <div className="ibox-title">
                👥 Previous Patients
              </div>

            </div>

            {/* =====================================
                BODY
            ===================================== */}

            <div className="ibox-body">

              {/* =====================================
                  SEARCH
              ===================================== */}

              <div className="row mb-3">

                <div className="col-md-6">

                  <label>
                    🔍 Search Patient
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by patient name..."
                    value={
                      searchText
                    }
                    onChange={(e) =>
                      handleSearch(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="col-md-6 d-flex align-items-end">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchText(
                        ""
                      );

                      setPageNumber(
                        1
                      );
                    }}
                  >
                    🔄 Reset
                  </button>

                </div>

              </div>

              {/* =====================================
                  TOTAL
              ===================================== */}

              <div className="mb-3">

                <strong>
                  Total Patients:
                </strong>{" "}

                {totalRecords}

              </div>

              {/* =====================================
                  TABLE
              ===================================== */}

              <div className="table-responsive">

                {loading ? (

                  <div
                    className="text-center p-4"
                  >
                    <span>
                      Loading patients...
                    </span>
                  </div>

                ) : patients.length === 0 ? (

                  <div
                    className="text-center p-4"
                  >
                    No patients found.
                  </div>

                ) : (

                  <table className="table table-bordered table-hover">

                    <thead>

                      <tr>

                        <th
                          style={{
                            width: "70px",
                          }}
                        >
                          #
                        </th>

                        <th>
                          Patient ID
                        </th>

                        <th>
                          Patient Name
                        </th>

                        <th
                          style={{
                            width: "220px",
                          }}
                        >
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {patients.map(
                        (
                          patient,
                          index
                        ) => {

                          const patientId =
                            patient.ID;

                          const patientName =
                            `${patient.Title || ""} ${
                              patient.FirstName || ""
                            } ${
                              patient.LastName || ""
                            }`.trim();

                          return (

                            <tr
                              key={`${patientId}-${index}`}
                            >

                              {/* NUMBER */}

                              <td>
                                {
                                  (pageNumber -
                                    1) *
                                    pageSize +
                                    index +
                                    1
                                }
                              </td>

                              {/* PATIENT ID */}

                              <td>
                                {patientId ||
                                  "-"}
                              </td>

                              {/* PATIENT NAME */}

                              <td>

                                <strong>
                                  {
                                    patientName ||
                                      "-"
                                  }
                                </strong>

                              </td>

                              {/* ACTION */}

                              <td>

                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() =>
                                    bookAppointment(
                                      patient
                                    )
                                  }
                                  disabled={
                                    bookingPatientId ===
                                    patientId
                                  }
                                >

                                  {bookingPatientId ===
                                  patientId
                                    ? "Booking..."
                                    : "📅 Book Appointment"}

                                </button>

                              </td>

                            </tr>

                          );
                        }
                      )}

                    </tbody>

                  </table>

                )}

              </div>

              {/* =====================================
                  PAGINATION
              ===================================== */}

              {totalPages > 0 && (

                <div
                  className="d-flex justify-content-between align-items-center mt-3"
                >

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    disabled={
                      pageNumber <= 1 ||
                      loading
                    }
                    onClick={
                      goToPreviousPage
                    }
                  >
                    ← Previous
                  </button>

                  {/* PAGE INFO */}

                  <div>

                    Page{" "}

                    <strong>
                      {pageNumber}
                    </strong>{" "}

                    of{" "}

                    <strong>
                      {totalPages}
                    </strong>

                  </div>

                  {/* NEXT */}

                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    disabled={
                      pageNumber >=
                        totalPages ||
                      loading
                    }
                    onClick={
                      goToNextPage
                    }
                  >
                    Next →
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
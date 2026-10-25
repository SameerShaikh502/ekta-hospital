"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Patient = {
  ID?: number | string;
  Title?: string;
  FirstName?: string;
  LastName?: string;
  MobileNo?: string;
  MobileNumber?: string;
  Mobile?: string;
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

type Props = {
  onClose: () => void;
};

export default function PreviousPatientsModal({ onClose }: Props) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [totalRecords, setTotalRecords] = useState(0);
  const [bookingPatientId, setBookingPatientId] =
    useState<number | string | null>(null);

  const loadPreviousPatients = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("PageNumber", String(pageNumber));
      params.set("PageSize", String(pageSize));
      params.set("SearchText", searchText.trim());

      const response = await apiFetch<ApiResponse>(
        `UserLogin/GetLatestPatient?${params.toString()}`
      );

      if (!response?.IsSuccess) {
        setPatients([]);
        setTotalRecords(0);
        return;
      }

      setPatients(
        Array.isArray(response.Data?.Table)
          ? response.Data.Table
          : []
      );

      setTotalRecords(
        Number(response.Data?.Table1?.[0]?.TotalRecords) || 0
      );
    } catch (error) {
      console.error("GetLatestPatient error:", error);
      setPatients([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, searchText]);

  useEffect(() => {
    loadPreviousPatients();
  }, [loadPreviousPatients]);

  async function bookAppointment(patient: Patient) {
    const patientId = patient.ID;

    if (patientId === undefined || patientId === null) {
      alert("Patient ID not found.");
      return;
    }

    const patientName =
      `${patient.Title || ""} ${patient.FirstName || ""} ${patient.LastName || ""}`.trim();

    if (!window.confirm(`Book appointment for ${patientName}?`)) {
      return;
    }

    try {
      setBookingPatientId(patientId);

      const response = await apiFetch<ApiResponse>(
        "UserLogin/Bookappointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Patientid: Number(patientId),
            IsFollowUp: true,
          }),
        }
      );

      if (response?.IsSuccess) {
        alert("Appointment booked successfully.");
        await loadPreviousPatients();
      } else {
        alert(response?.Message || "Unable to book appointment.");
      }
    } catch (error) {
      console.error("Book appointment error:", error);
      alert("Error while booking appointment.");
    } finally {
      setBookingPatientId(null);
    }
  }

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="previous-patients-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2
            id="previous-patients-title"
            className="text-lg font-semibold text-gray-800"
          >
            👥 Previous Patients
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1 text-3xl leading-none text-gray-500 hover:bg-gray-100 hover:text-black"
            aria-label="Close popup"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-5">
          {/* Search */}
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <label
  htmlFor="previousPatientSearch"
  className="mb-1 block text-sm font-medium text-gray-700"
>
  🔍 Search Patient
</label>

<input
  id="previousPatientSearch"
  type="text"
  className="form-control w-full"
  placeholder="Search by Name or Mobile Number..."
  value={searchText}
  onChange={(e) => {
    setSearchText(e.target.value);
    setPageNumber(1);
  }}
/>
            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchText("");
                setPageNumber(1);
              }}
            >
              🔄 Reset
            </button>
          </div>

          <div className="mb-3 text-sm text-gray-700">
            <strong>Total Patients:</strong> {totalRecords}
          </div>

          {/* Patient Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-600">
                Loading patients...
              </div>
            ) : patients.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No patients found.
              </div>
            ) : (
              <table className="table table-bordered table-hover mb-0 w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {patients.map((patient, index) => {
                    const patientId = patient.ID;
                    const patientName =
                      `${patient.Title || ""} ${patient.FirstName || ""} ${patient.LastName || ""}`.trim();

                    return (
                      <tr key={`${patientId}-${index}`}>
                        <td>
                          {(pageNumber - 1) * pageSize + index + 1}
                        </td>

                        <td>{patientId ?? "-"}</td>

                        <td>
                          <strong>{patientName || "-"}</strong>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm whitespace-nowrap"
                            onClick={() => bookAppointment(patient)}
                            disabled={bookingPatientId === patientId}
                          >
                            {bookingPatientId === patientId
                              ? "Booking..."
                              : "📅 Book Appointment"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {/* Pagination */}
          {totalPages > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                alignItems: "center",
                justifyContent: "center",
                width: "50%",
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid #dee2e6",
                gap: "8px",
              }}
            >
              {/* Previous - Left */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  style={{ whiteSpace: "nowrap" }}
                  disabled={pageNumber <= 1 || loading}
                  onClick={() => setPageNumber((p) => p - 1)}
                >
                  ← Previous
                </button>
              </div>

              {/* Page Info - Center */}
              <div
                style={{
                  textAlign: "center",
                  color: "#333",
                  fontSize: "14px",
                  minWidth: 0,
                }}
              >
                <div>
                  Page <strong>{pageNumber}</strong> of{" "}
                  <strong>{totalPages}</strong>
                </div>

                <div style={{ marginTop: "5px", color: "#666" }}>
                  Total Records: {totalRecords}
                </div>
              </div>

              {/* Next - Right */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  style={{ whiteSpace: "nowrap" }}
                  disabled={pageNumber >= totalPages || loading}
                  onClick={() => setPageNumber((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

        </div>
        {/* Scrollable Content Ends Here */}

        {/* Fixed Footer */}
        <div className="flex shrink-0 justify-end border-t bg-white px-5 py-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
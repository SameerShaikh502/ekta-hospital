"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type AppointmentReadyPatient = {
  Id: number;
  ID?: number;
  Title?: string;
  FirstName?: string;
  LastName?: string;
  CreatedDate?: string;
};

type AppointmentReadyResponse = {
  IsSuccess?: boolean;
  Message?: string;
  Data?: {
    Table?: AppointmentReadyPatient[];
    Table1?: {
      TotalRecords?: number;
    }[];
  };
};

export default function CreateAppointmentPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<AppointmentReadyPatient[]>([]);
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadAppointmentReadyPatients(
    page = pageNumber,
    search = searchText
  ) {
    try {
      setLoading(true);

      const query = new URLSearchParams();
      query.append("PageNumber", String(page));
      query.append("PageSize", String(pageSize));

      if (search.trim()) {
        query.append("SearchText", search.trim());
      }

      const response = await apiFetch<AppointmentReadyResponse>(
        `UserLogin/GetAppointmentReadyPatients?${query.toString()}`
      );

      if (response?.IsSuccess) {
        const table = response.Data?.Table || [];
        const total = response.Data?.Table1?.[0]?.TotalRecords || 0;

        setPatients(table);
        setTotalRecords(total);
      } else {
        setPatients([]);
        setTotalRecords(0);
        alert(response?.Message || "Failed to load patients.");
      }
    } catch (error) {
      console.error("GetAppointmentReadyPatients error:", error);
      setPatients([]);
      setTotalRecords(0);
      alert("Error loading appointment-ready patients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointmentReadyPatients(1, "");

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(value: string) {
    setSearchText(value);

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      setPageNumber(1);
      loadAppointmentReadyPatients(1, value);
    }, 500);
  }

  function goToBookAppointment(patientId: number) {
    if (!patientId) {
      alert("Patient ID not found.");
      return;
    }

    router.push(`/userlogin/BookAppointment?id=${patientId}`);
  }

  const totalPages = Math.ceil(totalRecords / pageSize);

  function changePage(page: number) {
    if (page < 1 || page > totalPages) {
      return;
    }

    setPageNumber(page);
    loadAppointmentReadyPatients(page, searchText);
  }

  function getPageNumbers() {
    const pages: number[] = [];
    const startPage = Math.max(1, pageNumber - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  return (
    <main className="page-content">
      <div className="ibox">
        <div className="ibox-head">
          <div className="ibox-title">Create Appointment</div>
        </div>

        <div className="ibox-body">
          {/* SEARCH */}
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search patient..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* TABLE / RESPONSIVE WRAPPER */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover patient-mobile-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th style={{ width: "220px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center" style={{ padding: "35px" }}>
                      Loading patients...
                    </td>
                  </tr>
                ) : patients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center" style={{ padding: "35px" }}>
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  patients.map((patient, index) => {
                    const patientId = patient.Id ?? patient.ID ?? 0;

                    return (
                      <tr key={`${patientId}-${index}`}>
                        <td data-label="Title">{patient.Title || "-"}</td>
                        <td data-label="First Name">{patient.FirstName || "-"}</td>
                        <td data-label="Last Name">{patient.LastName || "-"}</td>
                        <td data-label="Action">
                          <div className="patient-action-btns">
                            <button
                              type="note"
                              className="btn btn-sm btn-success delete-btn"
                              onClick={() => goToBookAppointment(patientId)}
                            >
                              View & Book Appointment
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div
              className="d-flex justify-content-center mt-3"
              style={{
                gap: "5px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                disabled={pageNumber === 1}
                onClick={() => changePage(pageNumber - 1)}
              >
                Prev
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  type="button"
                  className={
                    page === pageNumber
                      ? "btn btn-sm btn-primary"
                      : "btn btn-sm btn-light"
                  }
                  onClick={() => changePage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="btn btn-sm btn-secondary"
                disabled={pageNumber === totalPages}
                onClick={() => changePage(pageNumber + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
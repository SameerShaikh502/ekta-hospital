"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Patient = {
  ID: number;
  Id?: number;
  Title?: string;
  FirstName?: string;
  LastName?: string;
};

type PaginationResponse = {
  IsSuccess?: boolean;
  Message?: string;
  Data?: {
    Table?: Patient[];
    Table1?: {
      TotalRecords?: number;
    }[];
  };
};

export default function ViewUpdatePage() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchText, setSearchText] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadPatients(page = pageNumber, search = searchText) {
    try {
      setLoading(true);

      const query = new URLSearchParams();
      query.append("PageNumber", String(page));
      query.append("PageSize", String(pageSize));

      if (search.trim()) {
        query.append("SearchText", search.trim());
      }

      const response = await apiFetch<PaginationResponse>(
        `UserLogin/GetLatestPatient?${query.toString()}`
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
      console.error("GetLatestPatient error:", error);
      setPatients([]);
      setTotalRecords(0);
      alert("Error loading patients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients(1, "");

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
      loadPatients(1, value);
    }, 500);
  }

  async function deletePatient(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await apiFetch<any>("UserLogin/DeletePatientById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID: id,
        }),
      });

      if (response?.Result === "Success" || response?.IsSuccess === true) {
        alert("Patient deleted successfully");
        await loadPatients(pageNumber, searchText);
      } else {
        alert(response?.Message || "Failed to delete patient.");
      }
    } catch (error) {
      console.error("Delete patient error:", error);
      alert("Something went wrong while deleting patient.");
    } finally {
      setDeletingId(null);
    }
  }

  function openPatient(patientId: number) {
    if (!patientId) {
      alert("Patient ID not found.");
      return;
    }

    router.push(`/userlogin/ViewUpdate?id=${patientId}`);
  }

  const totalPages = Math.ceil(totalRecords / pageSize);

  function changePage(page: number) {
    if (page < 1 || page > totalPages) {
      return;
    }

    setPageNumber(page);
    loadPatients(page, searchText);
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
          <div className="ibox-title">View Patient</div>
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
                {loading && (
                  <tr>
                    <td colSpan={4} className="text-center" style={{ padding: "35px" }}>
                      Loading patients...
                    </td>
                  </tr>
                )}

                {!loading && patients.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center" style={{ padding: "35px" }}>
                      No Records Found
                    </td>
                  </tr>
                )}

                {!loading &&
                  patients.length > 0 &&
                  patients.map((patient, index) => {
                    const patientId = patient.ID ?? patient.Id ?? 0;

                    return (
                      <tr key={`${patientId}-${index}`}>
                        <td data-label="Title">{patient.Title || "-"}</td>
                        <td data-label="First Name">{patient.FirstName || "-"}</td>
                        <td data-label="Last Name">{patient.LastName || "-"}</td>
                        <td data-label="Action">
                          <div className="patient-action-btns">
                            {/* Uncomment if View/Update button is needed */}
                            {/* <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => openPatient(patientId)}
                            >
                              View / Update
                            </button> */}

                            <button
                              type="button"
                              className="btn btn-sm btn-danger delete-btn"
                              disabled={deletingId === patientId}
                              onClick={() => deletePatient(patientId)}
                            >
                              {deletingId === patientId ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
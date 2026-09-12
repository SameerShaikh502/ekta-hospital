"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Appointment = {
  PatientId: number;
  AppointmentId: number;
  Title: string;
  FirstName: string;
  LastName: string;
};

type AppointmentResponse = {
  IsSuccess?: boolean;
  Message?: string;
  Data?: {
    Table?: Appointment[];
    Table1?: {
      TotalRecords?: number;
    }[];
  };
};

export default function ViewAppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(sessionStorage.getItem("UserRole") || "");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAppointments();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, pageNumber]);

  async function loadAppointments() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("PageNumber", String(pageNumber));
      params.set("PageSize", String(pageSize));

      if (search.trim()) {
        params.set("SearchText", search.trim());
      }

      const response = await apiFetch<AppointmentResponse>(
        `UserLogin/Getappointment?${params.toString()}`
      );

      if (response.IsSuccess) {
        setAppointments(response.Data?.Table || []);
        setTotalRecords(
          response.Data?.Table1?.[0]?.TotalRecords || 0
        );
      } else {
        setAppointments([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalRecords / pageSize);

  function changePage(page: number) {
    if (page < 1 || page > totalPages) return;
    setPageNumber(page);
  }

  function goToView(patientId: number, appointmentId: number) {
    window.location.href = `/userlogin/ViewPrint?id=${patientId}&appointmentId=${appointmentId}`;
  }

  return (
    <main className="appointment-page">
      <div className="appointment-box">

        {/* Search */}
        <div className="appointment-search">
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageNumber(1);
            }}
          />
        </div>

        {/* Responsive Table / Mobile Card Wrapper */}
        <div className="appointment-table-wrapper">
          {loading ? (
            <div className="table-message">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="table-message">No Records Found</div>
          ) : (
            <table className="appointment-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((item) => (
                  <tr key={item.AppointmentId}>
                    <td data-label="Title">{item.Title}</td>
                    <td data-label="First Name">{item.FirstName}</td>
                    <td data-label="Last Name">{item.LastName}</td>
                    <td data-label="Action">
                      <div className="appointment-actions">
                        <button
                          className="btn-proceed"
                          onClick={() =>
                            goToView(item.PatientId, item.AppointmentId)
                          }
                        >
                          Proceed appointment
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="appointment-pagination">
            <button
              disabled={pageNumber === 1}
              onClick={() => changePage(pageNumber - 1)}
            >
              Prev
            </button>

            {Array.from(
              {
                length: Math.min(5, totalPages),
              },
              (_, index) => {
                let startPage = Math.max(
                  1,
                  Math.min(pageNumber - 2, totalPages - 4)
                );
                const page = startPage + index;

                return (
                  <button
                    key={page}
                    className={page === pageNumber ? "active" : ""}
                    onClick={() => changePage(page)}
                  >
                    {page}
                  </button>
                );
              }
            )}

            <button
              disabled={pageNumber === totalPages}
              onClick={() => changePage(pageNumber + 1)}
            >
              Next
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
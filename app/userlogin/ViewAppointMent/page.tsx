"use client";

import { useEffect, useState, useRef } from "react";
import { apiFetch } from "@/lib/api";

type Appointment = {
  PatientId: number;
  AppointmentId: number;
  Title: string;
  FirstName: string;
  LastName: string;
  IsFollowUp: boolean;
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

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement | null;

    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing || document.createElement("script");

    script.src = src;

    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`Failed to load ${src}`));
    };

    if (!existing) {
      document.body.appendChild(script);
    }
  });
}

export default function ViewAppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const loadAppointmentsRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    setRole(sessionStorage.getItem("UserRole") || "");
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAppointments();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, pageNumber]);

//   useEffect(() => {
//     let connection: any;
//     let stopped = false;

//     async function connectSignalR() {
//       try {
//         // Load jQuery first, then the ASP.NET SignalR 2 client
//         await loadScript("/jquery/jquery.min.js");

//         if (stopped) return;

//         await loadScript("/signalr/jquery.signalR-2.4.3.min.js");

//         if (stopped) return;

//         const $ = (window as any).jQuery;
//         console.log("jQuery version:", $.fn?.jquery);
// console.log("SignalR version:", $.signalR?.version);
// console.log("hubConnection:", typeof $.hubConnection);
// console.log("jQuery isFunction:", typeof $.isFunction);

//         if (!$ || !$.hubConnection) {
//           console.error("SignalR client failed to load.");
//           return;
//         }

//         connection = $.hubConnection(
//           "http://103.168.23.232:8080"
//         );

//         const hub = connection.createHubProxy("appointmentHub");

      


// hub.on("appointmentBooked", () => {
//   console.log("SignalR event received: appointmentBooked");
//   console.log("Document visibility:", document.visibilityState);

//   if (!stopped) {
//     console.log("Reloading appointments...");
//     void loadAppointmentsRef.current();
//   }
// });




//         await new Promise<void>((resolve, reject) => {
//           connection.start()
//             .done(() => resolve())
//             .fail((error: unknown) => reject(error));
//         });

//         console.log("SignalR connected.");
//       } catch (error) {
//         console.error("SignalR connection failed:", error);
//       }
//     }

//     connectSignalR();

//     return () => {
//       stopped = true;
//       if (connection) {
//         connection.stop();
//       }
//     };
//   }, []);

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
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }

   useEffect(() => {
    loadAppointmentsRef.current = loadAppointments;
  });

  const totalPages = Math.ceil(totalRecords / pageSize);

  function changePage(page: number) {
    if (page < 1 || page > totalPages) return;

    setPageNumber(page);
  }

  function goToView(
    patientId: number,
    appointmentId: number
  ) {
    window.location.href =
      `/userlogin/ViewPrint?id=${patientId}&appointmentId=${appointmentId}`;
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

        {/* Table */}
        <div className="appointment-table-wrapper">

          {loading ? (
            <div className="table-message">
              Loading...
            </div>
          ) : appointments.length === 0 ? (
            <div className="table-message">
              No Records Found
            </div>
          ) : (
            <table className="appointment-table">

              <thead>
                <tr>
                  <th>Title</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  {/* <th>Type</th> */}
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((item) => (
                  <tr key={item.AppointmentId}>

                    <td data-label="Title">
                      {item.Title}
                    </td>

                    <td data-label="First Name">
                      <div className="patient-name-cell">
                        <span>{item.FirstName}</span>

                        {item.IsFollowUp && (
                          <span className="follow-up-badge">
                            FOLLOW-UP
                          </span>
                        )}
                      </div>
                    </td>

                    <td data-label="Last Name">
                      {item.LastName}
                    </td>

                    {/* Follow-up Badge */}
                    {/* <td data-label="Type">
                      {item.IsFollowUp ? (
                        <span className="follow-up-badge">
                          FOLLOW-UP
                        </span>
                      ) : (
                        <span className="new-patient-badge">
                          NEW
                        </span>
                      )}
                    </td> */}

                    <td data-label="Action">
                      <div className="appointment-actions">

                        <button
                          className="btn-proceed"
                          onClick={() =>
                            goToView(
                              item.PatientId,
                              item.AppointmentId
                            )
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
              onClick={() =>
                changePage(pageNumber - 1)
              }
            >
              Prev
            </button>

            {Array.from(
              {
                length: Math.min(5, totalPages),
              },
              (_, index) => {

                const startPage = Math.max(
                  1,
                  Math.min(
                    pageNumber - 2,
                    totalPages - 4
                  )
                );

                const page = startPage + index;

                return (
                  <button
                    key={page}
                    className={
                      page === pageNumber
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      changePage(page)
                    }
                  >
                    {page}
                  </button>
                );
              }
            )}

            <button
              disabled={pageNumber === totalPages}
              onClick={() =>
                changePage(pageNumber + 1)
              }
            >
              Next
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type SummaryResponse = {
  IsSuccess?: boolean;
  Data?: Array<{
    Completed_Today?: number;
    Pending_Today?: number;
    ReadyForBilling_Today?: number;
    TotalAppointments_CurrentMonth?: number;
  }>;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    completed: 0,
    pending: 0,
    ready: 0,
    total: 0,
  });

  useEffect(() => {
    apiFetch<SummaryResponse>("UserLogin/GetAppointmentDashboardSummary")
      .then((response) => {
        const data = response.Data?.[0];

        if (response.IsSuccess && data) {
          setSummary({
            completed: data.Completed_Today ?? 0,
            pending: data.Pending_Today ?? 0,
            ready: data.ReadyForBilling_Today ?? 0,
            total: data.TotalAppointments_CurrentMonth ?? 0,
          });
        }
      })
      .catch((error) =>
        console.error("Error loading dashboard summary:", error)
      );
  }, []);

  return (
    <main className="dashboard-page">
      <div className="dashboard-cards">

        {/* Completed */}
        <div className="dashboard-card completed-card">
          <div className="card-content">
            <h2>{summary.completed}</h2>
            <p>Completed Today</p>
          </div>

          <div className="card-icon">
            <i className="fa fa-check-circle" />
          </div>
        </div>

        {/* Pending */}
        <div className="dashboard-card pending-card">
          <div className="card-content">
            <h2>{summary.pending}</h2>
            <p>Pending Today</p>
          </div>

          <div className="card-icon">
            <i className="fa fa-hourglass-half" />
          </div>
        </div>

        {/* Ready For Billing */}
        <div className="dashboard-card billing-card">
          <div className="card-content">
            <h2>{summary.ready}</h2>
            <p>Ready For Billing</p>
          </div>

          <div className="card-icon">
            <i className="fa fa-file-invoice" />
          </div>
        </div>

        {/* Total Appointments */}
        <div className="dashboard-card appointments-card">
          <div className="card-content">
            <h2>{summary.total}</h2>
            <p>Total Appointments (This Month)</p>
          </div>

          <div className="card-icon">
            <i className="fa fa-calendar-check" />
          </div>
        </div>

      </div>
    </main>
  );
}
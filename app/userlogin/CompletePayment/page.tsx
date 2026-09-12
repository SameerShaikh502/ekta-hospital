"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type PaymentItem = {
  AppointmentId?: number;
  Title?: string;
  FirstName?: string;
  LastName?: string;
  ChargableAMT?: number | string;
};

type PaymentResponse = {
  IsSuccess?: boolean;
  Message?: string;
  Data?: {
    Table?: PaymentItem[];
    Table1?: {
      TotalRecords?: number;
    }[];
  };
};

export default function CompletePaymentPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const pageSize = 10;

  const [paymentModes, setPaymentModes] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  async function loadCompletePayment() {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("PageNumber", String(pageNumber));
      params.append("PageSize", String(pageSize));
      params.append("SearchText", searchText.trim());

      const url = `UserLogin/GetCompletePayment?${params.toString()}`;
      const response = await apiFetch<PaymentResponse>(url);

      if (response?.IsSuccess) {
        const tableData = response.Data?.Table || [];
        setPayments(tableData);
        setTotalRecords(
          response.Data?.Table1?.[0]?.TotalRecords || 0
        );
      } else {
        setPayments([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("GetCompletePayment Error:", error);
      setPayments([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCompletePayment();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText, pageNumber]);

  function selectPaymentMode(appointmentId: number, mode: string) {
    setPaymentModes((prev) => ({
      ...prev,
      [appointmentId]: mode,
    }));
  }

  async function updatePaymentMode(item: PaymentItem) {
    if (!item.AppointmentId) {
      alert("Appointment ID not found.");
      return;
    }

    const paymentMode = paymentModes[item.AppointmentId];

    if (!paymentMode) {
      alert("Please select payment mode.");
      return;
    }

    const data = {
      AppointmentId: item.AppointmentId,
      PaymentMethod: paymentMode,
    };

    try {
      setSavingId(item.AppointmentId);

      const response = await apiFetch<any>("UserLogin/UpdatePaymentbyapmtid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response?.IsSuccess) {
        alert("Payment updated successfully.");

        const printUrl = `/api/backend/UserLogin/PrintSlipPdf?appointmentId=${encodeURIComponent(
          item.AppointmentId
        )}`;

        window.open(printUrl, "_blank");
        await loadCompletePayment();
      } else {
        alert(response?.Message || "Failed to update payment.");
      }
    } catch (error) {
      console.error("Update Payment Error:", error);
      alert("Failed to update payment.");
    } finally {
      setSavingId(null);
    }
  }

  const totalPages = Math.ceil(totalRecords / pageSize);

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) {
      return;
    }
    setPageNumber(page);
  }

  return (
    <main className="page-content">
      <div className="ibox">
        <div className="ibox-head">
          <div className="ibox-title">Complete Payment</div>
        </div>

        <div className="ibox-body">
          {/* SEARCH */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label>Search</label>
                <input
                  type="text"
                  id="txtSearch"
                  className="form-control"
                  placeholder="Search patient..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setPageNumber(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* TABLE / RESPONSIVE WRAPPER */}
          <div className="table-responsive">
            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : payments.length === 0 ? (
              <div className="text-center p-4">No Records Found</div>
            ) : (
              <table className="table table-bordered payment-mobile-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>ChargableAMT</th>
                    <th>Payment Method</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((item, index) => {
                    const appointmentId = item.AppointmentId;
                    const selectedMode = appointmentId
                      ? paymentModes[appointmentId]
                      : "";

                    return (
                      <tr key={appointmentId ?? index}>
                        <td data-label="Title">{item.Title || ""}</td>
                        <td data-label="First Name">{item.FirstName || ""}</td>
                        <td data-label="Last Name">{item.LastName || ""}</td>
                        <td data-label="ChargableAMT">
                          {item.ChargableAMT ?? "null"}
                        </td>
                        <td data-label="Payment Method">
                          <div className="payment-method-options">
                            <label className="payment-checkbox-label">
                              <input
                                type="checkbox"
                                checked={selectedMode === "UPI"}
                                onChange={() => {
                                  if (appointmentId) {
                                    selectPaymentMode(appointmentId, "UPI");
                                  }
                                }}
                              />
                              <span>UPI</span>
                            </label>

                            <label className="payment-checkbox-label">
                              <input
                                type="checkbox"
                                checked={selectedMode === "CASH"}
                                onChange={() => {
                                  if (appointmentId) {
                                    selectPaymentMode(appointmentId, "CASH");
                                  }
                                }}
                              />
                              <span>Cash</span>
                            </label>
                          </div>
                        </td>
                        <td data-label="Action">
                          <button
                            type="button"
                            className="btn btn-xs btn-danger update-print-btn"
                            disabled={savingId === appointmentId}
                            onClick={() => updatePaymentMode(item)}
                          >
                            {savingId === appointmentId
                              ? "Updating..."
                              : "Update Payment & Print"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div
              className="d-flex justify-content-center mt-3 flex-wrap"
              style={{ gap: "5px" }}
            >
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={pageNumber === 1}
                onClick={() => goToPage(pageNumber - 1)}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return (
                  <button
                    type="button"
                    key={page}
                    className={
                      page === pageNumber
                        ? "btn btn-primary btn-sm"
                        : "btn btn-light btn-sm"
                    }
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={pageNumber === totalPages}
                onClick={() => goToPage(pageNumber + 1)}
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
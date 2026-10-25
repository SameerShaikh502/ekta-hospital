"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import jsPDF from "jspdf";

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

type SlipDetail = {
  ID?: number;
  Title?: string;
  FirstName?: string;
  LastName?: string;
  MobileNo?: string;
  AgeYears?: string;
  AgeMonths?: string;
  AgeDays?: string;
  Gender?: string;
  HeightCm?: string;
  Weight?: string | number | null;
  BMI_Value?: string | number | null;
  BpSystolic?: string | number | null;
  BpDiastolic?: string | number | null;
  Temperature?: string | number | null;
  SpO2?: string | number | null;
  PulseRate?: string | number | null;
  Past_history?: string | null;
  Observations?: string | null;
  Diagnosis?: string | null;
  Personal_Notes?: string | null;
  Typical_Chest_Pain_Since?: string | null;
  Angina_on_Exertion_Since?: string | null;
  Breathlessness_Exertion_Since?: string | null;
  Breathlessness_Not_on_Exertion_Since?: string | null;
  Other_Chief_Complaints?: string | null;
  Normal_Sinus_ECG?: string | null;
  Other_Ecg_Findings?: string | null;
  Normal_NO_RWMA_2D_Echo?: string | null;
  Grade_1_2D_Echo?: string | null;
  other_2D_Echo?: string | null;
  TMT_Blood?: string | null;
  CAG_Blood?: string | null;
  [key: string]: unknown;
};

type SlipMedicine = {
  PrescriptionId?: number;
  Appointmentid?: string | number;
  AppointmentId?: string | number;
  AppointmentDate?: string;
  Medicine?: string;
  Dose?: string;
  Frequency?: string;
  Instruction?: string;
  DurationDays?: string | number;
  Chargable_amt?: string | number | null;
  unit?: string;
  CreatedOn?: string;
};

type SlipResponse = {
  IsSuccess?: boolean;
  Message?: string;
  Data?: {
    Table?: SlipDetail[];
    Table1?: SlipMedicine[];
    Table2?: SlipMedicine[];
  };
};

async function loadImageAsDataUrl(path: string): Promise<string> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Image could not be loaded: ${path}`);
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not convert image."));
      }
    };

    reader.onerror = () => reject(new Error("Image read failed."));
    reader.readAsDataURL(blob);
  });
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined) return "-";

  const text = String(value).trim();
  return text || "-";
}

function drawSectionTitle(
  doc: jsPDF,
  title: string,
  x: number,
  y: number,
  width: number
): number {
  doc.setFillColor(235, 235, 235);
  doc.rect(x, y, width, 7, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(title, x + 2, y + 4.8);

  return y + 10;
}

function drawField(
  doc: jsPDF,
  label: string,
  value: unknown,
  x: number,
  y: number,
  maxWidth = 85
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);

  const labelText = `${label}:`;
  doc.text(labelText, x, y);

  const labelWidth = doc.getTextWidth(labelText) + 2;

  doc.setFont("helvetica", "normal");

  const lines = doc.splitTextToSize(
    displayValue(value),
    Math.max(10, maxWidth - labelWidth)
  );

  doc.text(lines, x + labelWidth, y);

  return Math.max(5, lines.length * 4);
}
async function generatePrescriptionPdf(
  appointmentId: number
) {
  const response = await apiFetch<SlipResponse>(
    `UserLogin/GetSlipDetails?appointmentId=${encodeURIComponent(
      appointmentId
    )}`
  );

  if (!response?.IsSuccess || !response.Data) {
    throw new Error(
      response?.Message || "Could not fetch prescription details."
    );
  }

  const detail = response.Data.Table?.[0];

  if (!detail) {
    throw new Error("Patient details were not found.");
  }

  const currentMedicines = response.Data.Table1 || [];
  const previousMedicines = response.Data.Table2 || [];

  const [headerImage, footerImage] = await Promise.all([
    loadImageAsDataUrl("/SLIPIMAGES/HEADERimage.jpeg"),
    loadImageAsDataUrl("/SLIPIMAGES/Footerimage.jpeg"),
  ]);

  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 10;
  const contentWidth = pageWidth - margin * 2;

  const headerHeight = 23;
  const footerHeight = 15;
  const bottomLimit = pageHeight - footerHeight - 8;

  let y = margin;

  function addHeader() {
    doc.addImage(
      headerImage,
      "JPEG",
      margin,
      margin,
      contentWidth,
      headerHeight
    );

    doc.setDrawColor(80, 80, 80);
    doc.line(
      margin,
      margin + headerHeight + 2,
      pageWidth - margin,
      margin + headerHeight + 2
    );
  }

  function addFooter() {
    doc.addImage(
      footerImage,
      "JPEG",
      margin,
      pageHeight - footerHeight - 3,
      contentWidth,
      footerHeight
    );
  }

  function newPage() {
    addFooter();
    doc.addPage();
    addHeader();
    y = margin + headerHeight + 7;
  }

  function ensureSpace(requiredHeight = 12) {
    if (y + requiredHeight > bottomLimit) {
      newPage();
    }
  }

  function section(title: string) {
    ensureSpace(12);
    y = drawSectionTitle(doc, title, margin, y, contentWidth);
  }

  function field(
    label: string,
    value: unknown,
    x: number,
    maxWidth: number
  ) {
    ensureSpace(8);

    const used = drawField(doc, label, value, x, y, maxWidth);
    y += used;
  }

  function hasData(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  return String(value).trim() !== "";
}

  function formatLegacyDate(value?: string): string {
    if (!value) return "-";

    const match = value.match(/\/Date\((\d+)\)\//);

    if (match) {
      const date = new Date(Number(match[1]));

      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-GB");
      }
    }

    return value;
  }


function drawMedicines(
  title: string,
  medicines: SlipMedicine[],
  showAppointmentDate = false
) {
  section(title);

  if (medicines.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("No records found.", margin + 1, y);
    y += 7;
    return;
  }

  const columns = showAppointmentDate
    ? [
        { label: "Medicine", width: 48 },
        { label: "Dose", width: 27 },
        { label: "Instruction", width: 48 },
        { label: "Duration", width: 47 },
        // { label: "Date", width: 49 },
      ]
    : [
        { label: "Medicine", width: 48 },
        { label: "Dose", width: 27 },
        { label: "Instruction", width: 48 },
        { label: "Duration", width: 47 },
      ];

  function drawTableHeader() {
    let x = margin;

    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y, contentWidth, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    columns.forEach((column) => {
      doc.text(column.label, x + 1.5, y + 5.3);
      x += column.width;
    });

    y += 8;
  }

  drawTableHeader();

  medicines.forEach((medicine) => {
    const dose = [
      displayValue(medicine.Dose),
      medicine.unit || "",
    ]
      .filter(Boolean)
      .join(" ");

    const duration = medicine.DurationDays
      ? `${medicine.DurationDays} days`
      : "-";

    const values = [
      displayValue(medicine.Medicine),
      dose,
      displayValue(medicine.Instruction),
      duration,
      formatLegacyDate(medicine.AppointmentDate),
    ];

    const visibleValues = showAppointmentDate
      ? values
      : values.slice(0, 4);

    const wrapped = columns.map((column, index) =>
      doc.splitTextToSize(
        visibleValues[index],
        column.width - 3
      )
    );

    const rowHeight = Math.max(
      8,
      ...wrapped.map((lines) => lines.length * 3.5 + 3)
    );

    if (y + rowHeight > bottomLimit) {
      newPage();
      section(title);
      drawTableHeader();
    }

    let x = margin;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    columns.forEach((column, index) => {
      doc.rect(x, y, column.width, rowHeight);
      doc.text(wrapped[index], x + 1.5, y + 4);
      x += column.width;
    });

    y += rowHeight;
  });

  y += 4;
}


  addHeader();
  y = margin + headerHeight + 7;

  // Patient details
  section("PATIENT DETAILS");
  const ID=(detail.ID);

  const patientName = [
    detail.Title,
    detail.FirstName,
    detail.LastName,
  ]
    .filter(Boolean)
    .join(" ");

  const age = [
    detail.AgeYears ? `${detail.AgeYears} yrs` : "",
    detail.AgeMonths ? `${detail.AgeMonths} months` : "",
    detail.AgeDays ? `${detail.AgeDays} days` : "",
  ]
    .filter(Boolean)
    .join(" ");

  field("ID", ID, margin + 1, 90);
  field("Name", patientName, margin + 1, 90);
  field("Age / Sex", `${age || "-"} / ${displayValue(detail.Gender)}`, margin + 1, 90);
  field("Mobile", detail.MobileNo, margin + 1, 90);
  // field("Weight", detail.Weight == null ? "-" : `${detail.Weight} kg`, margin + 1, 90);
  // field("Height", detail.HeightCm == null ? "-" : `${detail.HeightCm} cm`, margin + 1, 90);
  // field("BMI", detail.BMI_Value, margin + 1, 90);
  field("Date", new Date().toLocaleDateString("en-GB"), margin + 1, 90);

  // Chief complaints and history
  section("CHIEF COMPLAINTS & HISTORY");

  // Chief complaints and history

const complaints: [string, unknown][] = [
  ["Typical Chest Pain Since", detail.Typical_Chest_Pain_Since],
  ["Angina on Exertion Since", detail.Angina_on_Exertion_Since],
  ["Breathlessness on Exertion Since", detail.Breathlessness_Exertion_Since],
  ["Breathlessness Not on Exertion Since", detail.Breathlessness_Not_on_Exertion_Since],
  ["Other Chief Complaints", detail.Other_Chief_Complaints],
  ["Past History", detail.Past_history],
];

const validComplaints = complaints.filter(
  ([, value]) => hasData(value)
);

if (validComplaints.length > 0) {
  section("CHIEF COMPLAINTS & HISTORY");

  validComplaints.forEach(([label, value]) => {
    field(label, value, margin + 1, contentWidth - 2);
  });
}

  // Vitals
// Vitals
section("VITALS");

const vitalsText =
  `Temp: ${hasData(detail.Temperature) ? detail.Temperature : ""} °C | ` +
  `Pulse: ${hasData(detail.PulseRate) ? detail.PulseRate : ""} /min | ` +
  `SPO2: ${hasData(detail.SpO2) ? detail.SpO2 : ""} % | ` +
  `BP: ${hasData(detail.BpSystolic) ? detail.BpSystolic : ""}/` +
  `${hasData(detail.BpDiastolic) ? detail.BpDiastolic : ""} mmHg`;

doc.setFont("helvetica", "normal");
doc.setFontSize(9);

const vitalsLines = doc.splitTextToSize(
  vitalsText,
  contentWidth - 2
);

vitalsLines.forEach((line: string) => {
  ensureSpace(6);
  doc.text(line, margin + 1, y);
  y += 4.5;
});

y += 2;

  // Other examination
  section("OTHER EXAMINATION");

 // Other examination

const examinations: [string, unknown][] = [
  ["Normal Sinus ECG", detail.Normal_Sinus_ECG],
  ["Other ECG Findings", detail.Other_Ecg_Findings],
  ["Normal / No RWMA 2D Echo", detail.Normal_NO_RWMA_2D_Echo],
  ["Grade 1 2D Echo", detail.Grade_1_2D_Echo],
  ["Other 2D Echo", detail.other_2D_Echo],
  ["TMT", detail.TMT_Blood],
  ["CAG", detail.CAG_Blood],
  ["CBC", detail.FI_CBC],
  ["Serum Creatinine", detail.FI_SerumCreatinine],
  ["Serum Electrolyte", detail.FI_SerumElectrolyte],
  ["TSH", detail.FI_TSH],
  ["T3", detail.FI_T3],
  ["T4", detail.FI_T4],
  ["Hb", detail.FI_Hb],
  ["HbA1c", detail.FI_HbA1c],
  ["RFT", detail.FI_RFT],
  ["LFT", detail.FI_LFT],
  ["Troponin I", detail.FI_TroponinI],
  ["Serum Lipids", detail.FI_SerumLipids],
  ["MP / Widal", detail.FI_MP_Widal],
];

const validExaminations = examinations.filter(
  ([, value]) => hasData(value)
);

if (validExaminations.length > 0) {
  section("OTHER EXAMINATION");

  validExaminations.forEach(([label, value]) => {
    field(label, value, margin + 1, contentWidth - 2);
  });
}

  // Current prescriptions
  drawMedicines("PRESCRIBED MEDICINES", currentMedicines);

  // Previous prescriptions
  drawMedicines("PREVIOUS PRESCRIPTIONS", previousMedicines, true);

  // Advice / notes
  section("ADVICE");

  const adviceLines = doc.splitTextToSize(
    displayValue(detail.Personal_Notes),
    contentWidth - 2
  );

  adviceLines.forEach((line: string) => {
    ensureSpace(6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(line, margin + 1, y);
    y += 4.5;
  });

  addFooter();

  const pdfBlob = doc.output("blob");
const pdfUrl = URL.createObjectURL(pdfBlob);

// PDF ko new browser tab mein preview karo
const previewWindow = window.open(pdfUrl, "_blank");

if (!previewWindow) {
  // Agar popup blocked ho, to PDF download kar do
  doc.save(`Prescription_${appointmentId}.pdf`);
}
}

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
  const appointmentId = item.AppointmentId;

  if (!appointmentId) {
    alert("Appointment ID not found.");
    return;
  }

  const paymentMode = paymentModes[appointmentId];

  if (!paymentMode) {
    alert("Please select payment mode.");
    return;
  }

  const data = {
    AppointmentId: appointmentId,
    PaymentMethod: paymentMode,
  };

  try {
    setSavingId(appointmentId);

    const response = await apiFetch<any>(
      "UserLogin/UpdatePaymentbyapmtid",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response?.IsSuccess) {
      alert(response?.Message || "Failed to update payment.");
      return;
    }

    // Payment update successful. Generate PDF using Next.js.
    await generatePrescriptionPdf(appointmentId);

    await loadCompletePayment();
  } catch (error) {
    console.error("Update Payment / PDF Error:", error);

    alert(
      "Payment update ya PDF generation mein problem aayi. Console check karein."
    );
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
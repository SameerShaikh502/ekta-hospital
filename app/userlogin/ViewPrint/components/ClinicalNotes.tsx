"use client";

export type ClinicalNotesData = {
  K_C_O: string;
  Past_history: string;
  Observations: string;
  Diagnosis: string;
  Personal_Notes: string;
};

type ClinicalNotesProps = {
  values: ClinicalNotesData;
  onChange: (values: ClinicalNotesData) => void;
  isOpen: boolean;
  onToggle: () => void;
};

export default function ClinicalNotes({
   values,
  onChange,
  isOpen,
  onToggle,
}: ClinicalNotesProps) {

  function updateField(
    field: keyof ClinicalNotesData,
    value: string
  ) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return (
    <div className="ibox mt-3">

      {/* HEADER */}
      <div
        className="ibox-head"
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <div className="ibox-title">
           📝 Clinical Notes
        </div>

        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {isOpen ? "▲" : "▼"}
        </div>
      </div>

      {/* BODY */}
      {isOpen && (<div className="ibox-body">

        {/* K/C/O */}
        <div className="row">

          <div className="col-md-6">

            <label>K/C/O</label>

            <div className="mt-1">

              <label>

                <input
                  type="checkbox"
                  id="chkKCO_Nil"
                  checked={values.K_C_O === "NIL"}
                  onChange={(e) =>
                    updateField(
                      "K_C_O",
                      e.target.checked ? "NIL" : ""
                    )
                  }
                />{" "}

                NIL

              </label>

            </div>

          </div>

        </div>


        {/* Past History + Observations */}
        <div className="row mt-3">

          <div className="col-md-6">

            <label>Past History</label>

            <textarea
              className="form-control"
              id="txtPastHistory"
              rows={2}
              placeholder="Enter past history"
              value={values.Past_history}
              onChange={(e) =>
                updateField(
                  "Past_history",
                  e.target.value
                )
              }
            />

          </div>


          <div className="col-md-6">

            <label>Observations</label>

            <textarea
              className="form-control"
              id="txtObservations"
              rows={2}
              placeholder="Enter observations"
              value={values.Observations}
              onChange={(e) =>
                updateField(
                  "Observations",
                  e.target.value
                )
              }
            />

          </div>

        </div>


        {/* Diagnosis + Personal Notes */}
        <div className="row mt-3">

          <div className="col-md-6">

            <label>Diagnosis</label>

            <textarea
              className="form-control"
              id="txtdiagnosis"
              rows={2}
              placeholder="Enter diagnosis"
              value={values.Diagnosis}
              onChange={(e) =>
                updateField(
                  "Diagnosis",
                  e.target.value
                )
              }
            />

          </div>


          <div className="col-md-6">

            <label>Personal Notes</label>

            <textarea
              className="form-control"
              id="txtpersonalnotes"
              rows={2}
              placeholder="Enter personal notes"
              value={values.Personal_Notes}
              onChange={(e) =>
                updateField(
                  "Personal_Notes",
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>)}

    </div>
  );
}
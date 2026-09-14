"use client";

export type VitalsData = {
  // Weight: string;
  PulseRate: string;
  // RespRate: string;
  SpO2: string;
  BpSystolic: string;
  // BpDiastolic: string;
  // Temperature: string;
  // RBS: string;
};

type VitalsProps = {
  values: VitalsData;
  onChange: (values: VitalsData) => void;
  isOpen: boolean;
  onToggle: () => void;
};

export default function Vitals({
  values,
  onChange,
  isOpen,
  onToggle,
}: VitalsProps) {
  function updateValue(
    field: keyof VitalsData,
    value: string
  ) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return (
    <div className="ibox mt-3">

      {/* =========================
          HEADER
      ========================= */}
      <div
        className="ibox-head"
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <div className="ibox-title">
          🩺 VITALS
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

      {/* =========================
          BODY
      ========================= */}
      {isOpen && (
        <div className="ibox-body">

          {/* Row 1 */}
          <div className="row">

            {/* Weight */}
            {/* <div className="col-md-6">
              <label>Weight</label>

              <input
                type="number"
                id="txtweight"
                className="form-control"
                placeholder="00"
                value={values.Weight}
                onChange={(e) =>
                  updateValue(
                    "Weight",
                    e.target.value
                  )
                }
              />

              <small className="text-muted">
                kg
              </small>
            </div> */}

            {/* Pulse Rate */}
            <div className="col-md-6">
              <label>Pulse Rate</label>

              <input
                type="number"
                id="txtpulserate"
                className="form-control"
                placeholder="00"
                value={values.PulseRate}
                onChange={(e) =>
                  updateValue(
                    "PulseRate",
                    e.target.value
                  )
                }
              />

              <small className="text-muted">
                bpm
              </small>
            </div>

          </div>

          {/* Row 2 */}
          <div className="row mt-3">

            {/* Resp Rate */}
            {/* <div className="col-md-6">
              <label>Resp. Rate</label>

              <input
                type="number"
                id="txtresprate"
                className="form-control"
                placeholder="00"
                value={values.RespRate}
                onChange={(e) =>
                  updateValue(
                    "RespRate",
                    e.target.value
                  )
                }
              />

              <small className="text-muted">
                bpm
              </small>
            </div> */}

            {/* SpO2 */}
            <div className="col-md-6">
              <label>SpO₂</label>

              <input
                type="number"
                id="txtSpO2"
                className="form-control"
                placeholder="00"
                value={values.SpO2}
                onChange={(e) =>
                  updateValue(
                    "SpO2",
                    e.target.value
                  )
                }
              />

              <small className="text-muted">
                %
              </small>
            </div>

          </div>

          {/* Row 3 */}
          <div className="row mt-3">

            {/* Blood Pressure */}
            <div className="col-md-6">

              <label>
                Blood Pressure{" "}
                <span className="text-primary">
                  Sitting
                </span>
              </label>

              <div className="d-flex">

                <input
                  type="number"
                  id="txtsys"
                  className="form-control"
                  placeholder="Sys"
                  value={values.BpSystolic}
                  onChange={(e) =>
                    updateValue(
                      "BpSystolic",
                      e.target.value
                    )
                  }
                />

                <span className="px-2 align-self-center">
                  /
                </span>

                {/* <input
                  type="number"
                  id="txtdia"
                  className="form-control"
                  placeholder="Dia"
                  value={values.BpDiastolic}
                  onChange={(e) =>
                    updateValue(
                      "BpDiastolic",
                      e.target.value
                    )
                  }
                /> */}

              </div>

              <small className="text-muted">
                mm Hg
              </small>

            </div>

            {/* Temperature */}
            {/* <div className="col-md-6">

              <label>Temperature</label>

              <input
                type="number"
                id="txttemperature"
                className="form-control"
                placeholder="00"
                value={values.Temperature}
                onChange={(e) =>
                  updateValue(
                    "Temperature",
                    e.target.value
                  )
                }
              />

              <small className="text-muted">
                °F
              </small>

            </div> */}

          </div>

          {/* Row 4 */}
          <div className="row mt-3">

            {/* RBS */}
            {/* <div className="col-md-6">

              <label>RBS</label>

              <input
                type="number"
                id="txtrbs"
                className="form-control"
                placeholder="00"
                value={values.RBS}
                onChange={(e) =>
                  updateValue(
                    "RBS",
                    e.target.value
                  )
                }
              />

              <small className="text-muted">
                mg/dL
              </small>

            </div> */}

            <div className="col-md-6">
              {/* Empty for alignment */}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
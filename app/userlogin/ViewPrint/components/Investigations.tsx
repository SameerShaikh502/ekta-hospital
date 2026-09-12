"use client";

export type InvestigationsData = {
  Normal_Sinus_ECG: string;
  Other_Ecg_Findings: string;

  Normal_NO_RWMA_2D_Echo: string;
  Grade_1_2D_Echo: string;
  other_2D_Echo: string;

  TMT_Blood: string;
  CAG_Blood: string;

  CBC_Blood: string;
  MT_Blood: string;
  HIV_Blood: string;
  HbA1C_Blood: string;
  Anti_HCV_Blood: string;
  Serum_Lipids_Blood: string;

  FI_CBC: string;
  FI_SerumCreatinine: string;
  FI_SerumElectrolyte: string;
  FI_TSH: string;
  FI_T3: string;
  FI_T4: string;
  FI_Hb: string;
  FI_HbA1c: string;
  FI_RFT: string;
  FI_LFT: string;
  FI_TroponinI: string;
  FI_SerumLipids: string;
  FI_MP_Widal: string;
};

type InvestigationsProps = {
  values: InvestigationsData;
  onChange: (values: InvestigationsData) => void;
  isOpen: boolean;
  onToggle: () => void;
};

export default function Investigations({
  values,
  onChange,
  isOpen,
  onToggle,
}: InvestigationsProps) {

  function updateField(
    field: keyof InvestigationsData,
    value: string
  ) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  function toggleField(
    field: keyof InvestigationsData
  ) {
    updateField(
      field,
      values[field] === "Yes" ? "" : "Yes"
    );
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
          🧪 Investigations
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

      {isOpen && (<div className="ibox-body">

        {/* =========================
            ECG
        ========================= */}

        <div className="row">

          <div className="col-md-12">

            <label>ECG</label>

            <div
              className="d-flex flex-wrap mt-1"
              style={{ gap: "20px" }}
            >

              <label>
                <input
                  type="checkbox"
                  id="chkecgNormal"
                  checked={
                    values.Normal_Sinus_ECG === "Yes"
                  }
                  onChange={() =>
                    toggleField(
                      "Normal_Sinus_ECG"
                    )
                  }
                />{" "}
                Normal (Sinus Rhythm NO S.T.T CHANGES)
              </label>

            </div>

            <input
              type="text"
              id="txtNormalSinus_ecg"
              className="form-control mt-2"
              placeholder="Other ECG findings"
              value={
                values.Other_Ecg_Findings
              }
              onChange={(e) =>
                updateField(
                  "Other_Ecg_Findings",
                  e.target.value
                )
              }
            />

          </div>

        </div>


        {/* =========================
            2D ECHO
        ========================= */}

        <div className="row mt-3">

          <div className="col-md-12">

            <label>2D Echo</label>

            <div
              className="d-flex flex-wrap mt-1"
              style={{ gap: "20px" }}
            >

              {/* Normal */}
              <label>

                <input
                  type="checkbox"
                  id="chkechoNormal"
                  checked={
                    values.Normal_NO_RWMA_2D_Echo ===
                    "Yes"
                  }
                  onChange={() =>
                    toggleField(
                      "Normal_NO_RWMA_2D_Echo"
                    )
                  }
                />{" "}

                Normal
                (NO RWMA. NORMAL LV SYSTOLIC FUNCTION)

              </label>


              {/* Grade 1 */}
              <label>

                <input
                  type="checkbox"
                  id="chkechoGrade1"
                  checked={
                    values.Grade_1_2D_Echo ===
                    "Yes"
                  }
                  onChange={() =>
                    toggleField(
                      "Grade_1_2D_Echo"
                    )
                  }
                />{" "}

                Grade 1
                (NO RWMA NORMAL LV SYSTOLIC LV
                DIASTOLIC DYSFUNCTION TYPE 1)

              </label>

            </div>


            <input
              type="text"
              id="txtOther_2D_Echo_findings"
              className="form-control mt-2"
              placeholder="Other 2D Echo findings"
              value={
                values.other_2D_Echo
              }
              onChange={(e) =>
                updateField(
                  "other_2D_Echo",
                  e.target.value
                )
              }
            />

          </div>

        </div>


        {/* =========================
            TMT + CAG
        ========================= */}

        <div className="row mt-3">

          <div className="col-md-6">

            <label>TMT</label>

            <input
              type="text"
              id="txtTMT_findings"
              className="form-control"
              placeholder="Enter TMT findings"
              value={
                values.TMT_Blood
              }
              onChange={(e) =>
                updateField(
                  "TMT_Blood",
                  e.target.value
                )
              }
            />

          </div>


          <div className="col-md-6">

            <label>CAG</label>

            <input
              type="text"
              id="txtCAG"
              className="form-control"
              placeholder="Enter CAG findings"
              value={
                values.CAG_Blood
              }
              onChange={(e) =>
                updateField(
                  "CAG_Blood",
                  e.target.value
                )
              }
            />

          </div>

        </div>


        {/* =========================
            BLOOD INVESTIGATIONS
        ========================= */}

        <div className="row mt-3">

          <div className="col-md-12">

            <label>Blood Investigations</label>

            <div
              className="d-flex flex-wrap mt-2"
              style={{ gap: "20px" }}
            >

              <label>
                <input
                  type="checkbox"
                  id="chkCBC_Blood"
                  checked={
                    values.CBC_Blood === "Yes"
                  }
                  onChange={() =>
                    toggleField("CBC_Blood")
                  }
                />{" "}
                CBC
              </label>


              <label>
                <input
                  type="checkbox"
                  id="chkMT_Blood"
                  checked={
                    values.MT_Blood === "Yes"
                  }
                  onChange={() =>
                    toggleField("MT_Blood")
                  }
                />{" "}
                MT
              </label>


              <label>
                <input
                  type="checkbox"
                  id="chkHIV_Blood"
                  checked={
                    values.HIV_Blood === "Yes"
                  }
                  onChange={() =>
                    toggleField("HIV_Blood")
                  }
                />{" "}
                HIV
              </label>


              <label>
                <input
                  type="checkbox"
                  id="chkHbA1C_Blood"
                  checked={
                    values.HbA1C_Blood === "Yes"
                  }
                  onChange={() =>
                    toggleField("HbA1C_Blood")
                  }
                />{" "}
                HbA1C
              </label>


              <label>
                <input
                  type="checkbox"
                  id="chkAnti_HCV_Blood"
                  checked={
                    values.Anti_HCV_Blood === "Yes"
                  }
                  onChange={() =>
                    toggleField("Anti_HCV_Blood")
                  }
                />{" "}
                Anti HCV
              </label>


              <label>
                <input
                  type="checkbox"
                  id="chkSerum_Lipids_Blood"
                  checked={
                    values.Serum_Lipids_Blood ===
                    "Yes"
                  }
                  onChange={() =>
                    toggleField(
                      "Serum_Lipids_Blood"
                    )
                  }
                />{" "}
                Serum Lipids
              </label>

            </div>

          </div>

        </div>


        {/* =========================
            FOR INVESTIGATION
        ========================= */}

        <div className="row mt-3">

          <div className="col-md-12">

            <label>For Investigation</label>

            <div
              className="d-flex flex-wrap mt-2"
              style={{ gap: "20px" }}
            >

              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_CBC === "Yes"
                  }
                  onChange={() =>
                    toggleField("FI_CBC")
                  }
                />{" "}
                CBC
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_SerumCreatinine ===
                    "Yes"
                  }
                  onChange={() =>
                    toggleField(
                      "FI_SerumCreatinine"
                    )
                  }
                />{" "}
                Serum Creatinine
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_SerumElectrolyte ===
                    "Yes"
                  }
                  onChange={() =>
                    toggleField(
                      "FI_SerumElectrolyte"
                    )
                  }
                />{" "}
                Serum Electrolyte
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_TSH === "Yes"
                  }
                  onChange={() =>
                    toggleField("FI_TSH")
                  }
                />{" "}
                TSH
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_T3 === "Yes"
                  }
                  onChange={() =>
                    toggleField("FI_T3")
                  }
                />{" "}
                T3
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_T4 === "Yes"
                  }
                  onChange={() =>
                    toggleField("FI_T4")
                  }
                />{" "}
                T4
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_Hb === "Yes"
                  }
                  onChange={() =>
                    toggleField("FI_Hb")
                  }
                />{" "}
                Hb
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_HbA1c === "Yes"
                  }
                  onChange={() =>
                    toggleField("FI_HbA1c")
                  }
                />{" "}
                HbA1c
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_RFT === "Yes"
                  }
                  onChange={() =>
                    toggleField("FI_RFT")
                  }
                />{" "}
                RFT
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_LFT === "Yes"
                  }
                  onChange={() =>
                    toggleField("FI_LFT")
                  }
                />{" "}
                LFT
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_TroponinI === "Yes"
                  }
                  onChange={() =>
                    toggleField(
                      "FI_TroponinI"
                    )
                  }
                />{" "}
                Troponin-I
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_SerumLipids ===
                    "Yes"
                  }
                  onChange={() =>
                    toggleField(
                      "FI_SerumLipids"
                    )
                  }
                />{" "}
                Serum Lipids
              </label>


              <label>
                <input
                  type="checkbox"
                  checked={
                    values.FI_MP_Widal === "Yes"
                  }
                  onChange={() =>
                    toggleField(
                      "FI_MP_Widal"
                    )
                  }
                />{" "}
                MP - Widal
              </label>

            </div>

          </div>

        </div>

      </div>)}
    </div>
  );
}
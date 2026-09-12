"use client";

export type ChiefComplaintsData = {
  Typical_Chest_Pain_Since: string;
  Angina_on_Exertion_Since: string;
  Breathlessness_Exertion_Since: string;
  Breathlessness_Not_on_Exertion_Since: string;
  Other_Chief_Complaints: string;
};

type ChiefComplaintsProps = {
  values: ChiefComplaintsData;
  onChange: (values: ChiefComplaintsData) => void;
    isOpen: boolean;
    onToggle: () => void;
};

export default function ChiefComplaints({
   values,
  onChange,
  isOpen,
  onToggle,
}: ChiefComplaintsProps) {

  function updateField(
    field: keyof ChiefComplaintsData,
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
           🩺 Chief Complaints
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

        {/* ROW 1 */}
        <div className="row">

          {/* Typical Chest Pain */}
          <div className="col-md-4">

            <div className="form-group">

              <label>
                1. Typical Chest Pain Since
              </label>

              <input
                type="text"
                id="txtTypical_Chest_Pain_Since"
                className="form-control"
                placeholder="Enter duration/details"
                value={
                  values.Typical_Chest_Pain_Since
                }
                onChange={(e) =>
                  updateField(
                    "Typical_Chest_Pain_Since",
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* Angina */}
          <div className="col-md-4">

            <div className="form-group">

              <label>
                2. Angina on Exertion Since
              </label>

              <input
                type="text"
                id="txtAngina_on_Exertion_Since"
                className="form-control"
                placeholder="Enter duration/details"
                value={
                  values.Angina_on_Exertion_Since
                }
                onChange={(e) =>
                  updateField(
                    "Angina_on_Exertion_Since",
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* Breathlessness on Exertion */}
          <div className="col-md-4">

            <div className="form-group">

              <label>
                3. Breathlessness on Exertion Since
              </label>

              <input
                type="text"
                id="txtBreathlessness_on_Exertion_Since"
                className="form-control"
                placeholder="Enter duration/details"
                value={
                  values.Breathlessness_Exertion_Since
                }
                onChange={(e) =>
                  updateField(
                    "Breathlessness_Exertion_Since",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>


        {/* ROW 2 */}
        <div className="row mt-3">

          {/* Breathlessness Not on Exertion */}
          <div className="col-md-4">

            <div className="form-group">

              <label>
                4. Breathlessness Not on Exertion Since
              </label>

              <input
                type="text"
                id="txtBreathlessness_Not"
                className="form-control"
                placeholder="Enter duration/details"
                value={
                  values.Breathlessness_Not_on_Exertion_Since
                }
                onChange={(e) =>
                  updateField(
                    "Breathlessness_Not_on_Exertion_Since",
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* Other */}
          <div className="col-md-4">

            <div className="form-group">

              <label>
                5. Other
              </label>

              <input
                type="text"
                id="txtotherChief_Complaints"
                className="form-control"
                placeholder="FREE TEXT"
                value={
                  values.Other_Chief_Complaints
                }
                onChange={(e) =>
                  updateField(
                    "Other_Chief_Complaints",
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </div>

      </div>)}
    </div>
  );
}
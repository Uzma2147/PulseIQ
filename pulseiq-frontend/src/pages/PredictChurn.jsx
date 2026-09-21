import { useState, useEffect } from "react";

function PredictChurn() {
  const [formData, setFormData] = useState({
    tenure: "",
    monthlyCharges: "",
    contract: "Month-to-month",
    internetService: "Fiber optic",
    techSupport: "No",
    paymentMethod: "Electronic check",
  });

  const [result, setResult] = useState(null);
  const [animate, setAnimate] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setAnimate(false);
  setResult(null);

  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({
  gender: "Female",
  senior_citizen: 0,
  partner: "No",
  dependents: "No",

  tenure: Number(formData.tenure),

  phone_service: "Yes",
  multiple_lines: "No",

  internet_service: formData.internetService,

  online_security: "No",
  online_backup: "No",
  device_protection: "No",

  tech_support: formData.techSupport,

  streaming_tv: "No",
  streaming_movies: "No",

  contract: formData.contract,
  paperless_billing: "Yes",

  payment_method: formData.paymentMethod,

  monthly_charges: Number(formData.monthlyCharges),
}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || "Prediction request failed"
      );
    }

    const data = await response.json();
    const customerResult = {
  customer: {
    tenure: Number(formData.tenure),
    monthlyCharges: Number(formData.monthlyCharges),
    contract: formData.contract,
    internetService: formData.internetService,
    techSupport: formData.techSupport,
    paymentMethod: formData.paymentMethod,
  },
  prediction: data,
};

localStorage.setItem(
  "pulseiq_prediction",
  JSON.stringify(customerResult)
);

    const probability = Math.round(
      data.churn_probability * 100
    );

    setResult({
      probability: probability,
      risk: data.risk_level,
      recommendation:
        probability >= 66
          ? "Consider a retention offer and proactive customer support."
          : probability >= 33
          ? "Monitor this customer and consider targeted engagement."
          : "Customer currently shows a low churn risk.",
    });
  } catch (error) {
    console.error("Prediction error:", error);

    alert(
      "Unable to connect to the PulseIQ prediction server."
    );
  }
};

  useEffect(() => {
    if (result) {
      const t = setTimeout(() => setAnimate(true), 80);
      return () => clearTimeout(t);
    }
  }, [result]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = result
    ? circumference - (result.probability / 100) * circumference
    : circumference;

  const riskColor = !result
    ? "#8a93a3"
    : result.probability >= 66
    ? "#e8664e"
    : result.probability >= 33
    ? "#e8a33d"
    : "#3ddc97";

  return (
    <div className="predict-dash">
      <style>{`
        .predict-dash {
          --ink: #10141c;
          --panel: #171d28;
          --line: #232b3a;
          --field: #12161f;
          --text: #edeff3;
          --muted: #8a93a3;
          --amber: #e8a33d;
          --red: #e8664e;
          --teal: #3ddc97;
          background: var(--ink);
          color: var(--text);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          padding: 48px 40px 64px;
          min-height: 100%;
          box-sizing: border-box;
        }
        .predict-dash * { box-sizing: border-box; }
        .predict-dash .num {
          font-family: ui-monospace, "SF Mono", "Cascadia Code", Menlo, monospace;
          font-variant-numeric: tabular-nums;
        }
        .predict-head {
          margin-bottom: 36px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 24px;
        }
        .predict-head h1 {
          font-size: 26px;
          font-weight: 600;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
          text:center;
          
        }
        .predict-head p {
          margin: 0;
          color: var(--muted);
          font-size: 15px;
          max-width: 52ch;
        }
        .predict-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
          align-items: start;
        }
        .panel {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 28px;
        }
        .panel h2 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 22px;
        }
        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .field label {
          display: block;
          font-size: 12.5px;
          color: var(--muted);
          margin-bottom: 7px;
        }
        .field input,
        .field select {
          width: 100%;
          background: var(--field);
          border: 1px solid var(--line);
          border-radius: 8px;
          color: var(--text);
          font-size: 14.5px;
          padding: 10px 12px;
          font-family: inherit;
          transition: border-color 0.15s ease;
        }
        .field input.num {
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
        }
        .field input:focus,
        .field select:focus {
          outline: none;
          border-color: var(--amber);
        }
        .submit-btn {
          width: 100%;
          margin-top: 26px;
          background: var(--amber);
          color: #14100a;
          border: none;
          border-radius: 8px;
          padding: 13px;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          transition: filter 0.15s ease;
          font-family: inherit;
        }
        .submit-btn:hover { filter: brightness(1.08); }
        .submit-btn:focus-visible {
          outline: 2px solid var(--text);
          outline-offset: 2px;
        }
        .result-panel {
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }
        .result-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--muted);
          font-size: 14px;
          padding: 40px 10px;
          line-height: 1.6;
        }
        .result-empty strong { color: var(--text); font-weight: 600; }
        .gauge-wrap {
          position: relative;
          width: 164px;
          height: 164px;
          margin: 4px auto 20px;
        }
        .gauge-svg { transform: rotate(-90deg); }
        .gauge-value {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .gauge-value .big {
          font-size: 32px;
          font-weight: 600;
          line-height: 1;
        }
        .gauge-value .small {
          margin-top: 6px;
          font-size: 11px;
          color: var(--muted);
        }
        .risk-tag {
          display: inline-block;
          margin: 0 auto 22px;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }
        .risk-tag-wrap { text-align: center; }
        .result-row {
          padding: 16px 0;
          border-top: 1px solid var(--line);
        }
        .result-row .rlabel {
          color: var(--muted);
          font-size: 12.5px;
          margin-bottom: 6px;
        }
        .result-row .rvalue {
          font-size: 14.5px;
          line-height: 1.55;
        }
        @media (max-width: 820px) {
          .predict-grid { grid-template-columns: 1fr; }
          .field-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="predict-head ">
        <h1 className="text-cente">Predict customer churn</h1>
        <p>Enter customer information to estimate churn probability.</p>
      </div>

      <div className="predict-grid">
        <div className="panel">
          <h2>Customer information</h2>

          <form onSubmit={handleSubmit}>
            <div className="field-grid">
              <div className="field">
                <label>Tenure (months)</label>
                <input
                  type="number"
                  name="tenure"
                  className="num"
                  value={formData.tenure}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Monthly charges</label>
                <input
                  type="number"
                  step="0.01"
                  name="monthlyCharges"
                  className="num"
                  value={formData.monthlyCharges}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Contract</label>
                <select
                  name="contract"
                  value={formData.contract}
                  onChange={handleChange}
                >
                  <option>Month-to-month</option>
                  <option>One year</option>
                  <option>Two year</option>
                </select>
              </div>

              <div className="field">
                <label>Internet service</label>
                <select
                  name="internetService"
                  value={formData.internetService}
                  onChange={handleChange}
                >
                  <option>DSL</option>
                  <option>Fiber optic</option>
                  <option>No</option>
                </select>
              </div>

              <div className="field">
                <label>Tech support</label>
                <select
                  name="techSupport"
                  value={formData.techSupport}
                  onChange={handleChange}
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="field">
                <label>Payment method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option>Electronic check</option>
                  <option>Mailed check</option>
                  <option>Bank transfer (automatic)</option>
                  <option>Credit card (automatic)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Predict churn
            </button>
          </form>
        </div>

        <div className="panel result-panel">
          <h2>Prediction result</h2>

          {!result ? (
            <div className="result-empty">
              <p>
                Enter customer information and click <strong>Predict churn</strong> to
                see the result.
              </p>
            </div>
          ) : (
            <div>
              <div className="gauge-wrap">
                <svg className="gauge-svg" width="164" height="164" viewBox="0 0 164 164">
                  <circle cx="82" cy="82" r={radius} fill="none" stroke="#232b3a" strokeWidth="11" />
                  <circle
                    cx="82"
                    cy="82"
                    r={radius}
                    fill="none"
                    stroke={riskColor}
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={animate ? offset : circumference}
                    style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1), stroke 0.3s ease" }}
                  />
                </svg>
                <div className="gauge-value">
                  <span className="big num">{result.probability}%</span>
                  <span className="small">churn probability</span>
                </div>
              </div>

              <div className="risk-tag-wrap">
                <span
                  className="risk-tag"
                  style={{
                    color: riskColor,
                    background: `${riskColor}1a`,
                    border: `1px solid ${riskColor}55`,
                  }}
                >
                  {result.risk}
                </span>
              </div>

              <div className="result-row">
                <div className="rlabel">Recommendation</div>
                <div className="rvalue">{result.recommendation}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PredictChurn;

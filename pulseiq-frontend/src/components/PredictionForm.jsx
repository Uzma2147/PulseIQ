import { useState } from "react";
import { predictChurn } from "../services/api";

function PredictionForm() {
  const [formData, setFormData] = useState({
    tenure: 12,
    monthly_charges: 70,
    contract: "Month-to-month",
    internet_service: "Fiber optic",
    tech_support: "No",
    payment_method: "Electronic check",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const prediction = await predictChurn(formData);
      setResult(prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-container">

      <h2>Customer Churn Prediction</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Tenure</label>
          <input
            type="number"
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Monthly Charges</label>
          <input
            type="number"
            name="monthly_charges"
            value={formData.monthly_charges}
            onChange={handleChange}
          />
        </div>

        <div>
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

        <div>
          <label>Internet Service</label>
          <select
            name="internet_service"
            value={formData.internet_service}
            onChange={handleChange}
          >
            <option>DSL</option>
            <option>Fiber optic</option>
            <option>No</option>
          </select>
        </div>

        <div>
          <label>Tech Support</label>
          <select
            name="tech_support"
            value={formData.tech_support}
            onChange={handleChange}
          >
            <option>Yes</option>
            <option>No</option>
            <option>No internet service</option>
          </select>
        </div>

        <div>
          <label>Payment Method</label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
          >
            <option>Electronic check</option>
            <option>Mailed check</option>
            <option>Bank transfer (automatic)</option>
            <option>Credit card (automatic)</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Churn"}
        </button>

      </form>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {result && (
        <div>
          <h3>Prediction Result</h3>

          <p>
            Churn Probability:{" "}
            {result.churn_probability}
          </p>

          <p>
            Prediction: {result.prediction}
          </p>

          <p>
            Risk Level: {result.risk_level}
          </p>
        </div>
      )}

    </div>
  );
}

export default PredictionForm;
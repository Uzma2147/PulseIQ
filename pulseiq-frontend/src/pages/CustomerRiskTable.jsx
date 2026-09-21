
import { useEffect, useState } from "react";

function getRiskClass(risk) {
  if (risk === "High Risk") {
    return "high-risk";
  }

  if (risk === "Medium Risk") {
    return "medium-risk";
  }

  return "low-risk";
}

function CustomerRiskTable() {
  const [customers, setCustomers] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [riskFilter, setRiskFilter] = useState("All");

  // ============================================================
  // LOAD CUSTOMERS FROM BACKEND
  // ============================================================

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/customers"
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.detail || "Failed to load customers"
        );
      }

      const data = await response.json();

      console.log("Customer Risk Data:", data);

      setCustomers(data.customers);

      setSummary({
        total: data.total_customers,
        high: data.high_risk,
        medium: data.medium_risk,
        low: data.low_risk,
      });
    } catch (error) {
      console.error(
        "Customer loading error:",
        error
      );

      setError(
        "Unable to load customer risk data from the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD DATA WHEN PAGE OPENS
  // ============================================================

  useEffect(() => {
    loadCustomers();
  }, []);

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredCustomers = customers.filter((customer) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      String(customer.customer_id ?? "")
        .toLowerCase()
        .includes(searchValue) ||

      String(customer.contract ?? "")
        .toLowerCase()
        .includes(searchValue) ||

      String(customer.risk_level ?? "")
        .toLowerCase()
        .includes(searchValue) ||

      String(customer.tenure ?? "")
        .toLowerCase()
        .includes(searchValue);

    const matchesRisk =
      riskFilter === "All" ||
      customer.risk_level === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="container-fluid px-5 py-5">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="text-center mb-5">

        <h1 className="fw-bold">
          Customer Risk Table
        </h1>

        <p className="text-muted">
          Monitor customers based on their predicted churn probability.
        </p>

      </div>

      <hr className="mb-5" />

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="text-center py-5">

          <div
            className="spinner-border"
            role="status"
          ></div>

          <p className="text-muted mt-3">
            Running customer predictions...
          </p>

        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && (
        <div className="alert alert-danger">

          {error}

          <div className="mt-3">

            <button
              className="btn btn-warning"
              onClick={loadCustomers}
            >
              Try Again
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      {!loading && !error && (
        <>

          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="row g-4 mb-4">

            {/* HIGH RISK */}

            <div className="col-md-4">

              <div className="card shadow-sm">

                <div className="card-body text-center">

                  <p className="text-muted mb-2">
                    High Risk
                  </p>

                  <h2 className="risk-number high">
                    {summary.high}
                  </h2>

                  <small className="text-muted">
                    Customers requiring attention
                  </small>

                </div>

              </div>

            </div>

            {/* MEDIUM RISK */}

            <div className="col-md-4">

              <div className="card shadow-sm">

                <div className="card-body text-center">

                  <p className="text-muted mb-2">
                    Medium Risk
                  </p>

                  <h2 className="risk-number medium">
                    {summary.medium}
                  </h2>

                  <small className="text-muted">
                    Customers to monitor
                  </small>

                </div>

              </div>

            </div>

            {/* LOW RISK */}

            <div className="col-md-4">

              <div className="card shadow-sm">

                <div className="card-body text-center">

                  <p className="text-muted mb-2">
                    Low Risk
                  </p>

                  <h2 className="risk-number low">
                    {summary.low}
                  </h2>

                  <small className="text-muted">
                    Customers with low risk
                  </small>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              CUSTOMER TABLE CARD
          ================================================= */}

          <div className="card shadow-sm">

            <div className="card-body p-4">

              {/* =================================================
                  TABLE HEADER
              ================================================= */}

              <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                  <h3 className="mb-1">
                    Customer Risk Overview
                  </h3>

                  <p className="text-muted mb-0">
                    Customers ranked by predicted churn probability.
                  </p>

                </div>

                <span className="customer-count">
                  {summary.total} Customers
                </span>

              </div>

              {/* =================================================
                  SEARCH + FILTER
              ================================================= */}

              <div className="row g-3 mb-4">

                <div className="col-md-8">

                  <input
                    type="text"
                    className="form-control pulse-search"
                    placeholder="Search by Customer ID..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />

                </div>

                <div className="col-md-4">

                  <select
                    className="form-select pulse-search"
                    value={riskFilter}
                    onChange={(e) =>
                      setRiskFilter(e.target.value)
                    }
                  >

                    <option value="All">
                      All Risk Levels
                    </option>

                    <option value="High Risk">
                      High Risk
                    </option>

                    <option value="Medium Risk">
                      Medium Risk
                    </option>

                    <option value="Low Risk">
                      Low Risk
                    </option>

                  </select>

                </div>

              </div>

              {/* =================================================
                  REFRESH BUTTON
              ================================================= */}

              <div className="d-flex justify-content-end mb-3">

                <button
                  className="btn btn-warning"
                  onClick={loadCustomers}
                >
                  ↻ Refresh Predictions
                </button>

              </div>

              {/* =================================================
                  TABLE
              ================================================= */}

              <div className="table-responsive">

                <table className="table pulse-table align-middle">

                  <thead>

                    <tr>

                      <th>
                        Customer ID
                      </th>

                      <th>
                        Churn Probability
                      </th>

                      <th>
                        Risk Level
                      </th>

                      <th>
                        Contract
                      </th>

                      <th>
                        Tenure
                      </th>

                      <th>
                        Recommended Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredCustomers.map(
                      (customer) => {

                        // Backend sends probability between 0 and 1
                        const probability =
                          Number(customer.churn_probability) * 100;

                        return (

                          <tr
                            key={customer.customer_id}
                          >

                            {/* CUSTOMER ID */}

                            <td className="fw-semibold">

                              {customer.customer_id}

                            </td>

                            {/* PROBABILITY */}

                            <td>

                              <div className="probability-container">

                                <span>
                                  {probability.toFixed(0)}%
                                </span>

                                <div className="progress probability-bar">

                                  <div
                                    className="progress-bar"
                                    style={{
                                      width: `${probability}%`,
                                    }}
                                  ></div>

                                </div>

                              </div>

                            </td>

                            {/* RISK */}

                            <td>

                              <span
                                className={`risk-badge ${getRiskClass(
                                  customer.risk_level
                                )}`}
                              >

                                {customer.risk_level}

                              </span>

                            </td>

                            {/* CONTRACT */}

                            <td>
                              {customer.contract}
                            </td>

                            {/* TENURE */}

                            <td>
                              {customer.tenure} months
                            </td>

                            {/* ACTION */}

                            <td>

                              <span className="action-text">

                                {customer.recommended_action}

                              </span>

                            </td>

                          </tr>

                        );

                      }
                    )}

                    {/* NO RESULTS */}

                    {filteredCustomers.length === 0 && (

                      <tr>

                        <td
                          colSpan="6"
                          className="text-center py-5 text-muted"
                        >

                          No customers found.

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

              {/* RESULT COUNT */}

              <div className="text-muted mt-3">

                Showing{" "}

                <strong>
                  {filteredCustomers.length}
                </strong>{" "}

                of{" "}

                <strong>
                  {summary.total}
                </strong>{" "}

                customers

              </div>

            </div>

          </div>

        </>
      )}

    </div>
  );
}

export default CustomerRiskTable;

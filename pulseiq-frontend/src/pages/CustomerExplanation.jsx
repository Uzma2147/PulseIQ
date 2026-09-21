
import { useEffect, useState } from "react";

function CustomerExplanation() {

  const [result, setResult] = useState(null);

  // ============================================================
  // LOAD ONLY CURRENT PREDICTION
  // ============================================================

  useEffect(() => {

    const savedResult =
      localStorage.getItem("pulseiq_prediction");

    if (savedResult) {

      try {

        const parsedResult = JSON.parse(savedResult);

        setResult(parsedResult);

      } catch (error) {

        console.error(
          "Error reading saved prediction:",
          error
        );

        setResult(null);

      }

    }

  }, []);


  if (!result) {

    return (

      <div className="container py-5">

        {/* PAGE HEADER */}

        <div className="text-center mb-5">
<h1 className="h2 fw-bold">
  Customer Explanation
</h1>

          <p className="lead">
            Understand the factors influencing a customer's churn prediction.
          </p>

        </div>

        <hr className="mb-5" />


        <div className="card shadow-sm">

          <div className="card-body p-4">

          


            {/* TABLE */}

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
                      Top Churn Drivers
                    </th>

                    <th>
                      Explanation
                    </th>

                    <th>
                      Recommended Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {/* NO DATA BEFORE PREDICTION */}

                </tbody>

              </table>

            </div>


            {/* EMPTY MESSAGE */}

            <div className="text-center py-5">

              <h5 className="text-muted">
                No prediction available
              </h5>

              <p className="text-muted mb-0">
                Make a prediction from the Predict Churn page
                to view customer-specific explanation data.
              </p>

            </div>

          </div>

        </div>

      </div>

    );
  }


  // ============================================================
  // EXTRACT DATA AFTER PREDICTION
  // ============================================================

  const customer = result.customer;

  const prediction = result.prediction;


  // ============================================================
  // PROBABILITY
  // ============================================================

  const probability = Math.round(
    Number(prediction.churn_probability) * 100
  );


  // ============================================================
  // RISK CLASS
  // ============================================================

  const riskClass =
    prediction.risk_level === "High"
      ? "risk-high"
      : prediction.risk_level === "Medium"
      ? "risk-medium"
      : "risk-low";


  // ============================================================
  // CUSTOMER EXPLANATION AFTER PREDICTION
  // ============================================================

  return (

    <div className="container py-5">


      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="text-center mb-5">

        <h1 className="display-4 fw-bold">
          Customer Explanation
        </h1>

        <p className="lead">
          Understand the factors influencing a customer's churn prediction.
        </p>

      </div>

      <hr className="mb-5" />


      {/* ==================================================
          CUSTOMER INFORMATION + PREDICTION
      ================================================== */}

      <div className="row g-4">


        {/* CUSTOMER INFORMATION */}

        <div className="col-lg-6">

          <div className="card p-4 h-100">

            <h2 className="text-center mb-5">
              Customer Information
            </h2>


            <div className="row g-4">


              {/* TENURE */}

              <div className="col-md-6">

                <div className="info-box">

                  <div className="text-muted mb-2">
                    Tenure
                  </div>

                  <div className="fs-5 fw-semibold">
                    {customer.tenure} months
                  </div>

                </div>

              </div>


              {/* MONTHLY CHARGES */}

              <div className="col-md-6">

                <div className="info-box">

                  <div className="text-muted mb-2">
                    Monthly Charges
                  </div>

                  <div className="fs-5 fw-semibold">
                    $
                    {Number(
                      customer.monthlyCharges
                    ).toFixed(2)}
                  </div>

                </div>

              </div>


              {/* CONTRACT */}

              <div className="col-md-6">

                <div className="info-box">

                  <div className="text-muted mb-2">
                    Contract
                  </div>

                  <div className="fs-5 fw-semibold">
                    {customer.contract}
                  </div>

                </div>

              </div>


              {/* INTERNET SERVICE */}

              <div className="col-md-6">

                <div className="info-box">

                  <div className="text-muted mb-2">
                    Internet Service
                  </div>

                  <div className="fs-5 fw-semibold">
                    {customer.internetService}
                  </div>

                </div>

              </div>


              {/* TECH SUPPORT */}

              <div className="col-md-6">

                <div className="info-box">

                  <div className="text-muted mb-2">
                    Tech Support
                  </div>

                  <div className="fs-5 fw-semibold">
                    {customer.techSupport}
                  </div>

                </div>

              </div>


              {/* PAYMENT METHOD */}

              <div className="col-md-6">

                <div className="info-box">

                  <div className="text-muted mb-2">
                    Payment Method
                  </div>

                  <div className="fs-5 fw-semibold">
                    {customer.paymentMethod}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* CHURN PREDICTION */}

        <div className="col-lg-6">

          <div className="card p-4 h-100 text-center">

            <h2 className="mb-5">
              Churn Prediction
            </h2>


            <p className="mb-2">
              Churn Probability
            </p>

            <div className="display-1 fw-bold mb-3">
              {probability}%
            </div>


            <div className="mb-4">

              <span
                className={`risk-badge ${riskClass}`}
              >
                {prediction.risk_level} Risk
              </span>

            </div>


            <hr className="my-4" />

          </div>

        </div>

      </div>


      {/* ==================================================
          PREDICTION SUMMARY
      ================================================== */}

      <div className="card mt-4 p-4">

        <h3 className="mb-4">
          Prediction Summary
        </h3>


        <div className="row g-4">


          {/* CHURN PREDICTION */}

          <div className="col-md-4">

            <div className="info-box text-center">

              <div className="text-muted mb-2">
                Churn Prediction
              </div>

              <div className="fs-4 fw-bold">

                {prediction.churn_prediction === 1
                  ? "Likely to Churn"
                  : "Likely to Stay"}

              </div>

            </div>

          </div>


          {/* PROBABILITY */}

          <div className="col-md-4">

            <div className="info-box text-center">

              <div className="text-muted mb-2">
                Probability
              </div>

              <div className="fs-4 fw-bold">
                {probability}%
              </div>

            </div>

          </div>


          {/* RISK LEVEL */}

          <div className="col-md-4">

            <div className="info-box text-center">

              <div className="text-muted mb-2">
                Risk Level
              </div>

              <div className={`fs-4 fw-bold ${riskClass}`}>
                {prediction.risk_level}
              </div>

            </div>

          </div>


        </div>

      </div>


    </div>

  );
}

export default CustomerExplanation;

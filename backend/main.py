import os
import joblib
import pandas as pd
import xgboost as xgb

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================================
# 1. FASTAPI APP
# ============================================================

app = FastAPI(
    title="PulseIQ API",
    description="Customer Churn Prediction API",
    version="1.0.0"
)


# ============================================================
# 2. CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# 3. FILE PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "xgboost_model.json"
)

PREPROCESSOR_PATH = os.path.join(
    BASE_DIR,
    "model",
    "preprocessor.pkl"
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "data",
    "WA_Fn-UseC_-Telco-Customer-Churn.csv"
)

# ============================================================
# 4. LOAD MODEL
# ============================================================

model = None
preprocessor = None


print("\n========================================")
print("LOADING PULSEIQ")
print("========================================")

print("Model path:")
print(MODEL_PATH)

print("Preprocessor path:")
print(PREPROCESSOR_PATH)

print("\nModel exists:", os.path.exists(MODEL_PATH))
print("Preprocessor exists:", os.path.exists(PREPROCESSOR_PATH))


# ============================================================
# LOAD XGBOOST MODEL
# ============================================================

try:

    print("\nLoading XGBoost model...")

    model = xgb.XGBClassifier()

    model.load_model(MODEL_PATH)

    print("XGBoost model loaded successfully!")
    print("Model type:", type(model))

except Exception as e:

    print("\nXGBOOST MODEL ERROR")
    print("Error type:", type(e).__name__)
    print("Error:", str(e))


# ============================================================
# LOAD PREPROCESSOR
# ============================================================

try:

    print("\nLoading preprocessor...")

    preprocessor = joblib.load(
        PREPROCESSOR_PATH
    )

    print("Preprocessor loaded successfully!")
    print("Preprocessor type:", type(preprocessor))

except Exception as e:

    print("\nPREPROCESSOR ERROR")
    print("Error type:", type(e).__name__)
    print("Error:", str(e))


print("\n========================================")

if model is not None and preprocessor is not None:

    print("MODEL + PREPROCESSOR LOADED SUCCESSFULLY")

else:

    print("MODEL OR PREPROCESSOR FAILED TO LOAD")

print("========================================")


# ============================================================
# 5. REQUEST MODEL
# ============================================================

class CustomerData(BaseModel):

    gender: str = "Female"

    seniorCitizen: int = 0

    partner: str = "No"

    dependents: str = "No"

    tenure: int = 1

    phoneService: str = "Yes"

    multipleLines: str = "No"

    internetService: str = "Fiber optic"

    onlineSecurity: str = "No"

    onlineBackup: str = "No"

    deviceProtection: str = "No"

    techSupport: str = "No"

    streamingTV: str = "No"

    streamingMovies: str = "No"

    contract: str = "Month-to-month"

    paperlessBilling: str = "Yes"

    paymentMethod: str = "Electronic check"

    monthlyCharges: float = 70.0


# ============================================================
# 6. COMMON FUNCTION
def prepare_customer_data(customer: CustomerData):

    data = pd.DataFrame([{

        "gender": customer.gender,

        "SeniorCitizen": customer.seniorCitizen,

        "Partner": customer.partner,

        "Dependents": customer.dependents,

        "tenure": customer.tenure,

        "PhoneService": customer.phoneService,

        "MultipleLines": customer.multipleLines,

        "InternetService": customer.internetService,

        "OnlineSecurity": customer.onlineSecurity,

        "OnlineBackup": customer.onlineBackup,

        "DeviceProtection": customer.deviceProtection,

        "TechSupport": customer.techSupport,

        "StreamingTV": customer.streamingTV,

        "StreamingMovies": customer.streamingMovies,

        "Contract": customer.contract,

        "PaperlessBilling": customer.paperlessBilling,

        "PaymentMethod": customer.paymentMethod,

        "MonthlyCharges": customer.monthlyCharges

    }])


    # ========================================================
    # SERVICE COUNT
    # ========================================================

    service_columns = [

        "PhoneService",
        "MultipleLines",
        "OnlineSecurity",
        "OnlineBackup",
        "DeviceProtection",
        "TechSupport",
        "StreamingTV",
        "StreamingMovies"

    ]


    data["ServiceCount"] = (
        data[service_columns] == "Yes"
    ).sum(axis=1)


    # ========================================================
    # TENURE BUCKET
    # ========================================================

    def create_tenure_bucket(tenure):

        if tenure <= 12:

            return "0-12"

        elif tenure <= 24:

            return "13-24"

        elif tenure <= 48:

            return "25-48"

        else:

            return "49+"


    data["TenureBucket"] = data[
        "tenure"
    ].apply(create_tenure_bucket)


    return data


# ============================================================
# 7. HOME ENDPOINT
# ============================================================

@app.get("/")
def home():

    return {
        "message": "PulseIQ API is running",
        "model_loaded": model is not None,
        "preprocessor_loaded": preprocessor is not None
    }


# ============================================================
# 8. PREDICTION ENDPOINT
# ============================================================

@app.post("/predict")
def predict_churn(customer: CustomerData):

    # --------------------------------------------------------
    # Check model
    # --------------------------------------------------------

    if model is None:

        raise HTTPException(
            status_code=500,
            detail="XGBoost model is not loaded."
        )


    # --------------------------------------------------------
    # Check preprocessor
    # --------------------------------------------------------

    if preprocessor is None:

        raise HTTPException(
            status_code=500,
            detail="Preprocessor is not loaded."
        )


    try:

        print("\n========================================")
        print("PREDICTION STARTED")
        print("========================================")


        # ====================================================
        # 1. PREPARE DATA
        # ====================================================

        data = prepare_customer_data(customer)


        # ====================================================
        # 2. DISPLAY INPUT
        # ====================================================

        print("\nFinal input DataFrame:")

        print(data)

        print("\nColumns sent to preprocessor:")

        print(data.columns.tolist())


        # ====================================================
        # 3. PREPROCESSING
        # ====================================================

        print("\nApplying preprocessing...")

        processed_data = preprocessor.transform(
            data
        )

        print("Preprocessing successful!")

        print(
            "Processed data shape:",
            processed_data.shape
        )


        # ====================================================
        # 4. MODEL PREDICTION
        # ====================================================

        print("\nRunning XGBoost prediction...")

        prediction = model.predict(
            processed_data
        )


        probability = model.predict_proba(
            processed_data
        )[0][1]


        print("Prediction:", prediction)

        print(
            "Churn probability:",
            probability
        )



        # ====================================================
        # 6. RISK LEVEL
        # ====================================================

        if probability >= 0.60:

            risk_level = "High"

            recommendation = (
                "Customer has a high churn risk. "
                "Consider offering a retention discount, "
                "personalized support, or a contract upgrade."
            )


        elif probability >= 0.30:

            risk_level = "Medium"

            recommendation = (
                "Customer has a moderate churn risk. "
                "Consider proactive engagement and "
                "personalized offers."
            )


        else:

            risk_level = "Low"

            recommendation = (
                "Customer has a low churn risk. "
                "Continue regular engagement and "
                "customer support."
            )


        # ====================================================
        # 7. RESPONSE
        # ====================================================

        result = {

    "success": True,

    "churn_probability": round(float(probability), 4),

    "risk_level": risk_level,

    "recommendation": recommendation

}


        print("\n========================================")
        print("PREDICTION SUCCESSFUL")
        print("========================================")

        print(result)


        return result


    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except Exception as e:

        print("\n========================================")
        print("PREDICTION ERROR")
        print("========================================")

        print(
            "Error type:",
            type(e).__name__
        )

        print(
            "Error message:",
            str(e)
        )

        print("========================================")


        raise HTTPException(

            status_code=500,

            detail=(
                f"Prediction failed: "
                f"{type(e).__name__}: {str(e)}"
            )

        )


# ============================================================
# 9. CUSTOMER EXPLANATION ENDPOINT
# ============================================================

@app.post("/explain")
def explain_customer(customer: CustomerData):

    # --------------------------------------------------------
    # Check model
    # --------------------------------------------------------

    if model is None:

        raise HTTPException(
            status_code=500,
            detail="XGBoost model is not loaded."
        )


    # --------------------------------------------------------
    # Check preprocessor
    # --------------------------------------------------------

    if preprocessor is None:

        raise HTTPException(
            status_code=500,
            detail="Preprocessor is not loaded."
        )


    try:

        print("\n========================================")
        print("CUSTOMER EXPLANATION STARTED")
        print("========================================")


        # ====================================================
        # 1. PREPARE CUSTOMER DATA
        # ====================================================

        data = prepare_customer_data(customer)


        print("\nExplanation input:")

        print(data)


        # ====================================================
        # 2. PREPROCESS
        # ====================================================

        processed_data = preprocessor.transform(
            data
        )


        print(
            "\nProcessed data shape:",
            processed_data.shape
        )


        # ====================================================
        # 3. PREDICTION
        # ====================================================

        probability = model.predict_proba(
            processed_data
        )[0][1]


        


        # ====================================================
        # 4. RISK LEVEL
        # ====================================================

        if probability >= 0.60:

            risk_level = "High Risk"

            recommendation = (
                "This customer has a high predicted "
                "probability of churn. Consider a proactive "
                "retention strategy."
            )


        elif probability >= 0.30:

            risk_level = "Medium Risk"

            recommendation = (
                "This customer has a moderate predicted "
                "probability of churn. Consider proactive "
                "engagement and personalized offers."
            )


        else:

            risk_level = "Low Risk"

            recommendation = (
                "This customer has a low predicted "
                "probability of churn. Continue regular "
                "engagement and customer support."
            )


        # ====================================================
        # 5. CUSTOMER INFORMATION
        # ====================================================

        customer_information = {

            "gender": customer.gender,

            "seniorCitizen": customer.seniorCitizen,

            "partner": customer.partner,

            "dependents": customer.dependents,

            "tenure": customer.tenure,

            "phoneService": customer.phoneService,

            "multipleLines": customer.multipleLines,

            "internetService": customer.internetService,

            "onlineSecurity": customer.onlineSecurity,

            "onlineBackup": customer.onlineBackup,

            "deviceProtection": customer.deviceProtection,

            "techSupport": customer.techSupport,

            "streamingTV": customer.streamingTV,

            "streamingMovies": customer.streamingMovies,

            "contract": customer.contract,

            "paperlessBilling": customer.paperlessBilling,

            "paymentMethod": customer.paymentMethod,

            "monthlyCharges": customer.monthlyCharges

        }


        # ====================================================
        # 6. RESPONSE
        # ====================================================

        result = {

            "success": True,

            "churn_probability": round(float(probability), 4),

            "risk_level": risk_level,

            "recommendation": recommendation,

            "customer": customer_information

        }


        print("\n========================================")
        print("CUSTOMER EXPLANATION SUCCESSFUL")
        print("========================================")

        print(result)


        return result


    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except Exception as e:

        print("\n========================================")
        print("EXPLANATION ERROR")
        print("========================================")

        print(
            "Error type:",
            type(e).__name__
        )

        print(
            "Error message:",
            str(e)
        )

        print("========================================")


        raise HTTPException(

            status_code=500,

            detail=(
                f"Explanation failed: "
                f"{type(e).__name__}: {str(e)}"
            )

        )
# ============================================================
# 10. CUSTOMER RISK TABLE ENDPOINT
# ============================================================

@app.get("/customers")
def get_customers():

    # --------------------------------------------------------
    # Check model
    # --------------------------------------------------------

    if model is None:
        raise HTTPException(
            status_code=500,
            detail="XGBoost model is not loaded."
        )

    # --------------------------------------------------------
    # Check preprocessor
    # --------------------------------------------------------

    if preprocessor is None:
        raise HTTPException(
            status_code=500,
            detail="Preprocessor is not loaded."
        )

    try:

        print("\n========================================")
        print("CUSTOMER RISK TABLE STARTED")
        print("========================================")

        # ----------------------------------------------------
        # Dataset path
        # ----------------------------------------------------

        DATA_PATH = os.path.join(
            BASE_DIR,
            "data",
            "WA_Fn-UseC_-Telco-Customer-Churn.csv"
        )

        if not os.path.exists(DATA_PATH):

            raise HTTPException(
                status_code=404,
                detail=f"Dataset not found: {DATA_PATH}"
            )

        # ----------------------------------------------------
        # Load dataset
        # ----------------------------------------------------

        df = pd.read_csv(DATA_PATH)

        print("Dataset loaded.")
        print("Customers:", len(df))

        # ----------------------------------------------------
        # Keep customer ID separately
        # ----------------------------------------------------

        customer_ids = df["customerID"].astype(str)

        # ----------------------------------------------------
        # Remove columns that were not used for modeling
        # ----------------------------------------------------

        model_data = df.drop(
            columns=[
                "customerID",
                "Churn",
                "TotalCharges"
            ],
            errors="ignore"
        ).copy()

        # ----------------------------------------------------
        # Service Count
        # ----------------------------------------------------

        service_columns = [
            "PhoneService",
            "MultipleLines",
            "OnlineSecurity",
            "OnlineBackup",
            "DeviceProtection",
            "TechSupport",
            "StreamingTV",
            "StreamingMovies"
        ]

        model_data["ServiceCount"] = (
            model_data[service_columns] == "Yes"
        ).sum(axis=1)

        # ----------------------------------------------------
        # Tenure Bucket
        # ----------------------------------------------------

        def create_tenure_bucket(tenure):

            if tenure <= 12:
                return "0-12"

            elif tenure <= 24:
                return "13-24"

            elif tenure <= 48:
                return "25-48"

            else:
                return "49+"

        model_data["TenureBucket"] = (
            model_data["tenure"]
            .apply(create_tenure_bucket)
        )

        # ----------------------------------------------------
        # Preprocessing
        # ----------------------------------------------------

        processed_data = preprocessor.transform(
            model_data
        )

        print(
            "Processed data shape:",
            processed_data.shape
        )

        # ----------------------------------------------------
        # Predictions
        # ----------------------------------------------------

        probabilities = model.predict_proba(
            processed_data
        )[:, 1]

        # ----------------------------------------------------
        # Build response
        # ----------------------------------------------------

        customers = []

        for index, probability in enumerate(probabilities):

            probability = float(probability)

            # ----------------------------------------------
            # Risk
            # ----------------------------------------------

            if probability >= 0.60:

                risk_level = "High Risk"

                recommended_action = (
                    "Retention Action"
                )

            elif probability >= 0.30:

                risk_level = "Medium Risk"

                recommended_action = (
                    "Monitor Customer"
                )

            else:

                risk_level = "Low Risk"

                recommended_action = (
                    "Regular Engagement"
                )

            # ----------------------------------------------
            # Customer information
            # ----------------------------------------------

            customers.append({

                "customer_id": customer_ids.iloc[index],

                "churn_probability": round(
                    probability,
                    4
                ),

                "risk_level": risk_level,

                "contract": str(
                    df.iloc[index]["Contract"]
                ),

                "tenure": int(
                    df.iloc[index]["tenure"]
                ),

                "recommended_action":
                    recommended_action

            })

        # ----------------------------------------------------
        # Sort by highest risk
        # ----------------------------------------------------

        customers.sort(
            key=lambda x: x["churn_probability"],
            reverse=True
        )

        # ----------------------------------------------------
        # Risk counts
        # ----------------------------------------------------

        high_risk = sum(
            1
            for customer in customers
            if customer["risk_level"] == "High Risk"
        )

        medium_risk = sum(
            1
            for customer in customers
            if customer["risk_level"] == "Medium Risk"
        )

        low_risk = sum(
            1
            for customer in customers
            if customer["risk_level"] == "Low Risk"
        )

        # ----------------------------------------------------
        # Final response
        # ----------------------------------------------------

        result = {

            "success": True,

            "total_customers": len(customers),

            "high_risk": high_risk,

            "medium_risk": medium_risk,

            "low_risk": low_risk,

            "customers": customers

        }

        print("\nRisk table generated successfully.")

        print(
            "High Risk:",
            high_risk
        )

        print(
            "Medium Risk:",
            medium_risk
        )

        print(
            "Low Risk:",
            low_risk
        )

        return result

    except HTTPException:
        raise

    except Exception as e:

        print("\n========================================")
        print("CUSTOMER RISK TABLE ERROR")
        print("========================================")

        print(
            "Error type:",
            type(e).__name__
        )

        print(
            "Error message:",
            str(e)
        )

        print("========================================")

        raise HTTPException(
            status_code=500,
            detail=(
                f"Customer risk table failed: "
                f"{type(e).__name__}: {str(e)}"
            )
        )

# ============================================================
# 10. RUN SERVER
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(

        "main:app",

        host="127.0.0.1",

        port=8000,

        reload=True

    )
import streamlit as st
import joblib
import pandas as pd
import numpy as np

# -------------------------
# Load saved model files
# -------------------------
rf_model = joblib.load("models/rf_model.pkl")
imputer = joblib.load("models/imputer.pkl")
feature_names = joblib.load("models/feature_names.pkl")

st.set_page_config(page_title="OvaInsight - PCOS Risk Predictor")

st.title("🩺 OvaInsight - PCOS Risk Stratification System")

st.write("Enter patient details below to assess PCOS risk.")

# -------------------------
# Input Form
# -------------------------
age = st.number_input("Age (years)", 12, 50, 22)
weight = st.number_input("Weight (kg)", 30.0, 150.0, 60.0)
height = st.number_input("Height (cm)", 120.0, 200.0, 160.0)

fast_food = st.selectbox("Fast Food Consumption", ["No", "Yes"])
exercise = st.selectbox("Regular Exercise", ["Yes", "No"])
weight_gain = st.selectbox("Recent Weight Gain", ["No", "Yes"])
hair_growth = st.selectbox("Excess Hair Growth", ["No", "Yes"])

amh = st.number_input("AMH (ng/mL)", 0.0, 20.0, 4.0)
lh = st.number_input("LH (mIU/mL)", 0.0, 50.0, 5.0)
fsh = st.number_input("FSH (mIU/mL)", 0.0, 50.0, 5.0)
rbs = st.number_input("Blood Sugar (mg/dL)", 50.0, 300.0, 100.0)

# -------------------------
# Calculate BMI
# -------------------------
bmi = weight / ((height / 100) ** 2)
st.write(f"Calculated BMI: {round(bmi,2)}")

# -------------------------
# Predict Button
# -------------------------
if st.button("Predict Risk"):

    # Create empty feature array
    input_data = pd.DataFrame(columns=feature_names)
    input_data.loc[0] = 0

    # Fill known features
    if "Age_yrs" in feature_names:
        input_data["Age_yrs"] = age
    if "Weight_Kg" in feature_names:
        input_data["Weight_Kg"] = weight
    if "HeightCm" in feature_names:
        input_data["HeightCm"] = height
    if "BMI" in feature_names:
        input_data["BMI"] = bmi
    if "Fast_food_Y_N" in feature_names:
        input_data["Fast_food_Y_N"] = 1 if fast_food == "Yes" else 0
    if "Reg.ExerciseY_N" in feature_names:
        input_data["Reg.ExerciseY_N"] = 0 if exercise == "No" else 1
    if "Weight_gainY_N" in feature_names:
        input_data["Weight_gainY_N"] = 1 if weight_gain == "Yes" else 0
    if "hair_growthY_N" in feature_names:
        input_data["hair_growthY_N"] = 1 if hair_growth == "Yes" else 0
    if "AMHng_mL" in feature_names:
        input_data["AMHng_mL"] = amh
    if "LHmIU_mL" in feature_names:
        input_data["LHmIU_mL"] = lh
    if "FSHmIU_mL" in feature_names:
        input_data["FSHmIU_mL"] = fsh
    if "RBSmg_dl" in feature_names:
        input_data["RBSmg_dl"] = rbs

    # Impute missing values
    input_imputed = imputer.transform(input_data)

    # Predict probability
    probability = rf_model.predict_proba(input_imputed)[0][1]
    risk_percent = round(probability * 100, 2)

    st.subheader("🔍 Risk Assessment Result")
    st.progress(probability)

    if risk_percent < 30:
        st.success(f"Low Risk: {risk_percent}%")
    elif risk_percent < 70:
        st.warning(f"Moderate Risk: {risk_percent}%")
    else:
        st.error(f"High Risk: {risk_percent}%")

    # -------------------------
    # Simple Suggestions
    # -------------------------
    st.subheader("🍎 Personalized Suggestions")

    if bmi > 25:
        st.write("• Reduce refined carbs, add high-fiber foods (oats, millets)")
        st.write("• Include flaxseeds or chia seeds daily")
    if fast_food == "Yes":
        st.write("• Avoid fried and processed foods")
        st.write("• Include fruits: apple, berries, guava")
    if exercise == "No":
        st.write("• 30 minutes brisk walking daily")
        st.write("• Add yoga or strength training 3 times/week")
    if rbs > 140:
        st.write("• Follow low glycemic index diet")
        st.write("• Avoid sugary beverages")

    st.info("⚠ This tool is for educational purposes only. Consult a doctor for medical diagnosis.")
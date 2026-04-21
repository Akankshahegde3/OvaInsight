import streamlit as st
import joblib
import numpy as np

st.title("PCOS Lifestyle Risk Assessment")

if "logged_in" not in st.session_state or not st.session_state.logged_in:
    st.warning("Please login first.")
    st.stop()

# Basic Inputs
age = st.number_input("Age", 15, 50)
weight = st.number_input("Weight (kg)", 30.0, 120.0)
height = st.number_input("Height (cm)", 120.0, 200.0)

bmi = weight / ((height/100)**2)
st.write(f"Calculated BMI: {bmi:.2f}")

fast_food = st.selectbox("Fast Food Consumption", ["No", "Yes"])
exercise = st.selectbox("Regular Exercise", ["Yes", "No"])
weight_gain = st.selectbox("Recent Weight Gain", ["No", "Yes"])
hair_growth = st.selectbox("Excess Hair Growth", ["No", "Yes"])

if st.button("Predict Risk"):

    risk_score = 0

    if bmi > 25:
        risk_score += 20
    if fast_food == "Yes":
        risk_score += 15
    if exercise == "No":
        risk_score += 15
    if weight_gain == "Yes":
        risk_score += 20
    if hair_growth == "Yes":
        risk_score += 20

    st.session_state.risk_score = risk_score
    st.switch_page("pages/2_Result.py")
#from sqlalchemy import values

import pandas as pd

from recommendation_engine import generate_personalized_recommendations
import shap
from scheme_engine import get_government_schemes
import numpy as np
import joblib

# Load trained model
model = joblib.load("../models/lifestyle_model.pkl")
feature_order = joblib.load("../models/lifestyle_features.pkl")
explainer = shap.TreeExplainer(model)

def predict_lifestyle_risk(data):

    # -----------------------------
    # Calculate BMI
    # -----------------------------
    height_m = data.height / 100 if data.height else 1
    bmi = data.weight / (height_m ** 2) if height_m else 0

    # -----------------------------
    # Arrange features in EXACT training order
    # -----------------------------
    input_data = [
        data.age,
        data.weight,
        data.height,
        bmi,
        data.weight_gain,
        data.hair_growth,
        data.hair_loss,
        data.pimples,
        data.skin_darkening,
        data.fast_food,
        data.regular_exercise,
        data.cycle_length
    ]

    input_df = pd.DataFrame([input_data], columns=feature_order)
    print("MODEL EXPECTS:", model.feature_names_in_)
    print("INPUT DF COLUMNS:", input_df.columns.tolist())

    # -----------------------------
    # Predict Probability
    # -----------------------------
    probability = model.predict_proba(input_df)[0][1]
    print("INPUT:", input_data)
    print("PREDICTED PROBABILITY:", probability)
    lifestyle_probability = float(probability)

    # -----------------------------
    # Feature Importance Calculation
    # -----------------------------
    feature_names = [
        "Age",
        "Weight",
        "Height",
        "BMI",
        "Weight Gain",
        "Hair Growth",
        "Hair Loss",
        "Pimples",
        "Skin Darkening",
        "Fast Food",
        "Regular Exercise",
        "Cycle Length"
    ]

    # -----------------------------
    # Dynamic SHAP Contributions
    # -----------------------------

    shap_values = explainer(input_df)

    values = shap_values.values  # shape (1, features, classes)

    # Extract positive class (index 1)
    contributions = values[0][:, 1]

    print("SHAP RAW:", contributions)

    total_impact = np.sum(np.abs(contributions))

    contributors = []

    for name, raw_value in zip(feature_names, contributions):

        magnitude = abs(raw_value)
        percentage = (magnitude / total_impact) * 100 if total_impact != 0 else 0

        direction = "increase" if raw_value > 0 else "decrease"

        contributors.append({
            "feature": name,
            "percentage": round(float(percentage), 2),
            "direction": direction
        })

    contributors = sorted(
        contributors,
        key=lambda x: x["percentage"],
        reverse=True
    )

    top_contributors = contributors[:5]

    # -----------------------------
    # Functional Categorization (Non-causal)
    # -----------------------------

    behavioral_metabolic_features = {
        "Weight",
        "BMI",
        "Weight Gain",
        "Fast Food",
        "Regular Exercise"
    }

    clinical_sign_features = {
        "Skin Darkening",
        "Hair Growth",
        "Hair Loss",
        "Pimples",
        "Cycle Length"
    }

    behavioral_metabolic = []
    clinical_signs = []

    for item in top_contributors:
        if item["feature"] in behavioral_metabolic_features:
            behavioral_metabolic.append(item)
        elif item["feature"] in clinical_sign_features:
            clinical_signs.append(item)

    # -----------------------------
    # Layer 2: Clinical Refinement
    # -----------------------------
    clinical_adjustment = 0

    if data.lh is not None:

        lh = data.lh
        fsh = data.fsh
        amh = data.amh
        fasting_sugar = data.fasting_sugar

        # LH/FSH ratio logic
        if fsh and fsh != 0:
            ratio = lh / fsh
            if ratio > 2:
                clinical_adjustment += 0.07

        # AMH high marker
        if amh is not None and amh > 4:
            clinical_adjustment += 0.07

        # Insulin resistance indicator
        if fasting_sugar is not None and fasting_sugar > 100:
            clinical_adjustment += 0.05

    refined_probability = min(lifestyle_probability + clinical_adjustment, 1.0)

    # -----------------------------
    # Risk Category
    # -----------------------------
    if refined_probability < 0.33:
        refined_category = "Low"
    elif refined_probability < 0.66:
        refined_category = "Moderate"
    else:
        refined_category = "High"

    # -----------------------------
    # Final Response
    # -----------------------------
    return {
        "lifestyle_risk_probability": round(lifestyle_probability * 100, 2),
        "clinical_adjustment": round(clinical_adjustment * 100, 2),
        "final_refined_risk_probability": round(refined_probability * 100, 2),
        "final_risk_category": refined_category,
        "interpretation": get_interpretation(refined_category),
        "category_recommendation": get_recommendation(refined_category),
        "personalized_recommendations": generate_personalized_recommendations(
            refined_category,
            top_contributors,
            data,
            bmi
        ),
        "behavioral_metabolic_factors": behavioral_metabolic,
        "clinical_sign_indicators": clinical_signs,
        "government_schemes": get_government_schemes(data.age, refined_category)
    }


# ------------------------------
# Helper Functions
# ------------------------------

def get_interpretation(category):
    if category == "Low":
        return "The assessment suggests a low probability of PCOS based on the provided information. No strong predictive indicators were identified at this time. Maintaining healthy lifestyle practices remains important for long-term hormonal and metabolic well-being."
    elif category == "Moderate":
        return "Your assessment indicates a moderate probability of PCOS based on the lifestyle patterns and symptom indicators provided. While this result does not confirm a medical diagnosis, certain responses are commonly associated with hormonal or metabolic imbalance. Early attention to these patterns may help prevent progression and support long-term reproductive and metabolic health."
    else:
        return "The assessment indicates a high probability of PCOS based on multiple influential lifestyle and clinical indicators. While this tool does not provide a medical diagnosis, the pattern observed is commonly associated with hormonal imbalance and metabolic risk."


def get_recommendation(category):
    if category == "Low":
        return "Continue balanced nutrition, regular exercise, and routine health checkups. If new symptoms arise, consider seeking medical advice for further evaluation."
    elif category == "Moderate":
        return "Consider strengthening lifestyle habits such as maintaining a balanced diet, engaging in regular physical activity, and monitoring menstrual cycle regularity. If symptoms persist, worsen, or cause concern, a consultation with a qualified healthcare provider for hormonal and metabolic evaluation is recommended."
    else:
        return "A comprehensive clinical evaluation is strongly recommended. Consider consulting a gynecologist or endocrinologist for hormonal testing, metabolic screening, and individualized treatment guidance. Early intervention can significantly improve long-term reproductive and metabolic outcomes."
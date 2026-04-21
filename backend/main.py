from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import joblib, numpy as np, pandas as pd

app = FastAPI(title="OvaInsight API", version="2.0")
app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# ── Load models ───────────────────────────────────────────────────────────────
try:
    lifestyle_model    = joblib.load("../models/lifestyle_model.pkl")
    lifestyle_features = joblib.load("../models/lifestyle_features.pkl")
    clinical_model     = joblib.load("../models/clinical_model.pkl")
    clinical_features  = joblib.load("../models/clinical_features.pkl")
    imputer            = joblib.load("../models/imputer.pkl")
    print("✅ All models loaded")
    print("Lifestyle features:", lifestyle_features)
except Exception as e:
    print(f"⚠ Model load warning: {e}")
    lifestyle_model = lifestyle_features = None
    clinical_model  = clinical_features  = None
    imputer = None

# ── Schemas ───────────────────────────────────────────────────────────────────
class LifestyleInput(BaseModel):
    age:              int   = Field(..., ge=10, le=60)
    height:           float = Field(..., gt=50, le=250)
    weight:           float = Field(..., gt=20, le=200)
    cycle_length:     int   = Field(..., ge=15, le=90)
    weight_gain:      int   = Field(..., ge=0, le=1)
    hair_growth:      int   = Field(..., ge=0, le=1)
    hair_loss:        int   = Field(..., ge=0, le=1)
    pimples:          int   = Field(..., ge=0, le=1)
    skin_darkening:   int   = Field(..., ge=0, le=1)
    fast_food:        int   = Field(..., ge=0, le=1)
    regular_exercise: int   = Field(..., ge=0, le=1)
    lh:            Optional[float] = Field(None, ge=0, le=50)
    fsh:           Optional[float] = Field(None, ge=0, le=50)
    amh:           Optional[float] = Field(None, ge=0, le=20)
    fasting_sugar: Optional[float] = Field(None, ge=50, le=400)

# ── Helpers ───────────────────────────────────────────────────────────────────
def get_risk_category(prob: float) -> str:
    if prob < 0.33: return "Low"
    if prob < 0.66: return "Moderate"
    return "High"

def get_interpretation(cat):
    return {
        "Low":      "The assessment suggests a low probability of PCOS. No strong predictive indicators identified. Maintaining healthy lifestyle practices remains important for long-term hormonal and metabolic well-being.",
        "Moderate": "Your assessment indicates a moderate probability of PCOS based on lifestyle patterns and symptom indicators. Early attention to these patterns may help prevent progression and support long-term reproductive health.",
        "High":     "The assessment indicates a high probability of PCOS based on multiple influential lifestyle and clinical indicators. A comprehensive clinical evaluation is strongly recommended.",
    }[cat]

def get_category_recommendation(cat):
    return {
        "Low":      "Continue balanced nutrition, regular exercise, and routine health checkups. If new symptoms arise, seek medical advice.",
        "Moderate": "Strengthen lifestyle habits: balanced diet, regular physical activity, and monitoring menstrual cycle regularity. Consult a healthcare provider if symptoms persist.",
        "High":     "A comprehensive clinical evaluation is strongly recommended. Consult a gynecologist or endocrinologist for hormonal testing and metabolic screening.",
    }[cat]

def get_government_schemes(age: int, category: str):
    schemes = []
    if category in ("Moderate", "High"):
        schemes.append({"scheme_name": "Ayushman Bharat (PM-JAY)", "category": "Insurance",
            "benefit": "Health insurance coverage up to ₹5 lakh per family per year."})
    if category == "High":
        schemes.append({"scheme_name": "State Government Health Insurance Scheme", "category": "Insurance",
            "benefit": "Additional hospitalization and diagnostic coverage."})
    if 18 <= age <= 40:
        schemes.append({"scheme_name": "Janani Suraksha Yojana (JSY)", "category": "Maternal Health",
            "benefit": "Financial assistance for maternal healthcare services."})
        schemes.append({"scheme_name": "Pradhan Mantri Matru Vandana Yojana (PMMVY)", "category": "Maternal Health",
            "benefit": "Cash incentive for pregnant and lactating women."})
    if 10 <= age <= 19:
        schemes.append({"scheme_name": "Rashtriya Kishor Swasthya Karyakram (RKSK)", "category": "Adolescent Health",
            "benefit": "Adolescent reproductive and hormonal health support."})
    if category in ("Moderate", "High"):
        schemes.append({"scheme_name": "Free Diagnostic Services Initiative", "category": "Diagnostic Support",
            "benefit": "Free or subsidized hormone tests (LH, FSH, AMH) and blood sugar testing."})
    return schemes

def generate_recommendations(category, contributors, data: LifestyleInput, bmi):
    dominant = {c["feature"] for c in contributors}
    lifestyle, monitoring, clinical = [], [], []
    if "Fast Food" in dominant or bmi >= 25:
        lifestyle += [
            "Focus on nutrient-dense whole foods that support metabolic balance.",
            "Fruits rich in antioxidants (berries, pomegranate, guava) support hormonal health.",
            "Include leafy vegetables: spinach, fenugreek, broccoli, carrots.",
            "Add flaxseeds, chia seeds, pumpkin seeds for omega-3 and zinc.",
            "Choose lean proteins: eggs, lentils, tofu, fish, skinless poultry.",
            "Limit ultra-processed foods and sugary beverages.",
        ]
        monitoring.append("Monitor weight and waist circumference monthly.")
    if "Regular Exercise" in dominant or data.regular_exercise == 0:
        lifestyle += [
            "Aim for 30 min of brisk walking, cycling, or yoga most days.",
            "Strength training twice weekly improves insulin sensitivity.",
        ]
    if "Cycle Length" in dominant or data.cycle_length > 35:
        monitoring.append("Track menstrual cycles regularly using a cycle-tracking tool.")
        clinical.append("If irregular cycles persist, consult a gynaecologist for hormonal evaluation.")
    if data.hair_growth or data.hair_loss or data.pimples:
        clinical.append("Discuss acne, hair growth, or hair thinning with a healthcare provider.")
    if data.skin_darkening or (data.fasting_sugar and data.fasting_sugar > 100):
        clinical.append("Consider metabolic screening including fasting glucose and insulin resistance.")
    if category == "High":
        clinical.append("Comprehensive clinical evaluation with a gynaecologist is strongly recommended.")
    if not monitoring: monitoring.append("Monitor weight and waist circumference monthly.")
    if not clinical:   clinical.append("If new symptoms develop, consult a qualified healthcare professional.")
    return {"lifestyle_optimization": lifestyle, "monitoring_tracking": monitoring, "clinical_considerations": clinical}

# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/")
def root(): return {"message": "OvaInsight Backend Running", "version": "2.0"}

@app.get("/health")
def health(): return {"status": "ok", "lifestyle_model": lifestyle_model is not None, "clinical_model": clinical_model is not None}

@app.post("/predict/lifestyle")
def predict_lifestyle(data: LifestyleInput):
    try:
        bmi = data.weight / ((data.height / 100) ** 2)
        # Build input matching EXACT feature order from lifestyle_features.pkl
        # ['Age_yrs','Weight_Kg','HeightCm','BMI','Weight_gainY_N','hair_growthY_N',
        #  'Hair_lossY_N','PimplesY_N','Skin_darkening_Y_N','Fast_food_Y_N','RegExerciseY_N','Cycle_lengthdays']
        values = [
            data.age, data.weight, data.height, round(bmi, 2),
            data.weight_gain, data.hair_growth, data.hair_loss,
            data.pimples, data.skin_darkening, data.fast_food,
            data.regular_exercise, data.cycle_length
        ]
        input_df = pd.DataFrame([values], columns=lifestyle_features)

        lifestyle_prob = float(lifestyle_model.predict_proba(input_df)[0][1])

        # SHAP-style contribution scoring
        feature_display = ["Age", "Weight", "Height", "BMI", "Weight Gain",
                           "Hair Growth", "Hair Loss", "Pimples", "Skin Darkening",
                           "Fast Food", "Regular Exercise", "Cycle Length"]
        importances = lifestyle_model.feature_importances_
        total = importances.sum() or 1
        contributors_raw = [
            {"feature": feat, "percentage": round(float(imp/total*100), 2),
             "direction": "increase" if imp > 0 else "decrease"}
            for feat, imp in zip(feature_display, importances)
        ]
        contributors = sorted(contributors_raw, key=lambda x: x["percentage"], reverse=True)[:5]

        behavioral_features = {"Weight","BMI","Weight Gain","Fast Food","Regular Exercise"}
        clinical_features_set = {"Skin Darkening","Hair Growth","Hair Loss","Pimples","Cycle Length"}
        behavioral = [c for c in contributors if c["feature"] in behavioral_features]
        clinical_s = [c for c in contributors if c["feature"] in clinical_features_set]

        # Clinical adjustment layer
        clinical_adjustment = 0.0
        if data.lh and data.fsh and data.fsh != 0:
            if (data.lh / data.fsh) > 2: clinical_adjustment += 0.07
        if data.amh and data.amh > 4: clinical_adjustment += 0.07
        if data.fasting_sugar and data.fasting_sugar > 100: clinical_adjustment += 0.05

        refined_prob = min(lifestyle_prob + clinical_adjustment, 1.0)
        category = get_risk_category(refined_prob)
        recs = generate_recommendations(category, contributors, data, bmi)

        return {
            "lifestyle_risk_probability":      round(lifestyle_prob * 100, 2),
            "clinical_adjustment":             round(clinical_adjustment * 100, 2),
            "final_refined_risk_probability":  round(refined_prob * 100, 2),
            "final_risk_category":             category,
            "bmi":                             round(bmi, 2),
            "interpretation":                  get_interpretation(category),
            "category_recommendation":         get_category_recommendation(category),
            "personalized_recommendations":    recs,
            "behavioral_metabolic_factors":    behavioral,
            "clinical_sign_indicators":        clinical_s,
            "government_schemes":              get_government_schemes(data.age, category),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
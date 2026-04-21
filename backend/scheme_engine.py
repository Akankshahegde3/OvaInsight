# scheme_engine.py

def get_government_schemes(age: int, risk_category: str):
    """
    Rule-based mapping of government schemes
    based on age and final risk category.
    """

    schemes = []

    # ------------------------------
    # 1️⃣ Insurance Schemes
    # ------------------------------

    # Ayushman Bharat (PM-JAY)
    if risk_category in ["Moderate", "High"]:
        schemes.append({
            "scheme_name": "Ayushman Bharat (PM-JAY)",
            "category": "Insurance",
            "benefit": "Health insurance coverage up to ₹5 lakh per family per year."
        })

    # State Health Insurance (Generic placeholder)
    if risk_category == "High":
        schemes.append({
            "scheme_name": "State Government Health Insurance Scheme",
            "category": "Insurance",
            "benefit": "Additional hospitalization and diagnostic coverage."
        })

    # ------------------------------
    # 2️⃣ Reproductive / Maternal Schemes
    # ------------------------------

    # Janani Suraksha Yojana
    if 18 <= age <= 40:
        schemes.append({
            "scheme_name": "Janani Suraksha Yojana (JSY)",
            "category": "Maternal Health",
            "benefit": "Financial assistance for maternal healthcare services."
        })

    # Pradhan Mantri Matru Vandana Yojana
    if 18 <= age <= 40:
        schemes.append({
            "scheme_name": "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
            "category": "Maternal Health",
            "benefit": "Cash incentive for pregnant and lactating women."
        })

    # ------------------------------
    # 3️⃣ Adolescent Health Scheme
    # ------------------------------

    if 10 <= age <= 19:
        schemes.append({
            "scheme_name": "Rashtriya Kishor Swasthya Karyakram (RKSK)",
            "category": "Adolescent Health",
            "benefit": "Adolescent reproductive and hormonal health support."
        })

    # ------------------------------
    # 4️⃣ Diagnostic Support Scheme
    # ------------------------------

    if risk_category in ["Moderate", "High"]:
        schemes.append({
            "scheme_name": "Free Diagnostic Services Initiative",
            "category": "Diagnostic Support",
            "benefit": "Free or subsidized hormone tests (LH, FSH, AMH) and blood sugar testing."
        })

    return schemes
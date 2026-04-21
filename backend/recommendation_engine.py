

def generate_personalized_recommendations(
    category,
    top_contributors,
    data,
    bmi
):
    """
    Generates structured, feature-aware recommendations.
    """

    lifestyle_blocks = []
    monitoring_blocks = []
    clinical_blocks = []

    dominant_features = {item["feature"] for item in top_contributors}

    # -----------------------------------
    # Nutrition & Weight Logic
    # -----------------------------------
    
    if "Fast Food" in dominant_features or bmi >= 25:
        lifestyle_blocks.append(
            "Focus on nutrient-dense whole foods that support metabolic balance."
        )

        lifestyle_blocks.append(
            "Fruits rich in antioxidants and vitamin C such as berries, oranges, pomegranate, and guava may support overall hormonal health."
        )

        lifestyle_blocks.append(
            "Include leafy vegetables like spinach, fenugreek leaves, broccoli, and carrots for fiber and micronutrient support."
        )

        lifestyle_blocks.append(
            "Add healthy seeds such as flaxseeds, chia seeds, and pumpkin seeds which provide omega-3 fatty acids and zinc."
        )

        lifestyle_blocks.append(
            "Choose lean protein sources like eggs, lentils, chickpeas, tofu, fish, or skinless poultry to support insulin stability."
        )

        lifestyle_blocks.append(
            "Limit ultra-processed food and sugary beverages to reduce metabolic strain."
        )

        monitoring_blocks.append(
            "Monitor weight and waist circumference monthly to observe gradual metabolic improvements."
        )

    # -----------------------------------
    # Physical Activity Logic
    # -----------------------------------
    if "Regular Exercise" in dominant_features or data.regular_exercise == 0:
        lifestyle_blocks.append(
            "Aim for at least 30 minutes of brisk walking, cycling, yoga, or strength training on most days of the week."
        )

        lifestyle_blocks.append(
            "Strength training twice weekly can help improve insulin sensitivity and metabolic function."
        )

    # -----------------------------------
    # Menstrual Irregularity Logic
    # -----------------------------------
    if "Cycle Length" in dominant_features or data.cycle_length > 35:
        monitoring_blocks.append(
            "Track menstrual cycles regularly using a cycle tracking tool."
        )
        clinical_blocks.append(
            "If irregular cycles persist for several months, consider consulting a gynecologist for hormonal evaluation."
        )

    # -----------------------------------
    # Hyperandrogenic Signs
    # -----------------------------------
    if (
        data.hair_growth == 1
        or data.hair_loss == 1
        or data.pimples == 1
    ):
        clinical_blocks.append(
            "Discuss symptoms such as acne, hair growth, or hair thinning with a healthcare provider to evaluate hormonal balance."
        )

    # -----------------------------------
    # Metabolic Screening Logic
    # -----------------------------------
    if (
        data.skin_darkening == 1
        or (data.fasting_sugar is not None and data.fasting_sugar > 100)
    ):
        clinical_blocks.append(
            "Consider metabolic screening including fasting glucose and insulin resistance evaluation."
        )

    # -----------------------------------
    # Category-Level Safety Add-On
    # -----------------------------------
    if category == "High":
        clinical_blocks.append(
            "A comprehensive clinical evaluation with a gynecologist or endocrinologist is strongly recommended."
        )

    # -----------------------------------
    # Default Safety Fallbacks
    # -----------------------------------

    if not monitoring_blocks:
        monitoring_blocks.append(
            "Monitor weight and waist circumference monthly to observe gradual metabolic trends."
        )

    if not clinical_blocks:
        clinical_blocks.append(
            "If new symptoms develop or menstrual irregularity persists, consider consulting a qualified healthcare professional."
        )

    return {
        "lifestyle_optimization": lifestyle_blocks,
        "monitoring_tracking": monitoring_blocks,
        "clinical_considerations": clinical_blocks
    }

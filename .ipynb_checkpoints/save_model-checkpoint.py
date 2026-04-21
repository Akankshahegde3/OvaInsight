import joblib
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier

# Load dataset
df = pd.read_excel(
    "data/raw/PCOS_data_without_infertility.xlsx",
    sheet_name="Full_new"
)

# Clean column names
df.columns = df.columns.str.strip()
df.columns = df.columns.str.replace(" ", "_")
df.columns = df.columns.str.replace("(", "", regex=False)
df.columns = df.columns.str.replace(")", "", regex=False)
df.columns = df.columns.str.replace("/", "_")

# Drop ID columns
df = df.drop(columns=["Sl._No", "Patient_File_No."], errors="ignore")

# Automatically detect PCOS column
target_column = None
for col in df.columns:
    if "PCOS" in col.upper():
        target_column = col
        break

if target_column is None:
    raise ValueError("PCOS column not found!")

print("Detected target column:", target_column)

# Convert ALL columns to numeric (fixes '1.99.' issue)
for col in df.columns:
    if col != target_column:
        df[col] = pd.to_numeric(df[col], errors="coerce")

# Separate features and target
X = df.drop(target_column, axis=1)
y = df[target_column]

# Impute missing values
imputer = SimpleImputer(strategy="median")
X_imputed = imputer.fit_transform(X)

# Train model
rf_model = RandomForestClassifier(random_state=42)
rf_model.fit(X_imputed, y)

# Save everything
joblib.dump(rf_model, "models/rf_model.pkl")
joblib.dump(imputer, "models/imputer.pkl")
joblib.dump(X.columns.tolist(), "models/feature_names.pkl")

print("Model saved successfully!")
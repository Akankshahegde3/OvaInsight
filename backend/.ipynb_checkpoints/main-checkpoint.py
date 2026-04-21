from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from schemas import LifestyleInput
from risk_engine import predict_lifestyle_risk

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"message": "OvaInsight Backend Running"}

from fastapi import HTTPException

@app.post("/predict/lifestyle")
def predict_lifestyle(data: LifestyleInput):
    try:
        result = predict_lifestyle_risk(data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


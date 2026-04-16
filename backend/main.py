from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from logic.extract_logs import convert_ulog_to_csv
from logic.calculate_coverage import run_coverage_analysis

app = FastAPI()

# Folder Data Checking
if not os.path.exists("data"):
    os.makedirs("data")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
async def root():
    return {"message": "Backend API is running! /analyze"}

@app.post("/analyze")
async def analyze_flight(file: UploadFile = File(...)):
    file_path = os.path.join("data", file.filename)

    try:
        # Save File
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process uLog File to CSV
        csv_path = convert_ulog_to_csv(file_path)

        if csv_path:
            analysis_result = run_coverage_analysis(csv_path)

            return {
                "status": "success",
                "data": {
                    "total_area_coverage": f"{round(analysis_result['area'], 2)} Ha",
                    "monitoring_efficiency": f"{round(analysis_result['eff'], 2)} %",
                    "polygon": analysis_result['polygon'],
                    "starting_point": [analysis_result['s_lat'], analysis_result['s_lon']]
                }
            }
        
        return {"status": "error", "message": "Failed to process uLog file."}

    except Exception as e:
        return {"status": "error", "message": str(e)}
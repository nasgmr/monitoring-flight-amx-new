from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import os

from logic.extract_logs import convert_ulog_to_csv
from logic.calculate_coverage import run_coverage_analysis
from logic.export_to_kml import create_kml
from logic.export_to_pdf import create_pdf

app = FastAPI()

if not os.path.exists("data"):
    os.makedirs("data")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Backend API is running! /analyze"}

@app.post("/analyze")
async def analyze_flight(file: UploadFile = File(...)):
    file_path = os.path.join("data", file.filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        csv_path = convert_ulog_to_csv(file_path)

        if csv_path:
            analysis_result = run_coverage_analysis(csv_path)
            
            analysis_data_for_export = {
                "total_area_coverage": f"{round(analysis_result['area'], 2)} Ha",
                "monitoring_efficiency": f"{round(analysis_result['eff'], 2)} %",
                "polygon": analysis_result['polygon'] # Ini yang penting buat staticmap
            }

            create_kml(analysis_result['polygon'], filename="flight_report.kml")
            
            create_pdf(analysis_data_for_export, filename="flight_report.pdf")

            return {
                "status": "success",
                "data": {
                    "total_area_coverage": analysis_data_for_export["total_area_coverage"],
                    "monitoring_efficiency": analysis_data_for_export["monitoring_efficiency"],
                    "polygon": analysis_result['polygon'],
                    "starting_point": [analysis_result['s_lat'], analysis_result['s_lon']]
                }
            }
        
        return {"status": "error", "message": "Failed to process uLog file."}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    
@app.get("/download/kml")
async def download_kml():
    file_path = "flight_report.kml"
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename="AMX_Flight_Report.kml")
    return {"error": "File KML tidak ditemukan"}

@app.get("/download/pdf")
async def download_pdf():
    file_path = "flight_report.pdf"
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename="AMX_Monitoring_Report.pdf")
    return {"error": "File PDF tidak ditemukan"}
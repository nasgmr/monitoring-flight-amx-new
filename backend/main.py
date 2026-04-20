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
    if not os.path.exists("data"):
        os.makedirs("data")

    file_path = os.path.join("data", file.filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        csv_path, flight_metrics = convert_ulog_to_csv(file_path)

        if csv_path and flight_metrics:
            analysis_result = run_coverage_analysis(csv_path)
            
            final_data = {
                "total_area_coverage": f"{round(analysis_result['area'], 2)} Ha",
                "flight_duration": flight_metrics["flight_duration"],
                "total_distance": flight_metrics["total_distance"],
                "average_altitude": flight_metrics["average_altitude"],
                "polygon": analysis_result['polygon']
            }

            create_kml(final_data['polygon'], filename="flight_report.kml")
            create_pdf(final_data, filename="flight_report.pdf")

            return {
                "status": "success",
                "data": {
                    **final_data,
                    "starting_point": [analysis_result['s_lat'], analysis_result['s_lon']]
                }
            }
        
        return {"status": "error", "message": "Failed to process uLog file."}

    except Exception as e:
        return {"status": "error", "message": str(e)}
    
@app.get("/download/kml")
async def download_kml():
    return FileResponse(path="flight_report.kml", filename="Flight_Report.kml")

@app.get("/download/pdf")
async def download_pdf():
    return FileResponse(path="flight_report.pdf", filename="Flight_Report.pdf")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
from fpdf import FPDF
from datetime import datetime
import os

def create_pdf(analysis_data, filename="flight_report.pdf"):
    try:
        pdf = FPDF()
        pdf.add_page()
        
        # Header
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(0, 10, "FLIGHT MONITORING REPORT", ln=True, align='C')
        pdf.set_font("Arial", size=10)
        pdf.cell(0, 10, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align='C')
        pdf.ln(10)
        
        # Results Table
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(80, 10, "Parameter", border=1)
        pdf.cell(80, 10, "Value", border=1, ln=True)
        
        pdf.set_font("Arial", size=11)
        metrics = [
            ("Total Area Coverage", analysis_data['total_area_coverage']),
            ("Flight Duration", analysis_data['flight_duration']),
            ("Total Distance", analysis_data['total_distance']),
            ("Average Altitude", analysis_data['average_altitude']),
        ]
        
        for label, val in metrics:
            pdf.cell(80, 10, label, border=1)
            pdf.cell(80, 10, val, border=1, ln=True)
        
        pdf.output(filename)
        return True
    except Exception as e:
        print(f"Error PDF: {e}")
        return False
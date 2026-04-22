# AMX UAV - Flight Monitoring Dashboard

A web-based dashboard designed to analyze and monitor drone flight log data from `.ulg` files. This system automatically calculates key flight metrics, including area coverage, flight duration, total distance, and average altitude.

## Main Features
- **ULog Analysis:** Precision extraction of flight metrics from raw drone log files.
- **Dynamic Mapping:** Interactive visualization of flight paths and polygons using a dynamic map interface.
- **Responsive Design:** Optimized for a seamless experience across all devices (Desktop, Tablet, and Smartphone).
- **Session Persistence:** Analysis results remain available even after page refreshes (powered by `sessionStorage`).
- **High Capacity:** Capable of processing large `.ulg` files up to 100MB.
- **Data Export:** Generate and download flight reports in KML and PDF formats.

## Tech Stack
- **Frontend:** Next.js (TypeScript), Dynamic Leaflet Map.
- **Backend:** Flask (Python), ULog Parser.
- **Styling:** CSS-in-JS (Responsive Inline Styles).

## 🚀 How to Run

## 1. Backend Setup (Port 5000)
Ensure Python is installed, then run the following commands in the backend folder:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Use `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python app.py
```

## 2. Frontend Setup (Port 3000 / 8000)
Ensure Node.js is installed, then run the following commands in the frontend folder:
```bash
cd frontend
npm install
npm run dev
```

## Usage Notes
- Upload files exclusively with the `.ulg` extension.
- Maximum file size supported is 100MB.
- Ensure the backend service is running at http://localhost:5000 to enable analysis and download features.

---
© CV AMX UAV Technologies
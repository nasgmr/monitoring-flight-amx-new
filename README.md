# AMX UAV — Flight Monitoring Dashboard

A web-based dashboard to analyze and monitor drone flight log data from `.ulg` files. The system automatically extracts key flight metrics, visualizes the flight path on an interactive map, and exports reports in KML and PDF formats.

---

## ✨ Features

- **ULog Analysis** — Extracts flight metrics (area coverage, duration, distance, altitude) from raw `.ulg` drone log files
- **Interactive Map** — Visualizes flight path and coverage polygon using Leaflet
- **Data Export** — Download flight reports in KML and PDF formats
- **Session Persistence** — Analysis results persist across page refreshes via `sessionStorage`
- **Responsive Design** — Works across desktop, tablet, and mobile
- **Large File Support** — Handles `.ulg` files up to 100MB

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (TypeScript), React 18, Tailwind CSS |
| Map | Leaflet + React-Leaflet |
| HTTP Client | Axios |
| Backend | FastAPI (Python) |
| ULog Parsing | pyulog |
| Data Processing | pandas, numpy, scipy |
| Export | simplekml, reportlab |
| Deployment | Docker (Hugging Face Spaces) |

---

## 📁 Project Structure

```
monitoring-flight-amx-new/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Main dashboard page
│   │   │   └── layout.tsx      # Root layout
│   │   ├── components/
│   │   │   └── map.tsx         # Leaflet map component
│   │   └── services/
│   │       └── api.ts          # Axios API client
│   └── package.json
└── backend/
    ├── main.py                 # FastAPI app & endpoints
    ├── requirements.txt
    ├── Dockerfile
    └── logic/
        ├── extract_logs.py     # ULog → CSV conversion
        ├── calculate_coverage.py  # Flight metrics calculation
        ├── export_to_kml.py    # KML export
        └── export_to_pdf.py    # PDF export
```

---

## 🚀 Getting Started

### Prerequisites

- Python `>= 3.10`
- Node.js `>= 18`

### 1. Backend Setup (Port 7860)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```

Backend will be running at: [http://localhost:7860](http://localhost:7860)

### 2. Frontend Setup (Port 8000)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at: [http://localhost:8000](http://localhost:8000)

---

## ⚙️ Environment Variables

Create a `.env.local` file inside the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:7860
```

If not set, the frontend defaults to `http://localhost:7860`.

---

## 📜 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/analyze` | Upload & analyze a `.ulg` file |
| `GET` | `/download/kml` | Download KML report |
| `GET` | `/download/pdf` | Download PDF report |

---

## 🐳 Docker (Backend)

```bash
cd backend
docker build -t amx-flight-backend .
docker run -p 7860:7860 amx-flight-backend
```

---

## 📌 Usage Notes

- Only `.ulg` files are accepted
- Maximum file size: **100MB**
- Make sure the backend is running before uploading a file

---

© CV AMX UAV Technologies

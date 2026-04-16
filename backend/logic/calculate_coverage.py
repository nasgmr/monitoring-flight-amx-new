import pandas as pd
import numpy as np
from scipy.spatial import ConvexHull

def run_coverage_analysis(csv_filepath, grid_size=10):
    """
    Calculate coverage area (Convex Hull) and monitoring efficiency
    based on GPS drone coordinates
    """
    print(f"[INFO] Coverage analysis for: {csv_filepath}")

    # Read Data
    df = pd.read_csv(csv_filepath)

    # Extract Coordinates (lat, lon)
    # lat/lon multiplied by 1e7
    latitudes = df['lat'].values / 1e7 if df['lat'].max() > 1000 else df['lat'].values
    longitudes = df['lon'].values / 1e7 if df['lon'].max() > 1000 else df['lon'].values

    # Join into 2D array
    points = np.column_stack((latitudes, longitudes))

    # Calculate Convex Hull
    try:
        hull = ConvexHull(points)
        # Take The Outermost Corner Points That Form a Polygon
        polygon_points = points[hull.vertices]

        # Calculate Area
        # degree to meter conversion; 1 degree latitude ~ 111.320 meters; 1 Ha = 10.000 m^2
        LAT_TO_METER = 111320
        # Volume Convex Hull in 2D = Polygon Area (degree^2)
        area_deg_squared = hull.volume
        area_m_squared = area_deg_squared * (LAT_TO_METER ** 2)
        area_ha = area_m_squared / 10000.0

        # Calculate Efficiency (Simple Mockup)
        # Efficiency = (Total Area Covered / Convex Hull Area) * 100
        grid_count = len(df)
        covered_area_m2 = grid_count * (grid_size ** 2)
        efficiency = min(100.0, (covered_area_m2 / area_m_squared) * 100) if area_m_squared > 0 else 0

        print(f"[SUCCESS] Analysis complete. Area: {area_ha:.2f} Ha")

        # Return as Pure Dictionary for FastAPI
        return{
            "area": area_ha,
            "eff": efficiency,
            "s_lat": latitudes[0], 
            "s_lon": longitudes[0],
            "df": df,
            "polygon": polygon_points.tolist()
        }
    
    except Exception as e:
        print(f"[ERROR] Failed to calculate Convex Hull: {e}")
        # Return Fallback
        return {
            "area": 0, "eff": 0, "s_lat": 0, "s_lon": 0, "df": pd.DataFrame(), "polygon": []
        }
import os
import pandas as pd
import numpy as np
from pyulog import ULog

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1, phi2 = np.radians(lat1), np.radians(lat2)
    delta_phi = np.radians(lat2 - lat1)
    delta_lambda = np.radians(lon2 - lon1)
    a = np.sin(delta_phi/2)**2 + np.cos(phi1) * np.cos(phi2) * np.sin(delta_lambda/2)**2
    return R * (2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a)))


def convert_ulog_to_csv(ulog_filepath, output_dir="data"):
    """
    Read .ulg file and extract 'vehicle_global_position'
    to CSV form for further analysis.
    """
    print(f"[INFO] Starting file extraction: {ulog_filepath}")

    try:
        # Load File ULog
        ulog = ULog(ulog_filepath)

        # Extract Global GPS Data
        data = ulog.data_list

        gps_data = None
        for d in data:
            if d.name == 'vehicle_global_position':
                gps_data = d.data
                break

        if gps_data is None:
            return None, None

        # Convert to DataFrame Pandas
        df = pd.DataFrame({
            'timestamp': gps_data['timestamp'],
            'lat': gps_data['lat'],
            'lon': gps_data['lon'],
            'alt': gps_data['alt']
        })

        # Flight Duration (ms to min/sec)
        duration_sec = (df['timestamp'].iloc[-1] - df['timestamp'].iloc[0]) / 1e6
        mins = int(duration_sec // 60)
        secs = int(duration_sec % 60)
        flight_duration = f"{mins} min {secs} sec"

        # Total Distance
        lat_arr = df['lat'].values
        lon_arr = df['lon'].values
        distances = haversine_distance(lat_arr[:-1], lon_arr[:-1], lat_arr[1:], lon_arr[1:])
        total_dist_m = np.sum(distances)
        total_distance = f"{round(total_dist_m / 1000, 2)} km"

        # Average Altitude
        avg_alt = f"{round(df['alt'].mean(), 1)} m"

        metrics = {
            "flight_duration": flight_duration,
            "total_distance": total_distance,
            "average_altitude": avg_alt
        }

        csv_path = ulog_filepath.replace('.ulg', '.csv')
        df.to_csv(csv_path, index=False)

        return csv_path, metrics
    
    except Exception as e:
        print(f"Error: {e}")
        return None, None
import os
import pandas as pd
from pyulog import ULog

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
        data = ulog.get_dataset('vehicle_global_position')

        # Convert to DataFrame Pandas
        df = pd.DataFrame(data.data)

        # Name Output CSV File
        base_name = os.path.basename(ulog_filepath).replace('.ulg', '')
        csv_filename = f"{base_name}_gps.csv"
        csv_filepath = os.path.join(output_dir, csv_filename)

        # Save to CSV
        df.to_csv(csv_filepath, index=False)
        print(f"[SUCCESS] Data successfully extracted to: {csv_filepath}")


        return csv_filepath
    
    except Exception as e:
        print(f"[ERROR] Failed to extract ULog: {e}")
        return None
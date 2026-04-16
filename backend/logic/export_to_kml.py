import pandas as pd
import simplekml
import numpy as np

GRID_SIZE = 10
LAT_TO_METER = 111320
AVG_LAT = -7.78 
LON_TO_METER = LAT_TO_METER * np.cos(np.radians(AVG_LAT))

df = pd.read_csv('unique_tiles.csv')

df_path = pd.read_csv('drone_path.csv')
start_lat = df_path['lat'].iloc[0] * 1e7
start_lon = df_path['lon'].iloc[0] * 1e7

kml = simplekml.Kml()
style = simplekml.Style()
style.polystyle.color = '40ff0000'
style.linestyle.width = 1
style.linestyle.color = 'ffffffff'

print(f"Converting {len(df)} tiles to KML...")

for index, row in df.iterrows():
    x_min = row['grid_x'] * GRID_SIZE
    y_min = row['grid_y'] * GRID_SIZE
    x_max = x_min + GRID_SIZE
    y_max = y_min + GRID_SIZE
    
    def to_gps(x, y):
        lon = (x / LON_TO_METER) + start_lon
        lat = (y / LAT_TO_METER) + start_lat
        return (lon, lat)

    p1 = to_gps(x_min, y_min)
    p2 = to_gps(x_max, y_min)
    p3 = to_gps(x_max, y_max)
    p4 = to_gps(x_min, y_max)
    
    pol = kml.newpolygon(name=f"Tile {index}")
    pol.outerboundaryis = [p1, p2, p3, p4, p1]
    pol.style = style

output_file = "AMX_Coverage_Area.kml"
kml.save(output_file)
print(f"Success! File saved as: {output_file}")
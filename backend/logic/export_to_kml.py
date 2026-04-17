import simplekml

def create_kml(polygon_coords, filename="flight_report.kml"):
    """
    Mengonversi koordinat polygon menjadi file KML untuk divisualisasikan di Google Earth.
    polygon_coords: List of [lat, lon]
    """
    try:
        kml = simplekml.Kml()
        
        style = simplekml.Style()
        style.polystyle.color = '4d00ffff'
        style.polystyle.fill = 1
        style.polystyle.outline = 1

        if polygon_coords and len(polygon_coords) > 0:
            kml_coords = [(lon, lat) for lat, lon in polygon_coords]
            
            if kml_coords[0] != kml_coords[-1]:
                kml_coords.append(kml_coords[0])

            pol = kml.newpolygon(name="AMX Flight Coverage Area")
            pol.outerboundaryis = kml_coords
            pol.style = style

        # Simpan file
        kml.save(filename)
        return True
    except Exception as e:
        print(f"Error creating KML: {e}")
        return False
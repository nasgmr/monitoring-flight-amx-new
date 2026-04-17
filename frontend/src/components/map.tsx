"use client";
import { MapContainer, TileLayer, Polygon, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Fixed Icon Marker Issue
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component for camera view of map to drone position
function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] !== 0) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, map]);
  return null;
}

export default function MapView({ polygon, startPoint }: { polygon: [number, number][], startPoint: [number, number] }) {
    return (
        <div style={{ height: '100%', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer
                center={startPoint || [-7.774, 110.374]}
                zoom={17}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {/* Polygon Coverage Area */}
                {polygon && polygon.length > 0 && (
                    <Polygon
                        positions={polygon}
                        pathOptions={{
                            color: '#FFDD00',
                            fillColor: '#FFDD00',
                            fillOpacity: 0.3,
                            weight: 3
                        }}
                    />
                )}

                {/* Start Point Marker */}
                {startPoint && startPoint[0] !== 0 && <Marker position={startPoint} icon={icon} />}

                <RecenterMap coords={startPoint} />
            </MapContainer>
        </div>
    );
}
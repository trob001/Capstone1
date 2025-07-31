"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Define your clinic type
interface Clinic {
  OBJECTID: number;
  NAME: string;
  LAT: number;
  LON: number;
  [key: string]: any; // optional if you have more keys
}

// Dynamic import for Leaflet (must be done this way for Next.js)
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), {
  ssr: false,
});

import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default icon fix (important for Leaflet in Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

const DynamicClinicMap = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await fetch("/data/clinics_fixed.json");
        if (!res.ok) throw new Error("Failed to load clinic data");
        const data: Clinic[] = await res.json();
        setClinics(data);
      } catch (error) {
        console.error("Error fetching clinics:", error);
      }
    };

    fetchClinics();
  }, []);

  return (
    <div className="h-[500px] w-full rounded-xl shadow-md overflow-hidden">
      <MapContainer center={[40.73061, -73.935242]} zoom={10} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {clinics.map((clinic) => (
          <Marker key={clinic.OBJECTID} position={[clinic.LAT, clinic.LON]}>
            <Popup>
              <strong>{clinic.NAME}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DynamicClinicMap;

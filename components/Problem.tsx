"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
// Removed external UI library imports in favor of native HTML select

// Only import leaflet on the client side
let L: typeof import('leaflet');
if (typeof window !== 'undefined') {
  require('leaflet/dist/leaflet.css');
  L = require('leaflet');  

  // Fix for default marker icons in React Leaflet
  const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  L.Marker.prototype.options.icon = DefaultIcon;
}

const Arrow = ({ extraStyle }: { extraStyle: string }) => {
  return (
    <svg
      className={`shrink-0 w-12 fill-neutral-content opacity-70 ${extraStyle}`}
      viewBox="0 0 138 138"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 10 L128 69 L10 128 Z"
        fill="currentColor"
      />
    </svg>
  );
};

// We'll use the LatLngTuple type from the Leaflet instance to avoid type conflicts

// Dynamically import the Map components with SSR disabled
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
  }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Clinic {
  OBJECTID: number;
  NAME: string;
  BRANCH: string;
  ADDRESS: string;
  CITY: string;
  ZIPCODE: number | string;
  PHONE: string;
  LAT: number;
  LON: number;
  specialties?: string[]; // Added for specialty filtering
  [key: string]: any;  // For other properties we might not explicitly list
}

// Define common medical specialties
const SPECIALTIES = [
  'All Specialties',
  'Primary Care',
  'Dermatology',
  'Cardiology',
  'Pediatrics',
  'Women\'s Health',
  'Mental Health',
  'Dental',
  'Vision',
  'Behavioral Health',
  'HIV/AIDS',
  'Substance Abuse',
  'Geriatrics',
  'Urgent Care'
];

// Map keywords to specialties
const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  'Primary Care': ['health', 'care', 'medical', 'family', 'community', 'wellness'],
  'Dermatology': ['dermatology', 'skin', 'dermatologist'],
  'Cardiology': ['cardiology', 'heart', 'cardiac'],
  'Pediatrics': ['pediatric', 'children', 'kids', 'child'],
  'Women\'s Health': ['women', 'obgyn', 'gynecology', 'maternal', 'prenatal'],
  'Mental Health': ['mental', 'psychiatric', 'psychology', 'counseling', 'therapy'],
  'Dental': ['dental', 'dentist', 'teeth', 'oral'],
  'Vision': ['vision', 'eye', 'optometry', 'ophthalmology'],
  'Behavioral Health': ['behavioral', 'behavior', 'therapy', 'counseling'],
  'HIV/AIDS': ['hiv', 'aids', 'infectious'],
  'Substance Abuse': ['substance', 'rehab', 'recovery', 'addiction', 'drug', 'alcohol'],
  'Geriatrics': ['geriatric', 'senior', 'elderly', 'aging'],
  'Urgent Care': ['urgent', 'emergency', 'immediate']
};

// Function to determine specialties based on clinic name and branch
const determineSpecialties = (clinic: Clinic): string[] => {
  const specialties: string[] = [];
  const searchText = `${clinic.NAME} ${clinic.BRANCH}`.toLowerCase();
  
  for (const [specialty, keywords] of Object.entries(SPECIALTY_KEYWORDS)) {
    if (keywords.some(keyword => searchText.includes(keyword.toLowerCase()))) {
      specialties.push(specialty);
    }
  }
  
  // Default to Primary Care if no specialties matched
  return specialties.length > 0 ? specialties : ['Primary Care'];
};

const DEFAULT_CENTER = [25.7617, -80.1918] as [number, number]; // Type assertion to match LatLngTuple

const Problem = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All Specialties');
  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const loadClinics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/clinics_fixed.json');
        if (!response.ok) {
          throw new Error(`Failed to load clinics: ${response.statusText}`);
        }
        let data: Clinic[] = await response.json();
        
        // Add specialties to each clinic
        data = data.map(clinic => ({
          ...clinic,
          specialties: determineSpecialties(clinic)
        }));
        
        setClinics(data);
        setFilteredClinics(data);
        setError(null);

        if (data.length > 0) {
          setTimeout(() => {
            mapRef.current?.flyTo([data[0].LAT, data[0].LON], 12);
          }, 100);
        }
      } catch (err) {
        console.error('Error loading clinic data:', err);
        setError('Failed to load clinic data. Please try again later.');
      } finally {
        setLoading(false);
        setMapReady(true);
      }
    };

    loadClinics();
  }, []);

  // Function to handle clinic selection from dropdown
  const handleClinicSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const clinicId = event.target.value;
    const clinic = filteredClinics.find(c => c.OBJECTID.toString() === clinicId);
    if (!clinic) return;
    
    setSelectedClinic(clinic);
    if (mapRef.current) {
      mapRef.current.flyTo([clinic.LAT, clinic.LON], 15, {
        duration: 1.5,
        animate: true
      });
    }
  };

  // Function to filter clinics by specialty
  const handleSpecialtyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const specialty = event.target.value;
    setSelectedSpecialty(specialty);
    
    if (specialty === 'All Specialties') {
      setFilteredClinics(clinics);
    } else {
      setFilteredClinics(
        clinics.filter(clinic => 
          clinic.specialties?.includes(specialty)
        )
      );
    }
    
    // Reset selected clinic when changing specialty
    setSelectedClinic(null);
  };

  if (typeof window === 'undefined' || !L || !mapReady || loading) {
    return (
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="h-[500px] w-full rounded-lg bg-gray-100 flex items-center justify-center">
          <p>Loading map data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="h-[500px] w-full rounded-lg bg-red-50 flex items-center justify-center text-red-600">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      <div className="text-center mb-12">
        <p className="font-medium text-primary mb-4">Find Care Nearby</p>
        <h2 className="font-bold text-3xl lg:text-5xl tracking-tight">
          Choose a Miami Clinic Close to You
        </h2>
        <p className="text-lg opacity-80 mt-4 max-w-2xl mx-auto">
          Use our smart map to locate trusted clinics in your area. Click on a marker to learn more.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="specialty-select" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Specialty
          </label>
          <div className="relative">
            <select
              id="specialty-select"
              value={selectedSpecialty}
              onChange={handleSpecialtyChange}
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm appearance-none"
            >
              {SPECIALTIES.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="clinic-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select a Clinic {filteredClinics.length > 0 && `(${filteredClinics.length} found)`}
          </label>
        <div className="relative">
          <select
            id="clinic-select"
            value={selectedClinic?.OBJECTID || ''}
            onChange={handleClinicSelect}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm appearance-none"
          >
            <option value="">Select a clinic...</option>
            {filteredClinics
            .filter(c => c.LAT && c.LON)
            .map((clinic) => (
              <option 
                key={clinic.OBJECTID} 
                value={clinic.OBJECTID}
                className="text-gray-900"
              >
                {clinic.NAME} {clinic.BRANCH ? `- ${clinic.BRANCH}` : ''}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
      
      {selectedSpecialty !== 'All Specialties' && filteredClinics.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
          No clinics found for the selected specialty. Try a different specialty or select "All Specialties".
        </div>
      )}
      
      <div className="h-[500px] w-full rounded-lg overflow-hidden">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
          ref={(map) => {
            if (map) {
              mapRef.current = map;
              // If a clinic is already selected, center the map on it
              if (selectedClinic) {
                map.flyTo([selectedClinic.LAT, selectedClinic.LON], 15);
              }
            }
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredClinics.map((clinic) => {
            const isSelected = selectedClinic?.OBJECTID === clinic.OBJECTID;
            return (
              <Marker
                key={clinic.OBJECTID}
                position={[clinic.LAT, clinic.LON] as [number, number]}
                eventHandlers={{
                  click: () => setSelectedClinic(clinic),
                }}
              >
                <Popup>
                  <div className="text-xs text-gray-500 mb-1">
                    {clinic.specialties?.join(' • ')}
                  </div>
                  <div className="text-sm max-w-[200px]">
                    <h3 className="font-semibold text-base">{clinic.NAME}</h3>
                    {clinic.BRANCH && (
                      <p className="font-medium text-gray-800">{clinic.BRANCH}</p>
                    )}
                    <p className="mt-1 text-gray-700">
                      {clinic.ADDRESS}
                      {clinic.ADDRESS && (clinic.CITY || clinic.ZIPCODE) ? ', ' : ''}
                      {clinic.CITY} {clinic.ZIPCODE}
                    </p>
                    {clinic.PHONE && (
                      <p className="mt-1 text-blue-600">
                        <a href={`tel:${clinic.PHONE}`}>{clinic.PHONE}</a>
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
};

export default Problem;

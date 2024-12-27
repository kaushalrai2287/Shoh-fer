"use client";
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, Polyline, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

// Default Source Location (India Gate, New Delhi)
const center = {
  lat: 28.6129,
  lng: 77.2295,
};

// Default Destination Location (Taj Mahal, Agra)
const destination = {
  lat: 27.1751,
  lng: 78.0421,
};

const TrackDriver = () => {
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriverLocation = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tracklocation/trackdriver?booking_id=1"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch driver location");
        }

        const data = await response.json();
        const { latitude, longitude } = data;

        const newLocation = { lat: latitude, lng: longitude };

        setDriverLocation(newLocation);
        setPath((prevPath) => [...prevPath, newLocation]);
      } catch (err) {
        console.error("Error fetching driver location:", err);
        setError("Failed to fetch driver location");
      }
    };

    // Polling every 5 seconds for live updates
    const interval = setInterval(fetchDriverLocation, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadScript googleMapsApiKey="">
      <h1>Driver Live Tracking</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
        {/* Source Marker */}
        <Marker position={center} label="S" title="Source: India Gate, New Delhi" />

        {/* Driver Marker */}
        {driverLocation && (
          <Marker position={driverLocation} label="D" title="Driver Location" />
        )}

        {/* Destination Marker */}
        <Marker position={destination} label="E" title="Destination: Taj Mahal, Agra" />

        {/* Route Path */}
        {path.length > 1 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 1,
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default TrackDriver;

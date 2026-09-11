"use client";

import { useEffect } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.divIcon({
  className: "wl-marker",
  html: `
    <span class="wl-marker__pulse"></span>
    <span class="wl-marker__pin">
      <span class="wl-marker__core">WL</span>
    </span>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 42],
});

function MapReady({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    if (!map.getPane("wlVeil")) {
      const pane = map.createPane("wlVeil");
      pane.style.zIndex = "350";
      pane.style.pointerEvents = "none";
      const veil = L.DomUtil.create("div", "wl-map-veil", pane);
      veil.style.position = "absolute";
      veil.style.inset = "0";
      veil.style.width = "100%";
      veil.style.height = "100%";
    }

    map.setView([lat, lng], map.getZoom(), { animate: false });
    const timer = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(timer);
  }, [map, lat, lng]);

  return null;
}

export default function WorkshopMap({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const position: [number, number] = [lat, lng];

  return (
    <div className="wl-map h-full w-full">
      <MapContainer
        key={`${lat}-${lng}`}
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
          maxZoom={16}
          className="wl-map-tiles"
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
          className="wl-map-labels"
        />
        <Circle
          center={position}
          radius={90}
          pathOptions={{
            color: "#f0a202",
            weight: 1,
            opacity: 0.5,
            fillColor: "#f0a202",
            fillOpacity: 0.12,
          }}
        />
        <Marker position={position} icon={markerIcon} />
        <MapReady lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerItem from "./MarkerItem"; // Import the MarkerItem component

const MapView = ({ center, listing }) => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { lat, lon } = center;

      if (!mapRef.current) {
        mapRef.current = L.map("map").setView([lat, lon], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(mapRef.current);
      } else {
        mapRef.current.setView([lat, lon], 13);
      }
    }
  }, [center]);

  const handleButtonClick = (address) => {
    console.log(`Button clicked for ${address}`);
    // Add your action here (e.g., navigate or open a modal)
  };
  return (
    <>
      <div id="map" className="h-[500px] w-full" />
      {Array.isArray(listing) &&
        listing.map(
          (
            item // Check if listing is an array
          ) => (
            <MarkerItem
              id={item.id}
              map={mapRef.current}
              lat={parseFloat(item.coordinates.lat)}
              lon={parseFloat(item.coordinates.lon)}
              bedroom={item.bedroom}
              bathroom={item.bathroom}
              imageUrl={item.listingImages[0]?.url}
              address={item.address}
              price={item.price}
              onButtonClick={handleButtonClick}
            />
          )
        )}
    </>
  );
};
export default MapView;

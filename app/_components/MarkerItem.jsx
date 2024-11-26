import React, { useEffect } from "react";
import L from "leaflet";
import ReactDOM from "react-dom/client";

import MarkerListingItem from "./MarkerListingItem";

const MarkerItem = ({
  map,
  lat,
  lon,
  imageUrl,
  address,
  price,
  bedroom,
  bathroom,
  area,
  id,
}) => {
  useEffect(() => {
    if (!map) return; // Pastikan map tersedia

    // Buat marker Leaflet
    const marker = L.marker([lat, lon]).addTo(map);

    // Buat elemen div untuk konten popup
    const popupContent = document.createElement("div");
    popupContent.style.width = "180px";
    popupContent.style.textAlign = "center";

    // Buat objek item yang akan diteruskan ke MarkerListingItem
    const item = {
      id,
      listingImages: [{ url: imageUrl }],
      address,
      price,
      bedroom,
      bathroom,
      area,
    };

    // Gunakan createRoot untuk membuat root dan render komponen
    const root = ReactDOM.createRoot(popupContent);
    root.render(<MarkerListingItem key={item.id} item={item} />);

    // Bind popup ke marker
    marker.bindPopup(popupContent);

    // *Cleanup* saat komponen di-unmount
    return () => {
      // Pastikan popup telah tertutup sebelum unmounting root
      if (map.hasLayer(marker)) {
        marker.remove();
      }
      root.unmount(); // Bersihkan komponen yang di-render dengan unmount
    };
  }, [map, lat, lon, imageUrl, address, price, bedroom, bathroom, area, id]);

  return null; // Marker tidak merender apa pun di DOM
};

export default MarkerItem;

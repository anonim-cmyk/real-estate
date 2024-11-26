"use client";
import React, { useEffect, useState } from "react";
import Listing from "./Listing";
import { supabase } from "@/utils/supabase/client";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapSection.jsx"), { ssr: false });

function ListingMapView({ type }) {
  const [listing, setListing] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [bedCount, setBedCount] = useState(0);
  const [bathCount, setBathCount] = useState(0);
  const [parkingCount, setParkingCount] = useState(0);
  const [homeType, setHomeType] = useState();
  const [mapCenter, setMapCenter] = useState({ lat: -6.2, lon: 106.816666 });
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    getLatestListing();
  }, []);

  const getLatestListing = async () => {
    const { data } = await supabase
      .from("listing")
      .select(`*,listingImages(url, listing_id)`)
      .eq("active", true)
      .eq("type", type)
      .order("id", { ascending: false });

    if (data) {
      setListing(data);
    }
  };

  const handleSearch = async (searchTerm) => {
    let query = supabase
      .from("listing")
      .select(`*,listingImages(url, listing_id)`)
      .eq("active", true)
      .gte("bedroom", bedCount)
      .gte("bathroom", bathCount)
      .gte("parking", parkingCount)
      .eq("type", type)
      .ilike("address", `%${searchTerm}%`)
      .order("id", { ascending: false });

    if (homeType) {
      query = query.eq("propertyType", homeType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      return;
    }
    console.log("Data hasil query:", data);

    if (data && data.length > 0) {
      const validListings = data.filter((item) => {
        const lat = parseFloat(item.coordinates?.lat);
        const lon = parseFloat(item.coordinates?.lon);
        return !isNaN(lat) && !isNaN(lon);
      });

      if (validListings.length > 0) {
        const { lat = -6.2, lon = 106.816666 } = {
          lat: parseFloat(validListings[0].coordinates.lat),
          lon: parseFloat(validListings[0].coordinates.lon),
        };

        setMapCenter({ lat, lon });
      } else {
        console.warn("Tidak ada listing dengan koordinat yang valid.");
      }
    } else {
      console.warn("Pencarian tidak mengembalikan hasil yang valid.");
    }
  };

  const fetchSuggestions = async (searchTerm) => {
    if (searchTerm.length > 1) {
      const { data } = await supabase
        .from("listing")
        .select("address")
        .eq("active", true)
        .eq("type", type)
        .ilike("address", `%${searchTerm}%`)
        .order("id", { ascending: false });
      x;

      setSuggestions(data ? data.map((item) => item.address) : []);
    } else {
      setSuggestions([]);
    }
  };

  const onLocationSelect = (location) => {
    setSelectedLocation(location);
    setMapCenter({ lat: location.lat, lon: location.lon });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div>
        <Listing
          listing={listing}
          onSearch={handleSearch}
          onFetchSuggestions={fetchSuggestions}
          onLocationSelect={onLocationSelect} // Passed here
          selectedLocation={selectedLocation}
          suggestions={suggestions}
          setBedCount={setBedCount}
          setBathCount={setBathCount}
          setParkingCount={setParkingCount}
          setHomeType={setHomeType}
          mapCenter={mapCenter}
          setMapCenter={setMapCenter}
        />
      </div>
      <div className="fixed right-10 h-full md:w-[350px] lg:w-[450px] xl:w-[590px]">
        <MapView center={mapCenter} listing={listing} />
      </div>
    </div>
  );
}

export default ListingMapView;

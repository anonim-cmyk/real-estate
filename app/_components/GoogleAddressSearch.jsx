"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AutoComplete = ({}) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { user } = useUser();
  const [loader, setLoader] = useState(false);
  const router = useRouter(); // gunakan useRouter untuk navigasi

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length > 3) {
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${search}&countrycodes=ID`
          );
          setSuggestions(res.data);
        } catch (error) {
          console.error("Error fetching data from Nominatim API:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounceTimeout);
  }, [search]);

  const handleSuggestionClick = (lat, lon, displayName) => {
    const location = { lat, lon, displayName };
    setSelectedLocation(location);
    setSuggestions([]);
    setSearch(displayName);
  };

  const handleNextClick = async () => {
    setLoader(true);
    if (selectedLocation) {
      const { lat, lon, displayName } = selectedLocation;

      const { data: existingListing, error: selectError } = await supabase
        .from("listing")
        .select("*")
        .eq("address", displayName);

      if (selectError) {
        console.error("Error checking existing data:", selectError);
        setLoader(false);
        return;
      }

      if (existingListing.length > 0) {
        alert("Address already exists in the database.");
        setLoader(false);
        return;
      }

      const newListing = {
        address: displayName,
        coordinates: { lat, lon },
        createdBy: user?.primaryEmailAddress.emailAddress,
      };

      const { data, error } = await supabase
        .from("listing")
        .insert([newListing])
        .select();

      if (error) {
        console.error("Error inserting data:", error);
        toast.error("Error adding address");
      } else {
        console.log("Data successfully inserted:", data);
        toast.success("Address successfully added to the list");

        // Ambil `id` dari data baru dan arahkan ke halaman edit
        const newListingId = data[0].id;
        router.push(`/edit-listing/${newListingId}`);
      }
      setLoader(false);
    } else {
      alert("Please select a location first.");
      setLoader(false);
    }
  };

  return (
    <div style={{ marginBottom: "10px", width: "300px" }}>
      <div className="flex items-center w-full border border-gray-300 rounded-lg mb-2">
        <MapPin className="ml-2 text-primary" size={24} />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search for location"
          className="w-full py-2 px-3 focus:outline-none rounded-r-lg"
        />
      </div>
      <ul>
        {suggestions.length === 0 && search.length > 3 ? (
          <li>No results found</li>
        ) : (
          suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() =>
                handleSuggestionClick(
                  suggestion.lat,
                  suggestion.lon,
                  suggestion.display_name
                )
              }
              style={{ cursor: "pointer", padding: "8px 0", listStyle: "none" }}
            >
              {suggestion.display_name}
            </li>
          ))
        )}
      </ul>
      <Button
        disabled={!selectedLocation || loader}
        className="w-full mt-2"
        onClick={handleNextClick}
      >
        {loader ? <Loader className="animate-spin" /> : "Next"}
      </Button>
    </div>
  );
};

export default AutoComplete;

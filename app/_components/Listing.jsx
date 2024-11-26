"use client";
import { Bath, BedDouble, MapPin, Ruler, Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import FilterSection from "./FilterSection";
import Link from "next/link";

function Listing({
  listing,
  selectedLocation,
  onSearch,
  onFetchSuggestions,
  suggestions,
  setBathCount,
  setBedCount,
  setParkingCount,
  setHomeType,
  setMapCenter,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFetchSuggestions(value);
  };

  const handleSuggestionClick = (address) => {
    setSearchTerm(address);
    onSearch(address).then((location) => {
      if (location) {
        console.log("onLocationSelect called with:", location);
        if (typeof onLocationSelect === "function") {
          onLocationSelect(location);
        }
        setMapCenter({ lat: location.lat, lon: location.lon });
      }
    });
    onFetchSuggestions("");
  };

  const handleSearchClick = () => {
    onSearch(searchTerm).then((location) => {
      if (location) {
        console.log("onLocationSelect called with:", location);
        if (typeof onLocationSelect === "function") {
          onLocationSelect(location);
        }
        setMapCenter({ lat: location.lat, lon: location.lon });
        setSearchTerm(location.address);
      }
    });
  };

  const filteredListing = listing.filter((item) =>
    item.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {selectedLocation && (
        <div className="p-3 mb-4 bg-gray-100 rounded-lg">
          <h3>Selected Location:</h3>
          <p>Address: {selectedLocation.displayName}</p>
          <p>Latitude: {selectedLocation.lat}</p>
          <p>Longitude: {selectedLocation.lon}</p>
        </div>
      )}

      <div className="p-3 flex gap-6 items-center mb-4 relative">
        <div>
          <span className="bg-primary p-3 rounded-lg inline-flex items-center justify-center">
            <MapPin className="text-white h-5 w-5" />
          </span>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search listings by address"
          className="w-full p-2 border rounded-lg focus:outline-none focus:border-primary"
        />
        <Button className="flex gap-2" onClick={handleSearchClick}>
          <Search className=" h-4" />
          Search
        </Button>

        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto z-10">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <FilterSection
        setBedCount={setBedCount}
        setBathCount={setBathCount}
        setParkingCount={setParkingCount}
        setHomeType={setHomeType}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredListing.length > 0 ? (
          filteredListing.map((item, index) => (
            <Link href={"/view-listing/" + item.id}>
              <div
                key={index}
                className="p-3 hover:border hover:border-primary cursor-pointer rounded-lg"
              >
                <Image
                  src={item.listingImages?.[0]?.url || "/default-image.jpg"}
                  width={800}
                  height={150}
                  className="rounded-lg object-cover h-[150px]"
                  alt={`Image of ${item.address}`}
                />
                <div className="flex mt-2 flex-col gap-2">
                  <h2 className="font-bold text-xl">${item.price}</h2>
                  <h2 className="flex gap-2 text-sm text-gray-500">
                    <MapPin className="h-8 w-8" />
                    {item.address}
                  </h2>
                  <div className="flex gap-2 mt-2 justify-between">
                    <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 text-gray-500 justify-center items-center w-full">
                      <BedDouble className="h-4 w-4" />
                      {item.bedroom}
                    </h2>
                    <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 text-gray-500 justify-center items-center w-full">
                      <Bath className="h-4 w-4" />
                      {item?.bathroom}
                    </h2>
                    <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 text-gray-500 justify-center items-center w-full">
                      <Ruler className="h-4 w-4" />
                      {item?.area}
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No listings found</p>
        )}
      </div>
    </div>
  );
}

export default Listing;

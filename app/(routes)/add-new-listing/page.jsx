import GoogleAddressSearch from "@/app/_components/GoogleAddressSearch";
import React from "react";
import { Button } from "@/components/ui/button";

function addNewListing() {
  return (
    <div className="mt-10 md:mx-56 lg:mx-80">
      <div className="p-10 flex flex-col items-center justify-center gap-5">
        <h2 className="font-bold text-2xl mb-2">Add New Listing</h2>
        <div className="p-5 rounded-lg border shadow-md flex flex-col">
          <h2 className="text-gray-500 mb-3">
            Enter Address which you want to list
          </h2>
          <GoogleAddressSearch />
        </div>
      </div>
    </div>
  );
}

export default addNewListing;

import MapView from "@/app/_components/MapSection";
import { Button } from "@/components/ui/button";
import {
  Bath,
  BedDouble,
  CircleParking,
  Hammer,
  HomeIcon,
  House,
  LandPlot,
  MapPin,
  Share,
} from "lucide-react";
import React from "react";
import AgentDetail from "./AgentDetail";

function Detail({ listingDetail }) {
  const center = {
    lat: listingDetail?.coordinates?.lat,
    lon: listingDetail?.coordinates?.lon,
  };
  return (
    listingDetail && (
      <div className="my-6 flex gap-2 flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-3xl">${listingDetail?.price}</h2>
            <h2 className="text-gray-500 text-lg flex gap-2">
              <MapPin />
              {listingDetail?.address}
            </h2>
          </div>
          <Button className="flex gap-2">
            <Share />
            Share
          </Button>
        </div>
        <hr />
        <div className="mt-4 flex flex-col gap-3">
          <h2 className="font-bold text-2xl">Key Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <h2 className="flex gap-2 items-center bg-purple-100 rounded-lg p-3 text-primary justify-center">
              <HomeIcon />
              {listingDetail?.propertyType}
            </h2>
            <h2 className="flex gap-2 items-center bg-purple-100 rounded-lg p-3 text-primary justify-center">
              <Hammer />
              {listingDetail?.builtin}
            </h2>
            <h2 className="flex gap-2 items-center bg-purple-100 rounded-lg p-3 text-primary justify-center">
              <LandPlot />
              {listingDetail?.area}
            </h2>
            <h2 className="flex gap-2 items-center bg-purple-100 rounded-lg p-3 text-primary justify-center">
              <BedDouble />
              {listingDetail?.bedroom}
            </h2>
            <h2 className="flex gap-2 items-center bg-purple-100 rounded-lg p-3 text-primary justify-center">
              <Bath />
              {listingDetail?.bathroom}
            </h2>
            <h2 className="flex gap-2 items-center bg-purple-100 rounded-lg p-3 text-primary justify-center">
              <CircleParking />
              {listingDetail?.parking}
            </h2>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="font-bold text-2xl">Whats Special</h2>
          <p className="text-gray-500">{listingDetail?.description}</p>
        </div>
        <div>
          <h2 className="font-bold text-2xl">Find On Map</h2>
          <MapView center={center} listing={[listingDetail]} />
        </div>
        <div>
          <h2 className="font-bold text-2xl">Contact Agent</h2>
          <AgentDetail listingDetail={listingDetail} />
        </div>
      </div>
    )
  );
}

export default Detail;

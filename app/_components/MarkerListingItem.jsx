import Image from "next/image";
import React from "react";
import { MapPin, BedDouble, Bath, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function MarkerListingItem({ item }) {
  console.log("item adalah", item);
  return (
    <div className="rounded-lg cursor-pointer w-[180px]">
      <Image
        src={item.listingImages[0]?.url || "/placeholder.jpg"} // Gunakan gambar placeholder jika URL tidak ada
        width={800}
        height={150}
        className="rounded-lg object-cover h-[120px]"
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
            {item.bedroom !== undefined ? item.bedroom : "N/A"}
          </h2>
          <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 text-gray-500 justify-center items-center w-full">
            <Bath className="h-4 w-4" />
            {item.bathroom !== undefined ? item.bathroom : "N/A"}
          </h2>
        </div>
        <Link href={"/view-listing/" + item.id}>
          <Button size="sm">View All</Button>
        </Link>
      </div>
    </div>
  );
}

export default MarkerListingItem;

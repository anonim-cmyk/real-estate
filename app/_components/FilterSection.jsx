import React from "react";

import { Bath, BedDouble, CarFront } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function FilterSection({
  setBedCount,
  setBathCount,
  setParkingCount,
  setHomeType,
}) {
  return (
    <div className="px-3 py-2 grid grid-cols-2 md:flex gap-2">
      <Select onValueChange={setBedCount}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="bed" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2">
            <h2 className="flex gap-2">
              <BedDouble className="h-5 w-5 text-primary" />
              2++
            </h2>
          </SelectItem>
          <SelectItem value="3">
            <h2 className="flex gap-2">
              <BedDouble className="h-5 w-5 text-primary" />
              3++
            </h2>
          </SelectItem>
          <SelectItem value="4">
            <h2 className="flex gap-2">
              <BedDouble className="h-5 w-5 text-primary" />
              4++
            </h2>
          </SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setBathCount}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="bath" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2">
            <h2 className="flex gap-2">
              <Bath className="h-5 w-5 text-primary" />
              2++
            </h2>
          </SelectItem>
          <SelectItem value="3">
            <h2 className="flex gap-2">
              <Bath className="h-5 w-5 text-primary" />
              3++
            </h2>
          </SelectItem>
          <SelectItem value="4">
            <h2 className="flex gap-2">
              <Bath className="h-5 w-5 text-primary" />
              4++
            </h2>
          </SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setParkingCount}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="parking" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">
            <h2 className="flex gap-2">
              <CarFront className="h-5 w-5 text-primary" />
              1++
            </h2>
          </SelectItem>
          <SelectItem value="2">
            <h2 className="flex gap-2">
              <CarFront className="h-5 w-5 text-primary" />
              2++
            </h2>
          </SelectItem>
          <SelectItem value="3">
            <h2 className="flex gap-2">
              <CarFront className="h-5 w-5 text-primary" />
              3++
            </h2>
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) =>
          value == "All" ? setHomeType(null) : setHomeType(value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Home Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="Single Family Home">Single Family Home</SelectItem>
          <SelectItem value="Town House">Town House</SelectItem>
          <SelectItem value="Condo">Condo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterSection;

"use client";
import { supabase } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Slider from "../_components/slider";
import Detail from "../_components/Detail";

function viewListing({ params }) {
  const [listingDetail, setListingDetail] = useState();
  useEffect(() => {
    getListingDetail();
  }, []);
  const getListingDetail = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select("*,listingImages(url,listing_id)")
      .eq("id", params.id)
      .eq("active", true);

    if (data) {
      setListingDetail(data[0]);
      console.log(data);
    }
    if (error) {
      toast("server side error");
    }
  };
  return (
    <div className="px-4 md:pc-32 lg:px-56 py-5">
      <Slider imageList={listingDetail?.listingImages} />
      <Detail listingDetail={listingDetail} />
    </div>
  );
}

export default viewListing;

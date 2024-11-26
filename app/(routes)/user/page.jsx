"use client";
import { UserButton, UserProfile } from "@clerk/nextjs";
import { Building2 } from "lucide-react";
import React from "react";
import UserListing from "../my-listing/_components/UserListing";

function User() {
  return (
    <div className="my-6 md:px-10 lg:px-32 w-full">
      <h2 className="font-bold text-2xl mb-3 cursor-pointer">Profile</h2>
      <UserProfile routing="hash" />
    </div>
  );
}

export default User;

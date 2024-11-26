"use client";
import { UserProfile } from "@clerk/nextjs";
import { Building2, Mail } from "lucide-react";
import React, { useState, useEffect } from "react";
import UserListing from "./_components/UserListing";
import Inbox from "./_components/Inbox";

function MyListing() {
  const [activeTab, setActiveTab] = useState("my-listing");

  useEffect(() => {
    // Update tab based on URL hash when component mounts or hash changes
    const handleHashChange = () => {
      setActiveTab(window.location.hash.substring(1) || "my-listing");
    };

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="my-6 md:px-10 lg:px-32 w-full">
      <h2 className="font-bold text-2xl mb-3 cursor-pointer">Profile</h2>
      <div className="flex gap-4 mb-4">
        <a
          href="#my-listing"
          onClick={() => setActiveTab("my-listing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === "my-listing" ? "bg-primary text-white" : "bg-gray-100"
          }`}
        >
          <Building2 className="h-5 w-5" />
          My Listing
        </a>
        <a
          href="#my-inbox"
          onClick={() => setActiveTab("my-inbox")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === "my-inbox" ? "bg-primary text-white" : "bg-gray-100"
          }`}
        >
          <Mail className="h-5 w-5" />
          My Inbox
        </a>
      </div>

      <div>
        {activeTab === "my-listing" && <UserListing />}
        {activeTab === "my-inbox" && <Inbox />}
      </div>
    </div>
  );
}

export default MyListing;

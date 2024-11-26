"use client";
import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { supabase } from "@/utils/supabase/client";
import DataTable from "./table/DataTable"; // Pastikan path benar
import { columns } from "./table/Columns"; // Pastikan path benar dan Columns sudah didefinisikan

function Dashboard() {
  const [counts, setCounts] = useState({
    totalListing: 0,
    activeListing: 0,
    cancelledListing: 0,
  });
  const [listings, setListings] = useState([]); // State untuk menyimpan data listing

  // Fungsi untuk mengambil jumlah listing berdasarkan kondisi
  const fetchCountsAndData = async () => {
    try {
      // Ambil semua data listing dari tabel
      const { data, error } = await supabase.from("listing").select("*");
      if (error) {
        console.error("Error fetching data from Supabase:", error);
        return;
      }

      // Hitung jumlah berdasarkan kondisi
      const totalListing = data.length;
      const activeListing = data.filter((item) => item.active === true).length;
      const cancelledListing = data.filter(
        (item) => item.active === false
      ).length;

      // Perbarui state counts
      setCounts({ totalListing, activeListing, cancelledListing });

      // Perbarui state data listing
      setListings(data); // Simpan data dari Supabase ke state
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    // Ambil data awal saat komponen dimuat
    fetchCountsAndData();

    // Berlangganan untuk pembaruan realtime
    const subscription = supabase
      .channel("public:listing")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "listing" },
        () => {
          fetchCountsAndData(); // Perbarui count dan data setiap ada perubahan
        }
      )
      .subscribe();

    // Bersihkan subscription saat komponen dilepas
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <p className="text-2xl-semibold">Admin Dashboard</p>
      </header>
      <main>
        <section className="w-full space-y-4">
          <h1 className="header">Welcome</h1>
          <p className="text-dark-700">Start day with manage</p>
        </section>
        <section className="admin-stat">
          <StatCard
            type="totalListing"
            count={counts.totalListing}
            label="Total Listings"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="activeListing"
            count={counts.activeListing}
            label="Active Listings"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelledListing"
            count={counts.cancelledListing}
            label="Cancelled Listings"
            icon="/assets/icons/cancelled.svg"
          />
        </section>
        {/* Kirimkan columns dan listings ke DataTable */}
        <DataTable columns={columns} data={listings} />
      </main>
    </div>
  );
}

export default Dashboard;

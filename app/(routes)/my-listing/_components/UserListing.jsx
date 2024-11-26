import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import {
  Bath,
  BedDouble,
  Eye,
  MapPin,
  Pencil,
  Ruler,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"; // Ganti dengan path yang sesuai
import { toast } from "sonner";

function UserListing() {
  const { user } = useUser();
  const [listing, setListing] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [listingIdToDelete, setListingIdToDelete] = useState(null);

  useEffect(() => {
    user && getUserListing();
  }, [user]);

  const getUserListing = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select(`*,listingImages(url,listing_id)`)
      .eq("createdBy", user?.primaryEmailAddress.emailAddress);
    setListing(data);
    console.log(data);
  };

  const deleteListing = async (id) => {
    try {
      // Hapus terlebih dahulu data terkait di tabel listingImages
      const { error: imageError } = await supabase
        .from("listingImages")
        .delete()
        .eq("listing_id", id);

      if (imageError) {
        console.error("Error deleting images:", imageError);
        return;
      }

      // Setelah data terkait di tabel listingImages dihapus, hapus data di tabel listing
      const { error: listingError } = await supabase
        .from("listing")
        .delete()
        .eq("id", id);

      if (listingError) {
        console.error("Error deleting listing:", listingError);
      } else {
        // Setelah penghapusan berhasil, muat ulang daftar listing
        getUserListing();
      }
    } catch (error) {
      console.error("Unexpected error deleting listing:", error);
    }
  };

  const handleDeleteConfirm = () => {
    if (listingIdToDelete !== null) {
      deleteListing(listingIdToDelete);
      setIsDialogOpen(false);
      setListingIdToDelete(null); // Reset ID setelah menghapus
      if (handleDeleteConfirm) {
        toast("delete berhasil");
      }
    }
  };

  const handleDeleteClick = (id) => {
    setListingIdToDelete(id); // Set ID yang akan dihapus
    setIsDialogOpen(true); // Buka dialog
  };

  return (
    <div>
      <h2 className="font-bold text-2xl">Manage Your Listing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {listing &&
          listing.map((item, index) => (
            <div
              key={index}
              className="p-3 hover:border hover:border-primary cursor-pointer rounded-lg relative"
            >
              <h2 className="bg-primary m-1 rounded-lg text-white absolute">
                {item.active ? "Published" : "Draft"}
              </h2>
              <Image
                src={
                  item?.listingImages[0]
                    ? item?.listingImages[0]?.url
                    : "/placeholder.svg"
                }
                width={800}
                height={150}
                className="rounded-lg object-cover h-[150px]"
              />
              <div className="flex mt-2 flex-col gap-2">
                <h2 className="font-bold text-xl">${item?.price}</h2>
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
                <div className="gap-2 flex justify-between items-center">
                  <Link href={"/edit-listing/" + item.id}>
                    <Button size="sm" className="w-full">
                      <Pencil />
                    </Button>
                  </Link>
                  <Link href={"/view-listing/" + item.id}>
                    <Button size="sm" variant="outline" className="w-full">
                      <Eye />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin nihh mau diapus?!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UserListing;

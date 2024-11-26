"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import FileUpload from "../_components/FileUpload";
import { Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function EditListing({ params }) {
  const { user } = useUser();
  const router = useRouter();
  const [listing, setListing] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    //console.log(listingId);
    user && verifyUserRecord();
  }, [user]);

  const verifyUserRecord = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select(
        `*,
                    listingImages (
                      listing_id,
                      url
                    )`
      )
      .eq("createdBy", user?.primaryEmailAddress.emailAddress)
      .eq("id", params.id);

    if (data) {
      console.log(data);
      setListing(data[0]);
    }
    if (data?.length <= 0) {
      router.replace("/"); // Jika data tidak ditemukan, arahkan pengguna ke halaman lain
    }
  };

  const onSubmitHandler = async (formValue) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listing")
      .update(formValue)
      .eq("id", params.id)
      .select();

    if (data) {
      console.log(data);
      toast("listing");
      setLoading(false);
    }
    for (const image of images) {
      setLoading(true);
      const file = image;
      const fileName = Date.now().toString();
      const fileExt = fileName.split(".").pop();
      const { data, error } = await supabase.storage
        .from("listingImages")
        .upload(`${fileName}`, file, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });
      if (error) {
        setLoading(false);
        toast("eror while uploading images");
      } else {
        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
        const { data, error } = await supabase
          .from("listingImages")
          .insert([
            {
              url: imageUrl,
              listing_id: params?.id,
            },
          ])
          .select();
        if (data) {
          setLoading(false);
        }
        if (error) {
          setLoading(false);
        }
      }
      setLoading(false);
    }
  };

  const publishBtnHandler = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listing")
      .update({ active: true })
      .eq("id", params?.id)
      .select();

    if (data) {
      setLoading(false);
      toast("Listing Published");
    }
  };
  return (
    <div className="px-10 md:px-36 my-10">
      <h2 className="font-bold text-2xl">
        Enter Some more details about your listing
      </h2>

      <Formik
        initialValues={{
          type: "",
          propertyType: "",
          profileImage: user?.imageUrl,
          fullName: user?.fullName,
        }}
        onSubmit={(values) => {
          console.log(values);
          onSubmitHandler(values);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <div className="p-5 border rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg text-slate-500">Rent or sell?</h2>
                    <RadioGroup
                      defaultValue={listing?.type}
                      onValueChange={(v) => (values.type = v)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Rent" id="Rent" />
                        <Label htmlFor="Rent">Rent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sell" id="Sell" />
                        <Label htmlFor="Sell">Sell</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl mb-1">Property Type</h2>
                    <Select
                      onValueChange={(e) => (values.propertyType = e)}
                      name="propertyType"
                      defaultValue={listing?.propertyType}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder={
                            listing?.propertyType
                              ? listing.propertyType
                              : "Select Property Type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single Family House">
                          Single Family House
                        </SelectItem>
                        <SelectItem value="Town House">Town House</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Bedroom</h2>
                    <Input
                      type="number"
                      defaultValue={listing?.bedroom}
                      placeholder="Ex.2"
                      name="bedroom"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Bathroom</h2>
                    <Input
                      type="number"
                      defaultValue={listing?.bathroom}
                      placeholder="Ex.2"
                      name="bathroom"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Built In</h2>
                    <Input
                      type="number"
                      defaultValue={listing?.builtin}
                      placeholder="Ex.1990 Sq.ft"
                      name="builtin"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Parking</h2>
                    <Input
                      type="number"
                      defaultValue={listing?.parking}
                      placeholder="Ex.2"
                      name="parking"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Lot Size (Sq.Ft)</h2>
                    <Input
                      type="number"
                      defaultValue={listing?.lotSize}
                      placeholder=""
                      name="lotSize"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Area (Sq.Ft)</h2>
                    <Input
                      type="number"
                      defaultValue={listing?.area}
                      placeholder="40000"
                      name="area"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Selling Price($)</h2>
                    <Input
                      placeholder="4000"
                      defaultValue={listing?.price}
                      name="price"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">HOA(Per Month)($)</h2>
                    <Input
                      type="number"
                      defaultValue={listing?.hoa}
                      placeholder="100"
                      name="hoa"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-10">
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Description</h2>
                    <Textarea
                      placeholder=""
                      defaultValue={listing?.description}
                      name="description"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="font-lg my-2 text-gray-500">Upload Images</h2>
                  <FileUpload
                    setImages={(value) => setImages(value)}
                    imageList={listing.listingImages}
                  />
                </div>
                <div className="flex gap-7 justify-end mt-6">
                  <Button
                    type="submit"
                    variant="outline"
                    className="text-primary border-primary"
                    disable={loading}
                  >
                    {loading ? <Loader className="animate-spin" /> : " Save"}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="submit" disable={loading}>
                        {loading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          " Save & Publish"
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ready to publish?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Do you realy want to publish?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => publishBtnHandler()}>
                          {loading ? (
                            <Loader className="animate-spin" />
                          ) : (
                            "oke"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default EditListing;

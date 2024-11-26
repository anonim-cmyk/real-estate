"use client";
import { Button } from "@/components/ui/button";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminPage from "../(routes)/admin/page";
import Dashboard from "../(routes)/admin/_components/Dashboard";

function Header() {
  const path = usePathname();
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    if (isSignedIn && isAdmin) {
      router.push("/admin");
    }
  }, [isSignedIn, router, isAdmin]);

  return (
    <div className="p-6 px-10 flex justify-between items-center shadow-sm fixed top-0 w-full z-10 bg-white">
      {isAdmin ? (
        <Dashboard /> // Tampilkan TopBar untuk admin
      ) : (
        <div className="flex gap-12 items-center">
          <Image src={"/logo.svg"} width={150} height={150} alt="Logo" />

          <ul className="hidden md:flex gap-10">
            <Link href={"/"}>
              <li
                className={`hover:text-primary font-medium text-sm cursor-pointer ${
                  path == "/" && "text-primary"
                }`}
              >
                For Sell
              </li>
            </Link>
            <Link href={"/rent"}>
              <li
                className={`hover:text-primary font-medium text-sm cursor-pointer ${
                  path == "/rent" && "text-primary"
                }`}
              >
                For Rent
              </li>
            </Link>
            <li className="hover:text-primary font-medium text-sm cursor-pointer">
              Agent finder
            </li>
          </ul>
        </div>
      )}

      <div className="flex gap-2 items-center ml-auto">
        {!isAdmin && (
          <Link href={"/add-new-listing"}>
            <Button>
              <Plus />
              Post Your Add
            </Button>
          </Link>
        )}

        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Image
                src={user?.imageUrl}
                width={35}
                height={35}
                alt="userProfile"
                className="rounded-full"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={"/user"}>Profile</Link>
              </DropdownMenuItem>
              <Link href={"/my-listing"}>
                <DropdownMenuItem>My Listing</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <SignOutButton>Logout</SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={"/sign-in"}>
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Header;

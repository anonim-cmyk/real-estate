import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import {
  CreateSendBirdChannel,
  CreateSendBirdUser,
} from "@/app/shared/Service";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

function AgentDetail({ listingDetail }) {
  const { user } = useUser();

  const OnMessageAgentButtonClick = async () => {
    const agentDetail = listingDetail?.createdBy.split("@")[0];
    const userId = user.primaryEmailAddress.emailAddress.split("@")[0];

    try {
      // Log data pengguna untuk memastikan data sudah tersedia
      console.log("User data:", user);

      if (!user) {
        console.error("User not found.");
        return;
      }

      await CreateSendBirdUser(userId, user?.fullName, user?.imageUrl).then(
        (resp) => {
          console.log("Response from SendBird:", resp);
        }
      );
    } catch (e) {
      console.error("Error:", e);
    }
    try {
      await CreateSendBirdUser(
        agentDetail,
        listingDetail?.fullName,
        listingDetail?.profileImage
      ).then((resp) => {
        console.log("Response from SendBird:", resp);
      });
    } catch (e) {}

    try {
      const channelName = `${listingDetail?.fullName}`;

      await CreateSendBirdChannel([userId, agentDetail], channelName).then(
        (resp) => {
          console.log(resp);
          console.log("Channel dibuat", channelName);
        }
      );
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <div className="flex gap-5 items-center justify-between p-5 rounded-lg shadow-md border my-6">
      <div className="flex gap-6 items-center">
        <Image
          src={listingDetail?.profileImage}
          className="rounded-full"
          alt="imageProfile"
          width={60}
          height={60}
        />
        <div>
          <h2 className="text-lg font-bold">{listingDetail?.fullName}</h2>
          <h2 className="text-gray-500">{listingDetail?.createdBy}</h2>
        </div>
      </div>
      <Link href={"/my-listing#my-inbox"}>
        <Button onClick={OnMessageAgentButtonClick}>Send Message</Button>
      </Link>
    </div>
  );
}

export default AgentDetail;

"use client";

import useUser from "@/hooks/useUser";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";

const Room = ({ params }: { params: { roomid: string } }) => {
  const { fullName } = useUser();
  const roomID = params.roomid;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID!);
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      uuid(),
      fullName || "user" + Date.now(),
      720
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    const shareURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`;

    zp.joinRoom({
      container: containerRef.current,
      sharedLinks: [{ name: "Shareable link", url: shareURL }],
      scenario: { mode: ZegoUIKitPrebuilt.VideoConference },
      maxUsers: 10,
    });
  }, [roomID, fullName]);

  return <div ref={containerRef} className="w-full h-screen"></div>;
};

export default Room;

// Page.tsx
"use client";
import React from "react";
import Drawer from "@/components/drawer";
import Header from "@/components/header";
import { useDrawerContext } from "@/contextApi/drawerState";
import ProfileCard from "@/components/profile/profileCard";

const Page: React.FC = () => {
  const { status, toggleDrawer } = useDrawerContext();

  return (
    <div className="flex min-h-screen
                    dark:bg-[#525252] dark:bg-[linear-gradient(to_right,_#3d72b4,_#525252)]
                    bg-[#8e9eab]   bg-[linear-gradient(to_right,_#eef2f3,_#8e9eab)]">
      <Header />
      <Drawer
        isOpen={status}
        toggleDrawerloc={() => toggleDrawer(false)}
      />
      <main className="flex-grow py-8 px-4
                       sm:px-6
                       md:px-8
                       lg:px-16
                       xl:px-24
                       mt-28
                       ">
        <ProfileCard />
      </main>
    </div>
  );
};

export default Page;

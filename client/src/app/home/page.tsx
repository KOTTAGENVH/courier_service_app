// Page.tsx
"use client";
import React from "react";
import Drawer from "@/components/drawer";
import Header from "@/components/header";
import ChartComponent from "@/components/home/chart";
import AdminTable from "@/components/home/adminTable";
import { useDrawerContext } from "@/contextApi/drawerState";
import { useSelector } from "react-redux";
import { RootState } from "@/global_redux/store";
import UserTable from "@/components/home/userTable";

const Page: React.FC = () => {
  const { status, toggleDrawer } = useDrawerContext();
  const userEmail = useSelector((state: RootState) => state.user.email);

  return (
    <div className="flex min-h-screen
                    dark:bg-[#525252] dark:bg-[linear-gradient(to_right,_#3d72b4,_#525252)]
                    bg-[#8e9eab]   bg-[linear-gradient(to_right,_#eef2f3,_#8e9eab)]">
      <Header />
      <Drawer
        isOpen={status}
        toggleDrawerloc={() => toggleDrawer(false)}
      />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 mt-28 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ChartComponent />
            {userEmail === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
              <AdminTable />
            ):(
              <UserTable />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;

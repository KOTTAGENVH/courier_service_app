"use client";
import Drawer from '@/components/drawer';
import Header from '@/components/header';
import AdminTable from '@/components/shipments/adminTable';
import UserTable from '@/components/shipments/userTable';
import { useDrawerContext } from '@/contextApi/drawerState';
import { RootState } from '@/global_redux/store';
import React from 'react'
import { useSelector } from 'react-redux';

function Page() {
  const userEmail = useSelector((state: RootState) => state.user.email);
  const { status, toggleDrawer } = useDrawerContext();
  return (
    <div className="flex flex-col md:flex-row min-h-screen dark:bg-[#525252] dark:bg-[linear-gradient(to_right,_#3d72b4,_#525252)] bg-[#8e9eab]   bg-[linear-gradient(to_right,_#eef2f3,_#8e9eab)] overflow-hidden">
      <Header />
      <Drawer
        isOpen={status}
        toggleDrawerloc={() => toggleDrawer(false)}
      />
      {userEmail !== process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
        <UserTable />
      ) : (
        <AdminTable />
      )}
    </div>
  )
}

export default Page;
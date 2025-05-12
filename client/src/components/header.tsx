"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { useDrawerContext } from "@/contextApi/drawerState";

export default function Header() {
  const router = useRouter();
  const { status, toggleDrawer } = useDrawerContext();

  const handleLogoClick = () => {
    router.push("/home");
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent bg-opacity-30 backdrop-blur-md">
      <nav className="flex items-center justify-between px-4 py-2  h-24 bg-transparent  backdrop-blur-2xl shadow-2xl">
        <div
          className="cursor-pointer"
          onClick={handleLogoClick}
        >
          {!status && (
            <Image
              src="/courierMeLogo.png"
              alt="CourierMe Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
          )}
        </div>
               {!status ? (
        <button
          title="Open Drawer"
          onClick={() => toggleDrawer(!status)}
          className="
    w-12 h-12                  
    flex items-center justify-center
    rounded-full shadow-xl
    cursor-pointer             
    text-lg font-medium
    text-black dark:text-white
    bg-gradient-to-r from-white to-[#abbaab]
    dark:bg-[linear-gradient(to_right,_#29323c,_#485563)]
 hover:bg-none hover:bg-blue-600    
    transition-colors duration-200
  "
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
 ):(
   <button
          title="Open Drawer"
          onClick={() => toggleDrawer(!status)}
          className="
    w-12 h-12                  
    flex items-center justify-center
    rounded-full shadow-xl
    cursor-pointer             
    text-lg font-medium
    text-black dark:text-white
    bg-gradient-to-r from-white to-[#abbaab]
    dark:bg-[linear-gradient(to_right,_#29323c,_#485563)]
 hover:bg-none hover:bg-blue-600    
    transition-colors duration-200
  "
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
 )}
      </nav>
    </header>
  );
}

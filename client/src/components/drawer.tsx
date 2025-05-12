"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/api/services/auth/api";
import { motion, Variants } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { BriefcaseIcon, HomeIcon, PlusCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { RootState } from "@/global_redux/store";

interface DrawerProps {
    isOpen: boolean;
    toggleDrawerloc: () => void;
}

const drawerVariants: Variants = {
    open: {
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
        x: "-100%",
        transition: { type: "spring", stiffness: 300, damping: 30 },
    },
};


function Drawer({ isOpen, toggleDrawerloc }: DrawerProps) {
    const [isClient, setIsClient] = useState(false);
    const userEmail = useSelector((state: RootState) => state.user.email);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const navigatePage = (path: string) => {
        router.push(path);
        toggleDrawerloc();
    };

    if (!isClient) return null;

    const handleLogout = async () => {
        try {
            const response = await logout();
            router.push("/");
            alert(response.message);
        } catch {
            alert("An error occurred while logging out. Please try again.");
        }
    };
    return (
        <motion.div
            className={`fixed top-0 left-0 w-64 h-full bg-transparent  backdrop-blur-2xl shadow-2xl dark:text-white text-black flex flex-col z-50 overflow-y-auto`}
            variants={drawerVariants}
            initial={false}
            animate={isOpen ? "open" : "closed"}
        >
            <button
                className={`absolute top-4 right-4 text-2xl
          dark:text-white text-black cursor-pointer hover:text-red-500`}
                onClick={toggleDrawerloc}
            >
                &times;
            </button>
            <div className="p-4 flex-grow w-auto">
                <h2
                    className={`text-m font-bold dark:text-white text-black mb-4`}
                >
                    COURIERME
                </h2>
                <hr
                    className={`shadow-lg font-bold dark:border-white border-black border`}
                />
                <motion.div
                    className="box"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <button
                        className={`w-full py-2 px-4 md:m-4 ml-1 mr-3 mt-4 mb-4 md:space-x-2 md:w-48 flex justify-start items-center
            rounded-3xl shadow-lg 
            ${pathname === "/home" ? "bg-green-500" : "dark:bg-[linear-gradient(to_right,_#29323c,_#485563)] bg-gradient-to-r from-[#ffffff] to-[#abbaab]"}
            dark:text-white text-black
            dark:shadow-indigo-500/50 shadow-sky-500/50
            hover:shadow-none hover:bg-gray-300 hover:bg-none hover:bg-blue-600 cursor-pointer`}
                        onClick={() => navigatePage("/home")}
                    >
                        <HomeIcon className="w-5 h-5 mr-2 text-current" />
                        <span
                            className={`text-sm md:text-lg dark:text-white text-black`}
                        >
                            {" "}
                            Home
                        </span>
                    </button>
                </motion.div>
                <motion.div
                    className="box"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <button
                        className={`w-full py-2 px-4 md:m-4 ml-1 mr-3 mt-4 mb-4 md:space-x-2 md:w-48 flex justify-start items-center
            rounded-3xl shadow-lg 
            ${pathname === "/myprofile" ? "bg-green-500" : "dark:bg-[linear-gradient(to_right,_#29323c,_#485563)] bg-gradient-to-r from-[#ffffff] to-[#abbaab]"}
            dark:text-white text-black
            dark:shadow-indigo-500/50 shadow-sky-500/50
            hover:shadow-none hover:bg-gray-300 hover:bg-none hover:bg-blue-600 cursor-pointer`}
                        onClick={() => navigatePage("/myprofile")}
                    >
                        <UserCircleIcon className="w-5 h-5 mr-2 text-current" />
                        <span
                            className={`text-sm md:text-lg dark:text-white text-black`}
                        >
                            {" "}
                            My Profile
                        </span>
                    </button>
                </motion.div>
                <motion.div
                    className="box"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <button
                        className={`w-full py-2 px-4 md:m-4 ml-1 mr-3 mt-4 mb-4 md:space-x-2 md:w-48 flex justify-start items-center
            rounded-3xl shadow-lg 
            ${pathname === "/shipments" ? "bg-green-500" : "dark:bg-[linear-gradient(to_right,_#29323c,_#485563)] bg-gradient-to-r from-[#ffffff] to-[#abbaab]"}
            dark:text-white text-black
            dark:shadow-indigo-500/50 shadow-sky-500/50
            hover:shadow-none hover:bg-gray-300 hover:bg-none hover:bg-blue-600 cursor-pointer `}
                        onClick={() => navigatePage("/shipments")}
                    >
                        <BriefcaseIcon className="w-5 h-5 mr-2 text-current" />
                        <span
                            className={`text-sm md:text-lg dark:text-white text-black`}
                        >
                            {" "}
                            Shipments
                        </span>
                    </button>
                </motion.div>
                {userEmail != process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                    <motion.div
                        className="box"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <button
                            className={`w-full py-2 px-4 md:m-4 ml-1 mr-3 mt-4 mb-4 md:space-x-2 md:w-48 flex justify-start items-center
            rounded-3xl shadow-lg 
            ${pathname === "/add_shipment" ? "bg-green-500" : "dark:bg-[linear-gradient(to_right,_#29323c,_#485563)] bg-gradient-to-r from-[#ffffff] to-[#abbaab]"}
            dark:text-white text-black
            dark:shadow-indigo-500/50 shadow-sky-500/50
            hover:shadow-none hover:bg-gray-300 hover:bg-none hover:bg-blue-600 cursor-pointer`}
                            onClick={() => navigatePage("/add_shipment")}
                        >
                            <PlusCircleIcon className="w-5 h-5 mr-2 text-current" />
                            <span
                                className={`text-sm md:text-lg dark:text-white text-black`}
                            >
                                {" "}
                                Add Shipments
                            </span>
                        </button>
                    </motion.div>
                )}
            </div>
            <div className="p-2 ">
                <button
                    title="Logout"
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-2xl cursor-pointer"
                    onClick={handleLogout}
                >
                    <FontAwesomeIcon icon={faSignOut} className="cursor-pointer" />
                    <span className="ml-2">Logout</span>
                </button>
            </div>
        </motion.div>
    );
}

export default Drawer;

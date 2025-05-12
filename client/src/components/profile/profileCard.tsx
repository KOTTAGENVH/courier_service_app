"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/global_redux/store";

const ProfileCard: React.FC = () => {
  const { firstName, lastName, email, address, telephone } = useSelector(
    (s: RootState) => s.user
  );

  return (
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6
                    mx-auto
                    sm:max-w-lg
                    md:flex md:max-w-2xl
                    lg:max-w-3xl
                    xl:max-w-4xl">
                        
      <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 flex justify-center">
        <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl text-gray-500">
          {firstName?.[0] || "U"}
          {lastName?.[0] || "N"}
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {firstName} {lastName}
        </h2>

        <div className="grid grid-cols-1 gap-3 text-gray-700 dark:text-gray-300
                        sm:grid-cols-2">
          <div>
            <span className="block font-medium">Email</span>
            <span className="block truncate">{email || "—"}</span>
          </div>
          <div>
            <span className="block font-medium">Phone</span>
            <span className="block">{telephone || "—"}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="block font-medium">Address</span>
            <span className="block">{address || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

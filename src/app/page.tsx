"use client"

import Globe from "@/src/components/Globe";
import { fetchAllServersData } from "@/src/store/slices/latencySlice";
import { getUserLocation } from "@/src/store/slices/userLocationSlice";
import { AppDispatch } from "@/src/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUserLocation());
    dispatch(fetchAllServersData());

    const interval = setInterval(() => {
      dispatch(fetchAllServersData());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="flex min-h-screen bg-gray-950 text-white">
      <div className="w-full h-screen">
        <Globe />
      </div>
    </main>
  );
}
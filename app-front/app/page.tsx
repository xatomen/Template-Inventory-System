"use client";
// import Login from '../components/login';
import { Link } from "@heroui/react";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-4xl font-bold">Welcome to EvoFlowIT</h1>
      <p className="mt-4 text-gray-600">Manage your inventory efficiently and effectively.</p>
      <div className="mt-6">
        <Link href="/login">
          {/* <a className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"> */}
            Log In
          {/* </a> */}
        </Link>
      </div>
    </section>
  );
}

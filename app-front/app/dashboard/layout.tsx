// Layout para el dashboard

import Sidebar from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="w-full min-h-svh">
            <div className="absolute w-full border-1 border-solid">
                <Navbar />
            </div>
            <div className="flex h-dvh pt-16">
                <div className="flex-none p-4">
                    <Sidebar />
                </div>
                <div className="flex-1 border-1 border-solid rounded-lg m-4">
                    {children}
                </div>
            </div>
        </section>
    );
}
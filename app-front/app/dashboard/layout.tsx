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
            <div className="absolute w-full">
                <Navbar />
            </div>
            <div className="flex h-dvh pt-16">
                <div className="flex-none">
                    <Sidebar />
                </div>
                <div className="flex-1 border-1 border-solid rounded-lg">
                    {children}
                </div>
            </div>
        </section>
    );
}
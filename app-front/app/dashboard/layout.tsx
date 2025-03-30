// Layout para el dashboard

import Sidebar from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="w-full h-full">
            <div className="">
                <Navbar />
            </div>
            <div className="flex">
                <div className="flex-none">
                    <Sidebar />
                </div>
                <div className="flex-1">
                    {children}
                </div>
            </div>
            
        </section>
    );
}
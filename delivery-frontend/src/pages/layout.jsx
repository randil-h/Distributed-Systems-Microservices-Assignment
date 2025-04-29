import {SidebarInset, SidebarProvider} from "../components/ui/sidebar.jsx";
import {DashboardSidebar} from "../components/Navbar.jsx";


export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                <div className="flex min-h-screen flex-col">
                    <DashboardNavbar />
                    <main className="flex-1">{children}</main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

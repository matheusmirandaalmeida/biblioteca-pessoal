import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function MainLayout() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            <div className="flex min-h-screen flex-1 flex-col">
                <Navbar onOpenSidebar={() => setMobileOpen(true)} />

                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
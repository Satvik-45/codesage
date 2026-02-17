import { type ReactNode, useState, cloneElement, isValidElement } from "react";

interface AppLayoutProps {
    sidebar: ReactNode;
    children: ReactNode;
}

export function AppLayout({ sidebar, children }: AppLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = () => setIsSidebarOpen(false);

    // Clone sidebar element and inject onClose prop
    const sidebarWithClose = isValidElement(sidebar)
        ? cloneElement(sidebar as React.ReactElement<any>, { onClose: closeSidebar })
        : sidebar;

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-100">
            {/* Mobile/Tablet Hamburger Button - hidden when sidebar is open */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            )}

            {/* Overlay for mobile/tablet */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - hidden on mobile/tablet by default, always visible on lg+ */}
            <div
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                {sidebarWithClose}
            </div>

            <main className="flex-1 flex flex-col overflow-y-auto bg-zinc-950">
                {children}
            </main>
        </div>
    );
}

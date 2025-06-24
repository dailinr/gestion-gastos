import { Outlet, useLocation } from "react-router-dom" 
import { SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@/components/Header";
import { useEffect, useMemo } from "react";
import { useAppStore } from "@/Stores/useAppStore";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";  

// Los componentes de navegación
import { AppSidebar } from "@/components/AppSidebar"; 
import { MobileNav } from "@/components/MobileNav"; 

export const Layout = () => {

  const {pathname} = useLocation();
  const isHome = useMemo(() => pathname === '/', [pathname]);
  
  const { fetchSemana, fetchMetaExist, setTab } = useAppStore()

  const isMobile = useIsMobile()

  useEffect(() => {
    Promise.all([
      fetchSemana(), 
      fetchMetaExist(), 
    ])
    .then(() => {
      setTab("semana")
    })
  }, [])

  return (
    <SidebarProvider>

      {!isMobile && <AppSidebar />}

      {/* <main className="flex flex-col w-full h-screen py-4 px-5  md:pl-2 md:px-6 gap-4 "> */}
      <main className="flex flex-col w-full h-screen px-5 md:pl-2 md:px-6 gap-4 box-border py-4">

        <Header isHome={isHome} pathname={pathname} /> 
        {isMobile ?
          <div className="pb-20 flex-1 ">
            <Outlet />
          </div>
        :
          <Outlet />
        } 
      </main>
      
      {isMobile && <MobileNav />}
        
      <Toaster position="top-right" richColors closeButton />

    </SidebarProvider>
  )
}
import { Outlet, useLocation } from "react-router-dom" 
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Header } from "@/components/Header";
import { useEffect, useMemo } from "react";
import { useAppStore } from "@/Stores/useAppStore";
import { Toaster } from "@/components/ui/sonner";

export const Layout = () => {

  const {pathname} = useLocation();
  const isHome = useMemo(() => pathname === '/', [pathname]);
  const { fetchSemana } = useAppStore()

  useEffect(() => {
    fetchSemana()
  }, [])

  return (
    <SidebarProvider>
    
      <AppSidebar/>

      <section className="flex flex-col w-full h-screen py-5 px-5 md:pl-2 md:pr-6 gap-4 ">
       
        <Header isHome={isHome} pathname={pathname} /> 
        <Outlet /> 
        
      </section>
      <Toaster position="top-right" richColors closeButton />

    </SidebarProvider>
  )
}
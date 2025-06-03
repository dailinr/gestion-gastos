import { LayoutDashboard, ChartColumnBig, BanknoteArrowDown } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { NavLink } from "react-router-dom"

// Menu items con sus rutas reales
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Ingresos",
    url: "/ingresos",
    icon: ChartColumnBig,
  },
  {
    title: "Gastos",
    url: "/gastos",
    icon: BanknoteArrowDown,
  },
  // {
  //   title: "Configuración",
  //   url: "/configuracion",
  //   icon: Settings,
  // },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="h-full p-4 ">
      
      <SidebarContent className="rounded-lg shadow p-2">
        <SidebarTrigger />
        <SidebarGroup className="group-data-[collapsible=icon]:hidden ">
          <SidebarGroupLabel>Control gastos</SidebarGroupLabel>
          <SidebarGroupContent>

            <SidebarMenu>
              {items.map((item) => (
                <NavLink key={item.title} to={item.url} end>
                  {({ isActive }) => (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild isActive={isActive}
                      >
                        <a className="py-5">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuAction />
                    </SidebarMenuItem>
                  )}
                </NavLink>
              ))}
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

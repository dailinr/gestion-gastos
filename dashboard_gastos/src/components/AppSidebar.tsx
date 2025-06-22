import { LayoutDashboard, ChartColumnBig, BanknoteArrowDown, HandCoins } from "lucide-react"
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
  {
    title: "Ahorros",
    url: "/ahorros",
    icon: HandCoins,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon"  variant="floating" >
      
      <SidebarContent className="rounded-md">
        <SidebarTrigger  />
        <SidebarGroup >
          <SidebarGroupLabel>Control gastos</SidebarGroupLabel>
          <SidebarGroupContent>

            <SidebarMenu>
              {items.map((item) => (
                <NavLink key={item.title} to={item.url} end>
                  {({ isActive }) => (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild isActive={isActive}
                        tooltip={item.title}
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
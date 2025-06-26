import { NavLink } from "react-router-dom"
import { LayoutDashboard, ChartColumnBig, BanknoteArrowDown, HandCoins } from "lucide-react"

// Reutilizamos la misma configuración de items
const itemsMobile = [
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

export function MobileNav() {
  return (
    // Contenedor fijo en la parte inferior de la pantalla
    <nav className="z-50 w-full h-16 bg-white border-t fixed bottom-0 left-0 ">
      {/* Grid para distribuir los elementos equitativamente */}
      <div className="grid h-full grid-cols-4 ">
        {itemsMobile.map((item) => (
          <NavLink
            key={`mobile-${item.title}`} to={item.url}
            className=" inline-flex justify-center items-center" end
          >

            {({ isActive }) => (
              <div className={` flex flex-col p-2 rounded-md items-center
                ${ isActive ? "text-primary bg-muted" : "text-muted-foreground"}`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs">{item.title}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
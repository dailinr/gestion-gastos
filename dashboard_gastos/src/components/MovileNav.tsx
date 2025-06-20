import { NavLink } from "react-router-dom"
import { LayoutDashboard, ChartColumnBig, BanknoteArrowDown } from "lucide-react"

// Reutilizamos la misma configuración de items
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
    icon: BanknoteArrowDown,
  },
]

export function MobileNav() {
  return (
    // Contenedor fijo en la parte inferior de la pantalla
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t">
      {/* Grid para distribuir los elementos equitativamente */}
      <div className="grid h-full grid-cols-4 ">
        {items.map((item) => (
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
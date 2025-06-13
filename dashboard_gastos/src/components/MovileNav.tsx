import { NavLink } from "react-router-dom"
import { LayoutDashboard, ChartColumnBig, BanknoteArrowDown } from "lucide-react"
import { Button } from "./ui/button"

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
]

export function MobileNav() {
  return (
    // Contenedor fijo en la parte inferior de la pantalla
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t">
      {/* Grid para distribuir los elementos equitativamente */}
      <div className="grid h-full grid-cols-3 mx-auto">
        {items.map((item) => (
          <NavLink
            key={`mobile-${item.title}`}
            to={item.url}
            className="inline-flex flex-col items-center justify-center "
            end
          >

            {({ isActive }) => (
              <Button variant="ghost" 
                className={`flex flex-col items-center justify-center hover:bg-muted ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.title}</span>
              </Button>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
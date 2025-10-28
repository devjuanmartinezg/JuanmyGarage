import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  change: string
  color: "blue" | "green" | "yellow" | "red"
}

const colorClasses = {
  blue: "bg-blue-500/20 text-blue-400",
  green: "bg-green-500/20 text-green-400",
  yellow: "bg-yellow-500/20 text-yellow-400",
  red: "bg-red-500/20 text-red-400",
}

export function StatCard({ icon: Icon, label, value, change, color }: StatCardProps) {
  return (
    <div className="card hover:border-primary/50 transition-colors cursor-pointer group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2 group-hover:text-primary transition-colors">{value}</p>
          <p className="text-xs text-muted-foreground mt-2">{change}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} flex-shrink-0`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  )
}

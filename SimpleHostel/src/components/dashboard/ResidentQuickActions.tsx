import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { HandCoins, FileText, Megaphone, BookOpenCheck, ArrowRight, BedDouble } from 'lucide-react'

const quickActions = [
  {
    title: 'Book a Room',
    description: 'Find and book available rooms',
    icon: BedDouble,
    path: '/find-hostel',
    color: 'forest-green',
    gradient: 'from-forest-green-50 to-forest-green-100/50',
    iconBg: 'bg-forest-green-100',
    iconColor: 'text-forest-green-700',
  },
  {
    title: 'Make Payment',
    description: 'Pay your outstanding balance',
    icon: HandCoins,
    path: '/dashboard/payment-billing',
    color: 'teal-green',
    gradient: 'from-teal-green-50 to-teal-green-100/50',
    iconBg: 'bg-teal-green-100',
    iconColor: 'text-teal-green-700',
  },
  {
    title: 'Submit Request',
    description: 'Maintenance & support requests',
    icon: FileText,
    path: '/dashboard/make-request',
    color: 'sage-green',
    gradient: 'from-sage-green-50 to-sage-green-100/50',
    iconBg: 'bg-sage-green-100',
    iconColor: 'text-sage-green-700',
  },
  {
    title: 'Announcements',
    description: 'View latest updates',
    icon: Megaphone,
    path: '/dashboard/view-announcements',
    color: 'forest-green',
    gradient: 'from-forest-green-50 to-forest-green-100/50',
    iconBg: 'bg-forest-green-200',
    iconColor: 'text-forest-green-800',
  },
]

const floatingCard = "bg-gradient-to-br from-card to-muted/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50"

const ResidentQuickActions = () => {
  const navigate = useNavigate()

  return (
    <Card className={floatingCard}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Common tasks at your fingertips</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className={`
                  group relative flex items-center gap-3 p-4 rounded-xl
                  bg-gradient-to-br ${action.gradient}
                  hover:shadow-md hover:scale-[1.02]
                  transition-all duration-200
                  text-left border border-transparent hover:border-${action.color}-200
                `}
              >
                <div className={`p-2.5 rounded-lg ${action.iconBg}`}>
                  <Icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                </div>
                <ArrowRight className={`h-4 w-4 ${action.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-200 -translate-x-1 group-hover:translate-x-0`} />
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default ResidentQuickActions

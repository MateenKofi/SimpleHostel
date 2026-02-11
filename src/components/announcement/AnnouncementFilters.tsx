import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X } from "lucide-react"
import type { AnnouncementCategory, AnnouncementPriority, AnnouncementStatus } from "@/types/announcement"
import { getAllCategories, getAllPriorities, getAllStatuses } from "@/helper/announcementUtils"

interface AnnouncementFiltersProps {
    filters: {
        categories: AnnouncementCategory[]
        priorities: AnnouncementPriority[]
        statuses: AnnouncementStatus[]
        search: string
    }
    onFiltersChange: (filters: {
        categories: AnnouncementCategory[]
        priorities: AnnouncementPriority[]
        statuses: AnnouncementStatus[]
        search: string
    }) => void
    resultCount?: number
}

const categoryLabels: Record<AnnouncementCategory, string> = {
    general: "General",
    policy: "Policy/Rules",
    event: "Event",
    emergency: "Emergency",
}

const priorityLabels: Record<AnnouncementPriority, string> = {
    low: "Low",
    high: "High",
    urgent: "Urgent",
}

const statusLabels: Record<AnnouncementStatus, string> = {
    pending: "Pending",
    ongoing: "Ongoing",
    passed: "Passed",
}

const AnnouncementFilters = ({
    filters,
    onFiltersChange,
    resultCount,
}: AnnouncementFiltersProps) => {
    const activeFilterCount =
        filters.categories.length +
        filters.priorities.length +
        filters.statuses.length +
        (filters.search ? 1 : 0)

    const toggleCategory = (category: AnnouncementCategory) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter((c) => c !== category)
            : [...filters.categories, category]
        onFiltersChange({ ...filters, categories: newCategories })
    }

    const togglePriority = (priority: AnnouncementPriority) => {
        const newPriorities = filters.priorities.includes(priority)
            ? filters.priorities.filter((p) => p !== priority)
            : [...filters.priorities, priority]
        onFiltersChange({ ...filters, priorities: newPriorities })
    }

    const toggleStatus = (status: AnnouncementStatus) => {
        const newStatuses = filters.statuses.includes(status)
            ? filters.statuses.filter((s) => s !== status)
            : [...filters.statuses, status]
        onFiltersChange({ ...filters, statuses: newStatuses })
    }

    const clearAllFilters = () => {
        onFiltersChange({
            categories: [],
            priorities: [],
            statuses: [],
            search: "",
        })
    }

    const hasActiveFilters = activeFilterCount > 0

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search announcements..."
                        value={filters.search}
                        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                        className="pl-9"
                    />
                </div>

                {/* Filter Popover */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="relative">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                            {hasActiveFilters && (
                                <Badge
                                    variant="secondary"
                                    className="ml-2 h-5 min-w-5 px-1 rounded-full"
                                >
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64" align="start">
                        <div className="space-y-4">
                            {/* Category Filter */}
                            <div>
                                <Label className="text-sm font-medium">Category</Label>
                                <div className="mt-2 space-y-2">
                                    {getAllCategories().map((category) => (
                                        <div key={category} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`category-${category}`}
                                                checked={filters.categories.includes(category)}
                                                onCheckedChange={() => toggleCategory(category)}
                                            />
                                            <Label
                                                htmlFor={`category-${category}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {categoryLabels[category]}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Priority Filter */}
                            <div>
                                <Label className="text-sm font-medium">Priority</Label>
                                <div className="mt-2 space-y-2">
                                    {getAllPriorities().map((priority) => (
                                        <div key={priority} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`priority-${priority}`}
                                                checked={filters.priorities.includes(priority)}
                                                onCheckedChange={() => togglePriority(priority)}
                                            />
                                            <Label
                                                htmlFor={`priority-${priority}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {priorityLabels[priority]}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <div className="mt-2 space-y-2">
                                    {getAllStatuses().map((status) => (
                                        <div key={status} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`status-${status}`}
                                                checked={filters.statuses.includes(status)}
                                                onCheckedChange={() => toggleStatus(status)}
                                            />
                                            <Label
                                                htmlFor={`status-${status}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {statusLabels[status]}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Clear All */}
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="w-full"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Active Filter Badges */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 items-center">
                        {filters.categories.map((cat) => (
                            <Badge key={`cat-${cat}`} variant="secondary" className="gap-1">
                                {categoryLabels[cat]}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => toggleCategory(cat)}
                                />
                            </Badge>
                        ))}
                        {filters.priorities.map((prio) => (
                            <Badge key={`prio-${prio}`} variant="secondary" className="gap-1">
                                {priorityLabels[prio]}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => togglePriority(prio)}
                                />
                            </Badge>
                        ))}
                        {filters.statuses.map((stat) => (
                            <Badge key={`stat-${stat}`} variant="secondary" className="gap-1">
                                {statusLabels[stat]}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => toggleStatus(stat)}
                                />
                            </Badge>
                        ))}
                        {filters.search && (
                            <Badge variant="secondary" className="gap-1">
                                &quot;{filters.search}&quot;
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => onFiltersChange({ ...filters, search: "" })}
                                />
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Result Count */}
            {resultCount !== undefined && (
                <span className="text-sm text-muted-foreground">
                    {resultCount} {resultCount === 1 ? "announcement" : "announcements"}
                </span>
            )}
        </div>
    )
}

export default AnnouncementFilters

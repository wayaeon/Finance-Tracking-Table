"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Receipt,
  MapPin,
  RotateCcw,
  FileText,
  Moon,
  Sun,
  Check,
  X,
  ExternalLink,
  Search,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { useTheme } from "next-themes"

interface Expense {
  id: string
  date: string
  time: string
  category: string
  vendor: string
  description: string
  amount: number
  payment: string
  taxStatus: boolean
  location: string
  recurring: boolean
  notes: string
}

const expenses2025: Expense[] = [
  {
    id: "1",
    date: "Jul 18, 2025",
    time: "2:34 PM",
    category: "Business Meals",
    vendor: "Unknown Vendor",
    description:
      "OCR extracted receipt 1 - Business lunch meeting with potential client to discuss quarterly projections",
    amount: 449.0,
    payment: "Credit Card",
    taxStatus: true,
    location: "Address from O'Reilly's Restaurant, 123 Main Street, Downtown Calgary",
    recurring: false,
    notes: "Client meeting notes",
  },
  {
    id: "2",
    date: "Mar 11, 2025",
    time: "10:15 AM",
    category: "Equipment",
    vendor: "Shoppers Drug Mart Electronics Division",
    description: "Sonal G. NN Vinegar, D... - Office supplies and computer accessories for remote work setup",
    amount: 814.57,
    payment: "Credit Card",
    taxStatus: false,
    location: "9 Av SW, Calgary, AB T2P 5N3, Canada",
    recurring: false,
    notes: "",
  },
  {
    id: "3",
    date: "Jan 13, 2025",
    time: "9:00 AM",
    category: "Rent / Mortgage",
    vendor: "Meadow Creek Property Management Ltd.",
    description: "Monthly office rent payment for Q1 2025",
    amount: 1.0,
    payment: "Credit Card",
    taxStatus: false,
    location: "V0G 1N0, Area 51, Remote Office Location",
    recurring: true,
    notes: "",
  },
  {
    id: "4",
    date: "Jan 12, 2025",
    time: "3:45 PM",
    category: "Travel (Business)",
    vendor: "test",
    description: "this is a test expense to demonstrate long descriptions and how they wrap in the interface",
    amount: 1.0,
    payment: "Credit Card",
    taxStatus: false,
    location: "69, Fireside Cove, Cochrane, AB T4C 0V3, Canada",
    recurring: false,
    notes: "Travel reimbursement",
  },
]

const expenses2024: Expense[] = [
  {
    id: "5",
    date: "Jan 17, 2024",
    time: "11:30 AM",
    category: "Marketing & Advertising",
    vendor: "Vector Printing and Graphics Solutions Inc.",
    description: "Printing and graphics services for Q4 marketing campaign materials and brochures",
    amount: 136.5,
    payment: "Credit Card",
    taxStatus: true,
    location: "9505 Rainbow Boulevard, Las Vegas, NV 89123, USA",
    recurring: false,
    notes: "Campaign materials",
  },
  {
    id: "6",
    date: "Jan 10, 2024",
    time: "4:20 PM",
    category: "Equipment",
    vendor: "Best Buy",
    description: "San 25W Gah FastChrg",
    amount: 22.04,
    payment: "Credit Card",
    taxStatus: true,
    location: "5111 Northland Drive NW, Calgary, AB T2L 2J8, Canada",
    recurring: false,
    notes: "",
  },
  {
    id: "7",
    date: "Jan 10, 2024",
    time: "4:22 PM",
    category: "Equipment",
    vendor: "Best Buy",
    description: "San 25w Gah Fastchrg",
    amount: 22.04,
    payment: "Credit Card",
    taxStatus: false,
    location: "5111 Northland Drive NW, Calgary, AB T2L 2J8, Canada",
    recurring: false,
    notes: "",
  },
]

const getCategoryColor = (category: string) => {
  const colors = {
    "Business Meals":
      "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    Equipment:
      "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    "Rent / Mortgage":
      "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    "Travel (Business)":
      "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    "Marketing & Advertising":
      "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  }
  return (
    colors[category as keyof typeof colors] ||
    "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
  )
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

const openInGoogleMaps = (location: string) => {
  const encodedLocation = encodeURIComponent(location)
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, "_blank")
}

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setDisplayValue(value * easeOutQuart)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <>{displayValue.toFixed(2)}</>
}

export default function ExpensesDashboard() {
  const [open2025, setOpen2025] = useState(true)
  const [open2024, setOpen2024] = useState(true)
  const [selected2025, setSelected2025] = useState<Set<string>>(new Set())
  const [selected2024, setSelected2024] = useState<Set<string>>(new Set())
  const { theme, setTheme } = useTheme()

  const total2025 = expenses2025.reduce((sum, expense) => sum + expense.amount, 0)
  const total2024 = expenses2024.reduce((sum, expense) => sum + expense.amount, 0)

  const handleSelectAll2025 = (checked: boolean) => {
    if (checked) {
      setSelected2025(new Set(expenses2025.map((e) => e.id)))
    } else {
      setSelected2025(new Set())
    }
  }

  const handleSelectAll2024 = (checked: boolean) => {
    if (checked) {
      setSelected2024(new Set(expenses2024.map((e) => e.id)))
    } else {
      setSelected2024(new Set())
    }
  }

  const handleSelectExpense = (expenseId: string, year: number, checked: boolean) => {
    const setSelected = year === 2025 ? setSelected2025 : setSelected2024
    const selected = year === 2025 ? selected2025 : selected2024

    const newSelected = new Set(selected)
    if (checked) {
      newSelected.add(expenseId)
    } else {
      newSelected.delete(expenseId)
    }
    setSelected(newSelected)
  }

  const ExpenseTable = ({ expenses, year }: { expenses: Expense[]; year: number }) => {
    const selected = year === 2025 ? selected2025 : selected2024
    const handleSelectAll = year === 2025 ? handleSelectAll2025 : handleSelectAll2024
    const allSelected = expenses.length > 0 && expenses.every((e) => selected.has(e.id))
    const someSelected = expenses.some((e) => selected.has(e.id))

    return (
      <div className="rounded-xl border border-gray-200/50 dark:border-gray-700/30 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-gray-50/90 dark:bg-gray-700/60 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-600/40">
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected
                  }}
                  onCheckedChange={handleSelectAll}
                  className="rounded-full h-4 w-4 border-blue-300 dark:border-blue-600 text-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked] dark:data-[state=checked]:bg-blue-400 dark:data-[state=checked]:border-blue-400"
                />
              </TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-sm w-36">Date/Time</TableHead>
              <TableHead className="font-semibold text-gray-800 dark:text-gray-200 w-40">Category</TableHead>
              <TableHead className="font-semibold text-gray-800 dark:text-gray-200 w-48">Vendor</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-sm w-80">Description</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-gray-100 text-right w-32">Amount</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-sm w-32">Payment</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-sm w-28">Tax</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-sm w-48">Location</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-sm w-24">Recurring</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-sm w-20">Notes</TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-sm w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow
                key={expense.id}
                className={`hover:bg-gray-50/60 dark:hover:bg-gray-700/30 hover:shadow-sm transition-all duration-200 border-b border-gray-100/60 dark:border-gray-700/30 ${
                  selected.has(expense.id) ? "bg-blue-50/60 dark:bg-blue-900/25 shadow-sm" : ""
                }`}
              >
                <TableCell className="py-4">
                  <Checkbox
                    checked={selected.has(expense.id)}
                    onCheckedChange={(checked) => handleSelectExpense(expense.id, year, checked as boolean)}
                    className="rounded-full h-4 w-4 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-400 dark:data-[state=checked]:border-blue-400"
                  />
                </TableCell>
                <TableCell className="py-4">
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm whitespace-nowrap">
                    {expense.date}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{expense.time}</div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={`${getCategoryColor(expense.category)} font-medium text-xs whitespace-nowrap`}
                  >
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer font-semibold text-sm">
                          {truncateText(expense.vendor, 20)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{expense.vendor}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-gray-700 dark:text-gray-300 text-sm cursor-help">
                          {truncateText(expense.description, 40)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{expense.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right py-4">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    US${expense.amount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Receipt className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400 text-sm">{expense.payment}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-center">
                          {expense.taxStatus ? (
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{expense.taxStatus ? "Tax deductible" : "Not tax deductible"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => openInGoogleMaps(expense.location)}
                          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate text-sm max-w-32">{truncateText(expense.location, 15)}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{expense.location}</p>
                        <p className="text-xs text-gray-400 mt-1">Click to open in Google Maps</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="py-4">
                  {expense.recurring && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-center">
                            <RotateCcw className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Recurring expense</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  {expense.notes && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-center">
                            <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{expense.notes}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <Edit className="w-3.5 h-3.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-850">
      <TooltipProvider>
        <div className="container mx-auto p-6 max-w-[1600px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search expenses by vendor, description, or category..."
                  className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-10 w-10 p-0 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50"
                >
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700/50">
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700/50">
                    Import Expenses
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700/50">Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Year Sections */}
          <div className="space-y-6">
            {/* 2025 Section */}
            <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <Collapsible open={open2025} onOpenChange={setOpen2025}>
                <CollapsibleTrigger asChild>
                  <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-6 cursor-pointer bg-gradient-to-r from-gray-100/90 to-gray-50/90 dark:from-gray-700/90 dark:to-gray-800/90 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 backdrop-blur-sm border-b border-gray-200/40 dark:border-gray-600/40 hover:shadow-md group">
                    <div className="flex items-center gap-6">
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        {open2025 ? (
                          <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">2025</h2>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</div>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          $<AnimatedCounter value={total2025} />
                        </div>
                      </div>
                      <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transactions</div>
                        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {expenses2025.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-8 pt-6">
                    <ExpenseTable expenses={expenses2025} year={2025} />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* 2024 Section */}
            <Card className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <Collapsible open={open2024} onOpenChange={setOpen2024}>
                <CollapsibleTrigger asChild>
                  <div className="sticky top-0 z-20 flex items-center justify-between px-8 py-6 cursor-pointer bg-gradient-to-r from-gray-100/90 to-gray-50/90 dark:from-gray-700/90 dark:to-gray-800/90 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-300 backdrop-blur-sm border-b border-gray-200/40 dark:border-gray-600/40 hover:shadow-md group">
                    <div className="flex items-center gap-6">
                      <div className="transition-transform duration-200 group-hover:scale-110">
                        {open2024 ? (
                          <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        ) : (
                          <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">2024</h2>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</div>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          $<AnimatedCounter value={total2024} />
                        </div>
                      </div>
                      <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transactions</div>
                        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {expenses2024.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-8 pt-6">
                    <ExpenseTable expenses={expenses2024} year={2024} />
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}

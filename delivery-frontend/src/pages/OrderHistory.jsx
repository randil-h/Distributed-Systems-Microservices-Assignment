"use client"

import React, { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Search } from "lucide-react"
import {Button} from "../components/ui/button.jsx";
import {TableBody, TableCell, TableHead, TableHeader, TableRow, Table} from "../components/ui/table.jsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/ui/card.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../components/ui/select.jsx";
import {Input} from "../components/ui/input.jsx";
import {Badge} from "../components/ui/badge.jsx";
import {Sidebar} from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";


// Mock data for order history
const orderHistory = [
    {
        id: "DEL-1230",
        date: "Apr 25, 2025",
        time: "14:30",
        restaurant: "Burger Palace",
        customerAddress: "456 Oak Ave, Anytown, CA",
        total: "$32.50",
        status: "Delivered",
        earnings: "$8.50",
    },
    {
        id: "DEL-1229",
        date: "Mar 24, 2025",
        time: "19:15",
        restaurant: "Taco Heaven",
        customerAddress: "789 Pine St, Anytown, CA",
        total: "$24.75",
        status: "Delivered",
        earnings: "$7.25",
    },
    {
        id: "DEL-1228",
        date: "Apr 24, 2025",
        time: "12:45",
        restaurant: "Sushi Express",
        customerAddress: "101 Maple Dr, Anytown, CA",
        total: "$45.20",
        status: "Delivered",
        earnings: "$9.75",
    },
    {
        id: "DEL-1227",
        date: "Apr 23, 2025",
        time: "18:30",
        restaurant: "Pizza Heaven",
        customerAddress: "202 Elm St, Anytown, CA",
        total: "$28.75",
        status: "Delivered",
        earnings: "$7.50",
    },
    {
        id: "DEL-1226",
        date: "Apr 22, 2025",
        time: "20:15",
        restaurant: "Thai Delight",
        customerAddress: "303 Cedar Rd, Anytown, CA",
        total: "$36.90",
        status: "Delivered",
        earnings: "$8.75",
    },
    {
        id: "DEL-1225",
        date: "Apr 21, 2025",
        time: "13:20",
        restaurant: "Sandwich Shop",
        customerAddress: "404 Birch Ln, Anytown, CA",
        total: "$18.50",
        status: "Delivered",
        earnings: "$6.25",
    },
    {
        id: "DEL-1225",
        date: "Apr 20, 2023",
        time: "19:45",
        restaurant: "Burger Palace",
        customerAddress: "505 Walnut Ave, Anytown, CA",
        total: "$29.75",
        status: "Delivered",
        earnings: "$7.75",
    },
]

export default function OrderHistoryPage() {
    const [view, setView] = useState("table")
    const [searchQuery, setSearchQuery] = useState("")
    const [timeFilter, setTimeFilter] = useState("all")

    const filteredOrders = orderHistory.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerAddress.toLowerCase().includes(searchQuery.toLowerCase())

        if (timeFilter === "all") return matchesSearch

        // Filter by time period
        const orderDate = new Date(order.date)
        const now = new Date()

        if (timeFilter === "today") {
            return (
                matchesSearch &&
                orderDate.getDate() === now.getDate() &&
                orderDate.getMonth() === now.getMonth() &&
                orderDate.getFullYear() === now.getFullYear()
            )
        }

        if (timeFilter === "week") {
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(now.getDate() - 7)
            return matchesSearch && orderDate >= oneWeekAgo
        }

        if (timeFilter === "month") {
            const oneMonthAgo = new Date()
            oneMonthAgo.setMonth(now.getMonth() - 1)
            return matchesSearch && orderDate >= oneMonthAgo
        }

        return matchesSearch
    })

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="ml-64 w-full">
                {/* Navbar */}
                <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow z-30">
                    <Navbar />
                </div>

                {/* Content below navbar */}
                <div className="pt-20 px-6 space-y-6"> {/* Add padding top for navbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-2xl font-bold">Order History</h2>
                        <div className="flex items-center gap-2">
                            <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
                                List
                            </Button>
                            <Button variant={view === "table" ? "default" : "outline"} size="sm" onClick={() => setView("table")}>
                                Table
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                placeholder="Search orders..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select value={timeFilter} onValueChange={setTimeFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter by time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table/List View */}
                    {view === "table" ? (
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Restaurant</TableHead>
                                        <TableHead className="hidden md:table-cell">Delivery Address</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Earnings</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">{order.id}</TableCell>
                                            <TableCell>{order.date} {order.time}</TableCell>
                                            <TableCell>{order.restaurant}</TableCell>
                                            <TableCell className="hidden md:table-cell">{order.customerAddress}</TableCell>
                                            <TableCell>{order.total}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{order.earnings}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {filteredOrders.map((order) => (
                                <Card key={order.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{order.restaurant}</CardTitle>
                                                <CardDescription>Order #{order.id}</CardDescription>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm">{order.date}</span>
                                                <Clock className="h-4 w-4 ml-2 text-gray-500" />
                                                <span className="text-sm">{order.time}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                                                <span className="text-sm">{order.customerAddress}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <div className="text-sm">
                                            Total: <span className="font-medium">{order.total}</span>
                                        </div>
                                        <div className="text-sm">
                                            Earnings: <span className="font-medium text-green-600">{order.earnings}</span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex items-center justify-center space-x-2">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8">1</Button>
                        <Button variant="outline" size="sm" className="h-8 w-8">2</Button>
                        <Button variant="outline" size="sm" className="h-8 w-8">3</Button>
                        <Button variant="outline" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

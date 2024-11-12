import React, { useState } from 'react'
import { BarChart3, PieChart, TrendingUp, Users, Building, DollarSign, Calendar, Download } from 'lucide-react'

interface OccupancyData {
    month: string;
    occupancy: number;
}

interface BlockData {
    block: string;
    occupancy: number;
}

const ReportAnalysis = () => {
    const [dateRange, setDateRange] = useState('yearly')
    const [occupancyData] = useState<OccupancyData[]>([
        { month: 'Jan', occupancy: 85 },
        { month: 'Feb', occupancy: 88 },
        { month: 'Mar', occupancy: 90 },
        { month: 'Apr', occupancy: 87 },
        { month: 'May', occupancy: 85 },
        { month: 'Jun', occupancy: 82 },
    ])

    const [blockData] = useState<BlockData[]>([
        { block: 'Block A', occupancy: 95 },
        { block: 'Block B', occupancy: 88 },
        { block: 'Block C', occupancy: 76 },
        { block: 'Block D', occupancy: 92 },
    ])

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Reports & Analysis</h1>
                </div>
                <div className="flex gap-4">
                    <select 
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border rounded-md"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <button className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                    { 
                        icon: <Users className="w-6 h-6" />,
                        label: 'Total Residents',
                        value: '450',
                        change: '+5%',
                        color: 'bg-blue-100'
                    },
                    {
                        icon: <Building className="w-6 h-6" />,
                        label: 'Occupancy Rate',
                        value: '87%',
                        change: '+2%',
                        color: 'bg-green-100'
                    },
                    {
                        icon: <Calendar className="w-6 h-6" />,
                        label: 'Avg. Stay Duration',
                        value: '4.2 months',
                        change: '+0.3',
                        color: 'bg-yellow-100'
                    },
                    {
                        icon: <DollarSign className="w-6 h-6" />,
                        label: 'Revenue',
                        value: '$245,000',
                        change: '+8%',
                        color: 'bg-purple-100'
                    },
                ].map((metric, index) => (
                    <div key={index} className={`${metric.color} p-4 rounded-lg`}>
                        <div className="flex justify-between items-start">
                            {metric.icon}
                            <span className="text-green-600 text-sm">{metric.change}</span>
                        </div>
                        <h3 className="text-lg font-semibold mt-2">{metric.label}</h3>
                        <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Occupancy Trends */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Occupancy Trends</h2>
                        <TrendingUp className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {occupancyData.map((data, index) => (
                            <div key={index} className="flex flex-col items-center gap-2">
                                <div 
                                    className="w-12 bg-primary rounded-t"
                                    style={{ height: `${data.occupancy}%` }}
                                ></div>
                                <span className="text-sm text-gray-600">{data.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Block-wise Distribution */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Block-wise Occupancy</h2>
                        <PieChart className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="space-y-4">
                        {blockData.map((block, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-1">
                                    <span>{block.block}</span>
                                    <span>{block.occupancy}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                        className="bg-primary h-2.5 rounded-full"
                                        style={{ width: `${block.occupancy}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Stats Table */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">Detailed Statistics</h2>
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Previous</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {[
                            { metric: 'New Registrations', current: '45', previous: '38', change: '+18.4%' },
                            { metric: 'Average Occupancy', current: '87%', previous: '85%', change: '+2.3%' },
                            { metric: 'Maintenance Requests', current: '23', previous: '28', change: '-17.8%' },
                            { metric: 'Revenue per Room', current: '$1,200', previous: '$1,150', change: '+4.3%' },
                        ].map((row, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4">{row.metric}</td>
                                <td className="px-6 py-4">{row.current}</td>
                                <td className="px-6 py-4">{row.previous}</td>
                                <td className="px-6 py-4">
                                    <span className={row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                                        {row.change}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ReportAnalysis 
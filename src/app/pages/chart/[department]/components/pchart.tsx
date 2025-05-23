import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define interfaces for type safety
interface DataPoint {
    year: string;
    course: string;
    total_enrolled: number;
    passed: number;
    failed: number;
    sem: number;
}

interface ProcessedDataPoint extends DataPoint {
    proportion: number;
}

interface ChartDataPoint extends ProcessedDataPoint {
    displayLabel: string;
    CL: number;
    UCL1: number;
    UCL2: number;
    UCL3: number;
    LCL1: number;
    LCL2: number;
    LCL3: number;
    sigma: number;
}

// Import TooltipProps from recharts for proper typing
import type { TooltipProps as RechartsTooltipProps } from 'recharts';

const data: DataPoint[] = [
    {
        year: "2021-2022",
        course: "BS02",
        total_enrolled: 47,
        passed: 42,
        failed: 5,
        sem: 1
    },
    {
        year: "2022-2023",
        course: "BS02",
        total_enrolled: 80,
        passed: 70,
        failed: 10,
        sem: 1
    },
    {
        year: "2023-2024",
        course: "BS02",
        total_enrolled: 80,
        passed: 75,
        failed: 5,
        sem: 1
    },
];

const PChart: React.FC = () => {
    // Calculate proportions and statistics
    const processedData: ProcessedDataPoint[] = data.map(item => ({
        ...item,
        proportion: item.passed / item.total_enrolled
    }));

    // Calculate Center Line (CL) - overall average
    const totalPassed: number = data.reduce((sum, item) => sum + item.passed, 0);
    const totalEnrolled: number = data.reduce((sum, item) => sum + item.total_enrolled, 0);
    const CL: number = totalPassed / totalEnrolled;

    // Calculate VARIABLE control limits for each data point
    const chartData: ChartDataPoint[] = processedData.map(item => {
        const n: number = item.total_enrolled; // Individual sample size
        const sigma: number = Math.sqrt((CL * (1 - CL)) / n); // Individual sigma based on sample size
        
        console.log(`n = ${n}`);
        console.log(`CL = ${CL}`);
        console.log(sigma);
        console.log("\n\n\n\n\n");
       
        return {
            ...item,
            displayLabel: `${item.year} ${item.sem === 1 ? '1st' : item.sem === 2 ? '2nd' : `${item.sem}th`} sem`,
            CL: CL,
            // Variable control limits based on individual sample size
            UCL1: CL + 1 * sigma,
            UCL2: CL + 2 * sigma,
            UCL3: CL + 3 * sigma,
            LCL1: Math.max(0, CL - 1 * sigma),
            LCL2: Math.max(0, CL - 2 * sigma),
            LCL3: Math.max(0, CL - 3 * sigma),
            sigma: sigma
        };
    });

    // Dynamic Y-axis calculation
    const allValues: number[] = chartData.flatMap(item => [
        item.proportion, item.CL, item.UCL1, item.UCL2, item.UCL3, item.LCL1, item.LCL2, item.LCL3
    ]).filter(val => val >= 0);

    const minValue: number = Math.min(...allValues);
    const maxValue: number = Math.max(...allValues);
    
    const range: number = maxValue - minValue;
    const padding: number = Math.max(range * 0.15, 0.02);
    
    const yAxisMin: number = Math.max(0, minValue - padding);
    const yAxisMax: number = Math.min(1.2, maxValue + padding);

    const customTooltip = ({ active, payload, label }: RechartsTooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload as ChartDataPoint;
            return (
                <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="font-bold text-gray-800 mb-2">{data.year}</p>
                    <p className="text-gray-600">Enrolled: {data.total_enrolled}</p>
                    <p className="text-gray-600">Passed: {data.passed}</p>
                    <p className="text-gray-600">Failed: {data.failed}</p>
                    <p className="font-bold text-green-600 mt-1">
                        Pass Rate: {(data.proportion * 100).toFixed(1)}%
                    </p>
                    <p className="text-gray-600 mt-1">
                        Standard Devation: {(data.sigma * 100).toFixed(2)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    const formatYAxis = (value: number): string => {
        return (value * 100).toFixed(1) + '%';
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Variable P-Chart: Student Pass Rate Analysis</h2>
                <p className="text-gray-600">Course: BS02 - Control Limits Vary by Sample Size</p>
            </div>

            <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-semibold text-blue-700">Center Line</div>
                    <div className="text-blue-900">{(CL * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="font-semibold text-purple-700">Total Students</div>
                    <div className="text-purple-900">{totalEnrolled}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                    <div className="font-semibold text-green-700"> Data Items </div>
                    <div className="text-green-900"> {data.length}</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg">
                    <div className="font-semibold text-amber-700">Y-Axis Range</div>
                    <div className="text-amber-900">{(yAxisMin * 100).toFixed(1)}% - {(yAxisMax * 100).toFixed(1)}%</div>
                </div>
            </div>

            {/* Chart and Control Limits Container */}
            <div className="mb-6 flex gap-6">
                {/* Control Limits Section for Each Year - Left Side */}
                <div className="w-80 flex-shrink-0 text-sm overflow-auto h-[450px]">
                    <h3 className="text-base font-semibold text-gray-800 mb-3">Control Limits by Year</h3>
                    <div className="space-y-4">
                        {chartData.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg border m-3">
                                <div className="font-semibold text-gray-800 mb-2 text-center">
                                    {item.year} (n={item.total_enrolled})
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                    <div className="bg-red-100 px-1 py-0.5 rounded text-center">
                                        <div className="font-medium text-red-700">UCL3</div>
                                        <div className="text-red-900">{(item.UCL3 * 100).toFixed(1)}%</div>
                                    </div>
                                    <div className="bg-red-100 px-1 py-0.5 rounded text-center">
                                        <div className="font-medium text-red-700">LCL3</div>
                                        <div className="text-red-900">{(item.LCL3 * 100).toFixed(1)}%</div>
                                    </div>
                                    <div className="bg-orange-100 px-1 py-0.5 rounded text-center">
                                        <div className="font-medium text-orange-700">UCL2</div>
                                        <div className="text-orange-900">{(item.UCL2 * 100).toFixed(1)}%</div>
                                    </div>
                                    <div className="bg-orange-100 px-1 py-0.5 rounded text-center">
                                        <div className="font-medium text-orange-700">LCL2</div>
                                        <div className="text-orange-900">{(item.LCL2 * 100).toFixed(1)}%</div>
                                    </div>
                                    <div className="bg-yellow-100 px-1 py-0.5 rounded text-center">
                                        <div className="font-medium text-yellow-700">UCL1</div>
                                        <div className="text-yellow-900">{(item.UCL1 * 100).toFixed(1)}%</div>
                                    </div>
                                    <div className="bg-yellow-100 px-1 py-0.5 rounded text-center">
                                        <div className="font-medium text-yellow-700">LCL1</div>
                                        <div className="text-yellow-900">{(item.LCL1 * 100).toFixed(1)}%</div>
                                    </div>
                                    <div className="bg-green-100 px-1 py-0.5 rounded text-center col-span-2">
                                        <div className="font-medium text-green-700">Standard Devation (σ)</div>
                                        <div className="text-green-900">{(item.sigma * 100).toFixed(2)}%</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart Section - Right Side */}
                <div className="flex-1 h-[480px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="displayLabel" 
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                            />
                            <YAxis 
                                tickFormatter={formatYAxis}
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                                domain={[yAxisMin, yAxisMax]}
                                type="number"
                            />
                            <Tooltip 
                                content={customTooltip}
                            />
                            <Legend 
                                wrapperStyle={{ fontSize: '12px' }}
                                iconType="line"
                            />

                            {/* Variable Control Limits - Upper */}
                            <Line
                                type="linear"
                                dataKey="UCL3"
                                stroke="#dc2626"
                                strokeWidth={2}
                                strokeDasharray="8 8"
                                dot={false}
                                name="UCL (+3σ)"
                                connectNulls={false}
                            />
                            <Line
                                type="linear"
                                dataKey="UCL2"
                                stroke="#f97316"
                                strokeWidth={2}
                                strokeDasharray="6 6"
                                dot={false}
                                name="UCL (+2σ)"
                                connectNulls={false}
                            />
                            <Line
                                type="linear"
                                dataKey="UCL1"
                                stroke="#eab308"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                dot={false}
                                name="UCL (+1σ)"
                                connectNulls={false}
                            />

                            {/* Center Line */}
                            <Line
                                type="linear"
                                dataKey="CL"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={false}
                                name="Center Line"
                            />

                            {/* Variable Control Limits - Lower */}
                            <Line
                                type="linear"
                                dataKey="LCL1"
                                stroke="#eab308"
                                strokeWidth={2}
                                strokeDasharray="4 4"
                                dot={false}
                                name="LCL (-1σ)"
                                connectNulls={false}
                            />
                            <Line
                                type="linear"
                                dataKey="LCL2"
                                stroke="#f97316"
                                strokeWidth={2}
                                strokeDasharray="6 6"
                                dot={false}
                                name="LCL (-2σ)"
                                connectNulls={false}
                            />
                            <Line
                                type="linear"
                                dataKey="LCL3"
                                stroke="#dc2626"
                                strokeWidth={2}
                                strokeDasharray="8 8"
                                dot={false}
                                name="LCL (-3σ)"
                                connectNulls={false}
                            />

                            {/* Actual Data Points */}
                            <Line
                                type="linear"
                                dataKey="proportion"
                                stroke="#059669"
                                strokeWidth={3}
                                dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                                name="Pass Rate"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="w-full overflow-x-auto text-sm">
                <div className="flex space-x-4 min-w-fit p-2">
                    {chartData.map((item, index) => (
                        <div key={index} className="w-[330px] bg-gray-50 p-4 rounded-lg flex-shrink-0 shadow-lg">
                            <div className="font-semibold text-gray-700 mb-2">{item.displayLabel}</div>
                            <div className="space-y-1">
                                <div>Enrolled: {item.total_enrolled}</div>
                                <div>Passed: {item.passed}</div>
                                <div>Failed: {item.failed}</div>
                                <div className="font-semibold text-green-600">
                                    Pass Rate: {(item.proportion * 100).toFixed(1)}%
                                </div>
                                <div className="text-gray-600">
                                    Standard Devation: {(item.sigma * 100).toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        
        </div>
    );
};

export default PChart;
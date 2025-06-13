"use client"
import { useEffect } from 'react';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { courseInterface } from '@/types/interface';
import { getCourseName , convertCodeToName} from '@/utils/customFunction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataPoint {
    gradeLevel: string;
    sem: number;
    batch: string;
    courseCode: string;
    totalEnrolled: number;
    passed: number;
}

interface ProcessedDataPoint extends DataPoint {
    proportion: number;
    failed: number;
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
    isBelowLCL: boolean; // New property to track if point is below LCL
}

// Import TooltipProps from recharts for proper typing
import type { TooltipProps as RechartsTooltipProps } from 'recharts';
import { Http2ServerRequest } from 'http2';

const PChart: React.FC<{selectedDepartment: string, setSelectedDepartment: React.Dispatch<React.SetStateAction<string>>, selectedYear: string, setSelectedYear: (selected : string) => void, data: courseInterface[]}> = ({selectedDepartment, setSelectedDepartment, selectedYear, setSelectedYear, data }) =>  {

   const retention = 0


    // Calculate proportions and statistics
    const processedData: ProcessedDataPoint[] = data.map(item => ({
        ...item,
        proportion: item.passed / item.totalEnrolled,
        failed: item.totalEnrolled - item.passed
    }));

    // Calculate Center Line (CL) - overall average
    const totalPassed: number = data.reduce((sum, item) => sum + item.passed, 0);
    const totalEnrolled: number = data.reduce((sum, item) => sum + item.totalEnrolled, 0);
    const CL: number = totalPassed / totalEnrolled;

    // Calculate VARIABLE control limits for each data point
    const chartData: ChartDataPoint[] = processedData.map(item => {
        const n: number = item.totalEnrolled; // Individual sample size
        const sigma: number = Math.sqrt((CL * (1 - CL)) / n); // Individual sigma based on sample size
        
        const LCL1 = Math.max(0, CL - 1 * sigma);
        
        console.log(`Course: ${item.courseCode}, n = ${n}`);
        console.log(`CL = ${CL}`);
        console.log(`Sigma = ${sigma}`);
        console.log("\n");
       
        return {
            ...item,
            displayLabel: ` ${item.gradeLevel} yr  ${item.sem + ((item.sem == 1) ? "st" : "nd")} sem `,
            CL: CL,
            // Variable control limits based on individual sample size
            UCL1: CL + 1 * sigma,
            UCL2: CL + 2 * sigma,
            UCL3: CL + 3 * sigma,
            LCL1: LCL1,
            LCL2: Math.max(0, CL - 2 * sigma),
            LCL3: Math.max(0, CL - 3 * sigma),
            sigma: sigma,
            isBelowLCL: item.proportion < LCL1 // Check if proportion is below LCL1
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

    // Custom dot function to color dots based on LCL status
    const CustomDot = (props: any) => {
        const { cx, cy, payload } = props;
        const color = payload.isBelowLCL ? '#dc2626' : '#059669'; // Red if below LCL, green otherwise
        
        return (
            <circle 
                cx={cx} 
                cy={cy} 
                r={6} 
                fill={color} 
                stroke={color} 
                strokeWidth={2}
            />
        );
    };

    const customTooltip = ({ active, payload, label }: RechartsTooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload as ChartDataPoint;
            const semText = data.sem === 1 ? '1st' : data.sem === 2 ? '2nd' : `${data.sem}th`;
            
            return (
                <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
                    <p className="font-bold text-gray-800 mb-2">{`${data.courseCode} - ${getCourseName(data.courseCode)} `}</p>
                    <p className="text-gray-600">Batch: {data.batch}</p>
                    <p className="text-gray-600">Year Level: {data.gradeLevel}</p>
                    <p className="text-gray-600">Semester: {semText}</p>
                    <p className="text-gray-600">Enrolled: {data.totalEnrolled}</p>
                    <p className="text-gray-600">Passed: {data.passed}</p>
                    <p className="text-gray-600">Failed: {data.failed}</p>
                    <p className={`font-bold mt-1 ${data.isBelowLCL ? 'text-red-600' : 'text-green-600'}`}>
                        Pass Rate: {(data.proportion * 100).toFixed(1)}%
                    </p>
                    {data.isBelowLCL && (
                        <p className="font-bold text-red-600 text-sm">
                            ⚠️ Below Lower Control Limit
                        </p>
                    )}
                    <p className="text-gray-600 mt-1">
                        Standard Deviation: {(data.sigma * 100).toFixed(2)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    const formatYAxis = (value: number): string => {
        return (value * 100).toFixed(1) + '%';
    };

    // Count points below LCL for summary
    const pointsBelowLCL = chartData.filter(item => item.isBelowLCL).length;

    return (
        <div className="w-full p-6 bg-white rounded-lg">
            <div className="mb-6">
                {selectedYear == "all" ? (<h2 className='text-xl font-bold text-red-500 mb-2'> Select Batch First</h2>) : null}
                <h2 className="text-3xl font-bold text-gray-800 mb-2">  Retention Rate Chart {selectedYear != "all" ? `For Batch ${selectedYear} ` : null}   </h2>
                
                <div className='flex gap-2'>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">  Department:   </h2>


                    <Select  value={selectedDepartment} onValueChange={setSelectedDepartment} disabled={selectedYear == "all"} >
                    <SelectTrigger id="year-select" className="w-[200px] bg-white ">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="all">select Department</SelectItem>
                            <SelectItem value="CE"> Civil Engineering</SelectItem>
                            <SelectItem value="CPE">Computer Engineering</SelectItem>
                            <SelectItem value="EE">Electrical Engineering</SelectItem>
                            <SelectItem value="ECE">Electronics Engineering</SelectItem>
                            <SelectItem value="IE">Industrial Engineering</SelectItem>
                            <SelectItem value="ME">Mechanical Engineering</SelectItem>
                           
                        </SelectContent>
                    </Select>


                   

                </div>
               
                <p className="text-gray-600"> Variable P-Chart: Student Pass Rate Analysis by Batch </p>
                {pointsBelowLCL > 0 && (
                    <p className="text-red-600 font-semibold mt-2">
                        ⚠️ {pointsBelowLCL} course(s) below Lower Control Limit (red dots)
                    </p>
                )}
            </div>

     

           

            {/* Chart and Control Limits Container */}
            <div className=" flex gap-6">
                {/* Chart Section - Right Side */}
                <div className="flex-1 h-[480px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="displayLabel" 
                                tick={{ fontSize: 11 }}
                                stroke="#666"
                                angle={-45}
                                textAnchor="end"
                                height={80}
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

                            {/* Actual Data Points with Custom Dots */}
                            <Line
                                type="linear"
                                dataKey="proportion"
                                stroke="#059669"
                                strokeWidth={3}
                                dot={<CustomDot />}
                                name="Pass Rate"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="w-full overflow-x-auto text-sm">
                <div className="flex space-x-4 min-w-fit p-2">
                    {chartData.map((item, index) => (
                        <div key={index} className={`w-[250px] p-4 rounded-lg flex-shrink-0 shadow-lg ${item.isBelowLCL ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                            <div className="font-semibold text-gray-700 mb-2">
                                {item.courseCode} - Yr {item.gradeLevel}, Sem {item.sem}
                                {item.isBelowLCL && <span className="text-red-600 ml-2">⚠️</span>}
                            </div>
                            <div className="space-y-1">
                                <div>Batch: {item.batch}</div>
                                <div>Enrolled: {item.totalEnrolled}</div>
                                <div>Passed: {item.passed}</div>
                                <div>Failed: {item.failed}</div>
                                <div className={`font-semibold ${item.isBelowLCL ? 'text-red-600' : 'text-green-600'}`}>
                                    Pass Rate: {(item.proportion * 100).toFixed(1)}%
                                </div>
                                {item.isBelowLCL && (
                                    <div className="font-semibold text-red-600 text-sm">
                                        Below LCL (-1σ): {(item.LCL1 * 100).toFixed(1)}%
                                    </div>
                                )}
                                <div className="text-gray-600">
                                    Standard Deviation: {(item.sigma * 100).toFixed(2)}%
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
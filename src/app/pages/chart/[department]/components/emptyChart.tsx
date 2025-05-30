


"use client"
import { useEffect, useState } from 'react';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { courseInterface, deleteItemCourse } from '@/types/interface';
import { getAllCourseCode, getCourseName, getSortedCourses } from '@/utils/customFunction';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { successAlert, errorAlert, confirmAlert } from '@/utils/alerts';
import { backendUrl } from '@/utils/url';
import PChartComputation from "./computation"

interface DataPoint {
    gradeLevel: string;
    sem: number;
    batch: string;
    courseCode: string;
    totalEnrolled: number;
    passed: number;
}

interface ProcessedDataPoint extends DataPoint {
    proportion: number;  // This will now be failed proportion
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
}

// Import TooltipProps from recharts for proper typing
import type { TooltipProps as RechartsTooltipProps } from 'recharts';
import { Item } from '@radix-ui/react-select';

const PChartSecond: React.FC<{ initialData : courseInterface[] , selectCourse : string,  handleSelectCourse : (selected : string) => void  ,scrollUp : () => void, data: courseInterface[],setDataSavePoint : React.Dispatch<React.SetStateAction<courseInterface[]>>, setData: React.Dispatch<React.SetStateAction<courseInterface[]>> }> = ({initialData, selectCourse, handleSelectCourse, scrollUp, data, setData, setDataSavePoint }) =>  {

   

    const [totalEnrolledInput, setTotalEnrolledInput] = useState("")
    const [totalFailedInput, setTotalFailedInput] = useState("0")
    const [selectedBatch, setSelectedBatch] = useState("all")
  

   

    

   

    // Calculate fixed n as sum of all total enrolled
    const fixedN: number = data.reduce((sum, item) => sum + item.totalEnrolled, 0);

    // Calculate proportions and statistics (now using failed proportion)
    const processedData: ProcessedDataPoint[] = data.map(item => {
        const failed = item.totalEnrolled - item.passed;
        return {
            ...item,
            proportion: failed / item.totalEnrolled,  // Failed proportion
            failed: failed
        };
    });

    // Calculate Center Line (CL) - overall average of failed proportion
    const totalFailed: number = data.reduce((sum, item) => sum + (item.totalEnrolled - item.passed), 0);
    const totalEnrolled: number = data.reduce((sum, item) => sum + item.totalEnrolled, 0);
    const CL: number = totalFailed / totalEnrolled;

    // Calculate FIXED control limits for all data points using fixed n
    const sigma: number = Math.sqrt((CL * (1 - CL)) / fixedN); // Fixed sigma based on total sample size
    
   

    const chartData: ChartDataPoint[] = processedData.map(item => {
        return {
            ...item,
            displayLabel: `${item.batch}`,
            CL: CL,
            // Fixed control limits based on total sample size with bounds
            UCL1: Math.min(1, CL + 1 * sigma),
            UCL2: Math.min(1, CL + 2 * sigma),
            UCL3: Math.min(1, CL + 3 * sigma),
            LCL1: Math.max(0, CL - 1 * sigma),
            LCL2: Math.max(0, CL - 2 * sigma),
            LCL3: Math.max(0, CL - 3 * sigma),
            sigma: sigma
        };
    });

    const allValues: number[] = chartData.flatMap(item => [
        item.proportion, item.CL, item.UCL1, item.UCL2, item.UCL3, item.LCL1, item.LCL2, item.LCL3
    ]).filter(val => val >= 0);

    const minValue: number = Math.min(...allValues);
    const maxValue: number = Math.max(...allValues);
    
    const range: number = maxValue - minValue;
    const padding: number = Math.max(range * 0.15, 0.02);
    
    const yAxisMin: number = Math.max(0, minValue - padding);
    const yAxisMax: number = Math.min(1.2, maxValue + padding);


    console.log(sigma)
    console.log(CL)
    console.log(chartData)

    
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
                    <p className="font-bold text-stone-600 mt-1">
                        Failure Rate: {(data.proportion * 100).toFixed(1)}%
                    </p>
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

    return (
        <div className="w-full p-6 bg-white rounded-lg relative">

            <Button onClick={scrollUp} className='absolute top-[20px] left-[1200px]'> Scroll Up</Button>

            <div className="mb-6">

                <div className='flex gap-2'>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2"> Subject:   </h2>

                    {(initialData.length != 0) ?
                    <Select  value={selectCourse} onValueChange={handleSelectCourse} >
                        <SelectTrigger id="year-select" className="w-[570px] bg-white mb-2">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent >
                                <SelectItem value="all"> Select Subject </SelectItem>
                                {
                                getAllCourseCode(getSortedCourses(initialData)).map((course : courseInterface ) => (
                                    <SelectItem key={course.courseCode} value={course.courseCode} >
                                    <div className="flex items-center w-full">
                                    <span className="truncate flex-1 mr-4">
                                        {`${course.gradeLevel} yr | sem - ${course.sem} ${getCourseName(course.courseCode)} - ${course.courseCode}`}
                                    </span>
                                    </div>
                                </SelectItem>
                                ))
                                }
                        </SelectContent>  
                    </Select>


                :null}

                </div>

                    

                    
                    

                <p className="text-gray-600"> Variable P-Chart: Student Failure Rate Analysis by Subject</p>
                </div>

            <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-semibold text-blue-700">Center Line</div>
                    <div className="text-blue-900">{0}%</div>
                </div>

                <div className="bg-purple-100 p-3 rounded-lg">
                    <div className="font-semibold text-purple-700"> Total Students</div>
                    <div className="text-purple-900">{0}</div>
                </div>
                
                <div className="bg-green-100 p-3 rounded-lg">
                    <div className="font-medium text-green-700">Standard Deviation (σ)</div>
                    <div className="text-green-900">{0}%</div>
                </div>


                <div className="bg-red-100 p-3 shadow rounded-lg">
                    <div className="font-medium text-red-700"> UCL (+3σ)</div>
                    <div className="text-red-900">{0}%</div>
                </div>

                <div className="bg-orange-100 p-3 shadow rounded-lg">
                    <div className="font-semibold text-orange-700">UCL (+2σ)</div>
                    <div className="text-orange-900">{0}%</div>
                </div>

                <div className="bg-yellow-100 p-3 shadow rounded-lg">
                    <div className="font-semibold text-yellow-700">UCL (+1σ)</div>
                    <div className="text-yellow-900">{0}%</div>
                </div>


                <div className="bg-red-100 p-3 shadow rounded-lg">
                    <div className="font-medium text-red-700">LCL (-3σ)</div>
                    <div className="text-red-900">{0}%</div>
                </div>

                <div className="bg-orange-100 p-3 shadow rounded-lg">
                    <div className="font-semibold text-orange-700">LCL (-2σ)</div>
                    <div className="text-orange-900">{0}%</div>
                </div>

                <div className="bg-yellow-100 p-3 shadow rounded-lg">
                    <div className="font-semibold text-yellow-700">LCL (-1σ)</div>
                    <div className="text-yellow-900">{0}%</div>
                </div>     
            </div>

           

            {/* Chart and Control Limits Container */}
            <div className=" flex gap-6">
                {/* Chart Section - Right Side */}
                <div className='h-[320px] w-[500px]'>
                    <div className='w-full h-5/6 overflow-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Batch</TableHead>
                                    <TableHead>Year & Sem</TableHead>
                                    <TableHead>enrolled</TableHead>
                                    <TableHead>Failed</TableHead>
                                    <TableHead> Fail Rate</TableHead>
                                    <TableHead> Remove</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chartData.length > 0 ? (
                                    chartData.map((item, index) => (
                                        <TableRow key={index}>
                                         
                                            <TableCell>{item.batch}</TableCell>
                                            <TableCell>{`${item.gradeLevel} yr - ${item.sem == 1 ? "1st sem" : "2nd"}`}</TableCell>
                                            <TableCell>{(item.totalEnrolled )}</TableCell>
                                            <TableCell>{(item.totalEnrolled - item.passed)}</TableCell>
                                            <TableCell>{(item.proportion * 100).toFixed(1)}% </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-4">
                                            No data found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>


                <div className="flex-1 h-[380px]">
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

                            {/* Fixed Control Limits - Upper */}
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

                            {/* Fixed Control Limits - Lower */}
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

                            {/* Actual Data Points - Color based on UCL comparison */}
                            <Line
                              
                                type="linear"
                                dataKey="proportion"
                                stroke="green"
                                strokeWidth={3}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    const isOutOfControl = payload.proportion > payload.UCL3;
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={6}
                                            fill={isOutOfControl ? '#dc2626' : '#16a34a'}
                                            stroke={isOutOfControl ? '#dc2626' : '#16a34a'}
                                            strokeWidth={2}
                                        />
                                    );
                                }}
                                name="Failure Rate"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <Button onClick={scrollUp} className='w-full'> Scroll Up</Button>
        </div>
    );
};

export default PChartSecond;
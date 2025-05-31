"use client"
import { useEffect, useState } from 'react';
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
    isAboveUCL3: boolean; // New property to track if point is above UCL3
}

// Import TooltipProps from recharts for proper typing
import type { TooltipProps as RechartsTooltipProps } from 'recharts';

const PChart: React.FC<{selectedDepartment: string, setSelectedDepartment: React.Dispatch<React.SetStateAction<string>>, selectedYear: string, setSelectedYear: React.Dispatch<React.SetStateAction<string>>, data: courseInterface[]}> = ({selectedDepartment, setSelectedDepartment, selectedYear, setSelectedYear, data }) =>  {

   const [sortedData, setSortedData] = useState<courseInterface[]>(data)

   let retention =  0
 
   let highestEnrolled1st;
   let highestPassedLast;
   
   //(sortedData[sortedData.length - 1].totalEnrolled  / sortedData[0].totalEnrolled) * 100

   try{
    switch(sortedData.length != 0 ? sortedData[sortedData.length - 1].gradeLevel : "none")
    {
     case "1st":
         highestEnrolled1st = sortedData
         .filter(item => item.gradeLevel === "1st" && item.sem === 1)
         .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
       
       // Get highest passed in 4th year, 2nd sem
        highestPassedLast = sortedData
         .filter(item => item.gradeLevel === "1st" && item.sem === 2)
         .reduce((max, item) => (item.passed > max.passed ? item : max));
       
       console.log("Highest Enrolled in 1st Year Sem 1:", highestEnrolled1st.totalEnrolled);
       console.log("Highest Passed in 4th Year Sem 2:", highestPassedLast.passed);
 
       retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
       retention = (retention > 100) ? 100 : retention
     break;
 
     case "2nd":
         highestEnrolled1st = sortedData
         .filter(item => item.gradeLevel === "1st" && item.sem === 1)
         .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
       
       // Get highest passed in 4th year, 2nd sem
        highestPassedLast = sortedData
         .filter(item => item.gradeLevel === "2nd" && item.sem === 2)
         .reduce((max, item) => (item.passed > max.passed ? item : max));
       
       console.log("Highest Enrolled in 1st Year Sem 1:", highestEnrolled1st.totalEnrolled);
       console.log("Highest Passed in 4th Year Sem 2:", highestPassedLast.passed);
 
       retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
       retention = (retention > 100) ? 100 : retention
     break;
 
     case "3rd":
         highestEnrolled1st = sortedData
         .filter(item => item.gradeLevel === "1st" && item.sem === 1)
         .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
 
         // Get highest passed in 4th year, 2nd sem
         highestPassedLast = sortedData
         .filter(item => item.gradeLevel === "3rd" && item.sem === 2)
         .reduce((max, item) => (item.passed > max.passed ? item : max));
 
         console.log("Highest Enrolled in 1st Year Sem 1:", highestEnrolled1st.totalEnrolled);
         console.log("Highest Passed in 4th Year Sem 2:", highestPassedLast.passed);
 
         retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
         retention = (retention > 100) ? 100 : retention
     break;
 
 
     case "4th":
         highestEnrolled1st = sortedData
         .filter(item => item.gradeLevel === "1st" && item.sem === 1)
         .reduce((max, item) => (item.totalEnrolled > max.totalEnrolled ? item : max));
       
       // Get highest passed in 4th year, 2nd sem
        highestPassedLast = sortedData
         .filter(item => item.gradeLevel === "4th" && item.sem === 2)
         .reduce((max, item) => (item.passed > max.passed ? item : max));
       
       console.log("Highest Enrolled in 1st Year Sem 1:", highestEnrolled1st.totalEnrolled);
       console.log("Highest Passed in 4th Year Sem 2:", highestPassedLast.passed);
 
       retention = ( highestPassedLast.passed / highestEnrolled1st.totalEnrolled )* 100
       retention = (retention > 100) ? 100 : retention
     break;
    }
 
   } catch (e) {
    console.log("no data for 2nd sem")
   }
   
   

   const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>("4th")

   useEffect(() => {
    setSortedData(data)
    setSelectedGradeLevel("4th")
   }, [data])


   const handleSelectedGradeLevel = (selected : string) => {
        setSelectedGradeLevel(selected)
        switch(selected)
        {
            case "4th":
                setSortedData(data)
            break

            case "3rd":
                setSortedData(data.filter((item) => ["1st", "2nd", "3rd"].includes(item.gradeLevel)))
            break


            case "2nd":
                setSortedData(data.filter((item) => ["1st", "2nd"].includes(item.gradeLevel)))
            break


            case "1st":
                setSortedData(data.filter((item) => ["1st"].includes(item.gradeLevel)))
            break
        }
   }

    // Calculate proportions and statistics (now for FAILURE rates)
    const processedData: ProcessedDataPoint[] = sortedData.map(item => ({
        ...item,
        proportion: (item.totalEnrolled - item.passed) / item.totalEnrolled, // FAILURE proportion
        failed: item.totalEnrolled - item.passed
    }));

    // Calculate Center Line (CL) - overall average FAILURE rate
    const totalFailed: number = sortedData.reduce((sum, item) => sum + (item.totalEnrolled - item.passed), 0);
    const totalEnrolled: number = sortedData.reduce((sum, item) => sum + item.totalEnrolled, 0);
    const CL: number = totalFailed / totalEnrolled;

    // FIXED sample size for consistent standard deviation
    const fixedN: number = 100; // You can adjust this value as needed
    const sigma: number = Math.sqrt((CL * (1 - CL)) / fixedN); // FIXED sigma for all points

    // Calculate FIXED control limits for all data points
    const chartData: ChartDataPoint[] = processedData.map(item => {
        const LCL1 = Math.max(0, CL - 1 * sigma);

       
        return {
            ...item,
            displayLabel: ` ${item.gradeLevel} yr  ${item.sem + ((item.sem == 1) ? "st" : "nd")} sem `,
            CL: CL,
            // FIXED control limits based on fixed sample size
            UCL1: CL + 1 * sigma,
            UCL2: CL + 2 * sigma,
            UCL3: CL + 3 * sigma,
            LCL1: LCL1,
            LCL2: Math.max(0, CL - 2 * sigma),
            LCL3: Math.max(0, CL - 3 * sigma),
            sigma: sigma,
            isAboveUCL3: item.proportion > (CL + 3 * sigma) // Check if proportion is above UCL3
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

    // Custom dot function to color dots based on UCL3 status
    const CustomDot = (props: any) => {
        const { cx, cy, payload } = props;
        const color = payload.isAboveUCL3 ? '#dc2626' : '#059669'; // Red if above UCL3, green otherwise
        
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
                    <p className={`font-bold mt-1 ${data.isAboveUCL3 ? 'text-red-600' : 'text-green-600'}`}>
                        Failure Rate: {(data.proportion * 100).toFixed(1)}%
                    </p>
                    {data.isAboveUCL3 && (
                        <p className="font-bold text-red-600 text-sm">
                            ⚠️ Above Upper Control Limit (UCL +3σ)
                        </p>
                    )}
                    <p className="text-gray-600 mt-1">
                        Standard Deviation: {(data.sigma * 100).toFixed(2)}% (Fixed)
                    </p>
                </div>
            );
        }
        return null;
    };

    const formatYAxis = (value: number): string => {
        return (value * 100).toFixed(1) + '%';
    };

    // Count points above UCL3 for summary
    const pointsAboveUCL3 = chartData.filter(item => item.isAboveUCL3).length;

    return (
        <div className="w-full p-6 bg-white rounded-lg">
            <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">  Retention Rate Chart   </h2>

            <div className='flex gap-2'>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">  Department:   </h2>

                    <Select  value={selectedDepartment} onValueChange={setSelectedDepartment} >
                    <SelectTrigger id="year-select" className="w-[200px] bg-white ">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="CE"> Civil Engineering</SelectItem>
                            <SelectItem value="CPE">Computer Engineering</SelectItem>
                            <SelectItem value="EE">Electrical Engineering</SelectItem>
                            <SelectItem value="ECE">Electronics Engineering</SelectItem>
                            <SelectItem value="IE">Industrial Engineering</SelectItem>
                            <SelectItem value="ME">Mechanical Engineering</SelectItem>
                           
                        </SelectContent>
                    </Select>


                    <Select  value={selectedYear} onValueChange={setSelectedYear} >
                    <SelectTrigger id="year-select" className="w-[130px] bg-white ">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="all"> Select Batch </SelectItem>
                            <SelectItem value="2020-2024">2020-2024</SelectItem>
                            <SelectItem value="2021-2025">2021-2025</SelectItem>
                            <SelectItem value="2022-2026">2022-2026</SelectItem>
                            <SelectItem value="2023-2027">2023-2027</SelectItem>
                            <SelectItem value="2024-2028">2024-2028</SelectItem>
                            <SelectItem value="2025-2029">2025-2029</SelectItem>
                            <SelectItem value="2026-2030">2026-2030</SelectItem>
                            <SelectItem value="2027-2031">2027-2031</SelectItem>
                        </SelectContent>
                    </Select>


                    <Select  value={selectedGradeLevel} onValueChange={handleSelectedGradeLevel} >
                    <SelectTrigger id="year-select" className="w-[140px] bg-white ">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="4th"> 1st to 4th year</SelectItem>
                            <SelectItem value="3rd">1st to 3rd year</SelectItem>
                            <SelectItem value="2nd">1st to 2nd year</SelectItem>
                            <SelectItem value="1st">1st year only </SelectItem>
                        </SelectContent>
                    </Select>

                </div>

                <p className="text-gray-600"> Fixed P-Chart: Student Failure Rate Analysis by Batch (Fixed Standard Deviation) </p>
                {pointsAboveUCL3 > 0 && (
                    <p className="text-red-600 font-semibold mt-2">
                        ⚠️ {pointsAboveUCL3} course(s) above Upper Control Limit UCL +3σ (red dots)
                    </p>
                )}
            </div>

            <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-semibold text-blue-700">Center Line</div>
                    <div className="text-blue-900">{(CL * 100).toFixed(1)}%</div>
                </div>

                <div className="bg-purple-100 p-3 rounded-lg">
                    <div className="font-semibold text-purple-700"> Total Students</div>
                    <div className="text-purple-900">{fixedN}</div>
                </div>
                
                <div className="bg-green-100 p-3 rounded-lg">
                    <div className="font-medium text-green-700">Standard Deviation (σ)</div>
                    <div className="text-green-900">{(sigma * 100).toFixed(2)}%</div>
                </div>


                <div className="bg-red-100 p-3 shadow rounded-lg">
                    <div className="font-medium text-red-700"> UCL (+3σ)</div>
                    <div className="text-red-900">{(Math.min(chartData[0].UCL3, 1) * 100).toFixed(1)}%</div>
                </div>

                <div className="bg-orange-100 p-3 shadow rounded-lg">
                    <div className="font-semibold text-orange-700">UCL (+2σ)</div>
                    <div className="text-orange-900">{(Math.min(chartData[0].UCL2, 1) * 100).toFixed(1)}%</div>
                </div>

                <div className="bg-yellow-100 p-3 shadow rounded-lg">
                    <div className="font-semibold text-yellow-700">UCL (+1σ)</div>
                    <div className="text-yellow-900">{(Math.min(chartData[0].UCL1, 1) * 100).toFixed(1)}%</div>
                </div>


                <div className="bg-red-100 p-3 shadow rounded-lg">
                    <div className="font-medium text-red-700">LCL (-3σ)</div>
                    <div className="text-red-900">{(Math.min(chartData[0].LCL3, 1) * 100).toFixed(1)}%</div>
                </div>

                <div className="bg-orange-100 p-3 shadow rounded-lg">
                    <div className="font-semibold text-orange-700">LCL (-2σ)</div>
                    <div className="text-orange-900">{(Math.min(chartData[0].LCL2, 1) * 100).toFixed(1)}%</div>
                </div>

                <div className="bg-yellow-100 p-3 shadow rounded-lg">
                    <div className="font-semibold text-yellow-700">LCL (-1σ)</div>
                    <div className="text-yellow-900">{(Math.min(chartData[0].LCL1, 1) * 100).toFixed(1)}%</div>
                </div>     
            </div>

            <div className="bg-green-100 p-3 rounded-lg shadow mb-2">
                    <div className="font-semibold text-green-700"> Retention Rate</div>
                    {(retention != 0
                        ?  <div className="text-green-900">{retention.toFixed(1)}%  {(sortedData[sortedData.length - 1].gradeLevel != "4th") ? ` As Of ${sortedData[sortedData.length - 1].gradeLevel} Year` : " "}</div>
                        :  <div className="text-green-900"> Data Encoding is not Complete no 2nd Sem Found  </div>
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

                            {/* Actual Data Points with Custom Dots */}
                            <Line
                                type="linear"
                                dataKey="proportion"
                                stroke="#059669"
                                strokeWidth={3}
                                dot={<CustomDot />}
                                name="Failure Rate"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="w-full overflow-x-auto text-sm">
                <div className="flex space-x-4 min-w-fit p-2">
                    {chartData.map((item, index) => (
                        <div key={index} className={`w-[250px] p-4 rounded-lg flex-shrink-0 shadow-lg ${item.isAboveUCL3 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                            <div className="font-semibold text-gray-700 mb-2">
                                {item.courseCode} - Yr {item.gradeLevel}, Sem {item.sem}
                                {item.isAboveUCL3 && <span className="text-red-600 ml-2">⚠️</span>}
                            </div>
                            <div className="space-y-1">
                                <div>Batch: {item.batch}</div>
                                <div>Enrolled: {item.totalEnrolled}</div>
                                <div>Passed: {item.passed}</div>
                                <div>Failed: {item.failed}</div>
                                <div className={`font-semibold ${item.isAboveUCL3 ? 'text-red-600' : 'text-green-600'}`}>
                                    Failure Rate: {(item.proportion * 100).toFixed(1)}%
                                </div>
                                {item.isAboveUCL3 && (
                                    <div className="font-semibold text-red-600 text-sm">
                                        Above UCL (+3σ): {(item.UCL3 * 100).toFixed(1)}%
                                    </div>
                                )}
                                <div className="text-gray-600">
                                    Standard Deviation: {(item.sigma * 100).toFixed(2)}% (Fixed)
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
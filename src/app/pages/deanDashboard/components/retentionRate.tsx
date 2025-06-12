"use client"
import { useEffect, useState } from 'react';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { courseInterface } from '@/types/interface';
import { getCourseName , convertCodeToName, getRetentionRate} from '@/utils/customFunction';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"




const PChart: React.FC<{   selectedYear: string, setSelectedYear: (selectd : string) => void, data: courseInterface[]}> = ({ selectedYear, setSelectedYear, data }) =>  {

   const [sortedData, setSortedData] = useState<courseInterface[]>(data)

    console.log(data)

   useEffect(() => {
    setSortedData(data)
   }, [data])


   const [CEretention, CEpassed, CEenrolled] = getRetentionRate(data, "CE", selectedYear)
   const [CPEretention, CPEpassed, CPEenrolled] = getRetentionRate(data, "CPE", selectedYear)

   const [EEretention, EEpassed, EEenrolled] = getRetentionRate(data, "EE", selectedYear)
   const [ECEretention, ECEpassed, ECEenrolled] = getRetentionRate(data, "ECE", selectedYear)

   const [IEretention, IEpassed, IEenrolled] = getRetentionRate(data, "IE", selectedYear)
   const [MEretention, MEpassed, MEenrolled] = getRetentionRate(data, "ME", selectedYear)


   const allDepartmentPassed = (CEpassed + CPEpassed + EEpassed + ECEpassed + IEpassed + MEpassed )
   const allDepartmentEnrolled = (CEenrolled + CPEenrolled +EEenrolled+ ECEenrolled + IEenrolled + MEenrolled )

   const allDepartmentRetention = (allDepartmentPassed / allDepartmentEnrolled) * 100
  
   

    return (
        <div className="w-full p-6 bg-white rounded-lg">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">  All Department Retention Rate    </h2>

                <div className='flex gap-2'>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">  Batch:   </h2>
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
                </div>
            </div>
               

            
          

            {sortedData.length !== 0 && (
                <>
                    <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {/* Individual department retention rate cards */}
                    <div className="bg-stone-50 p-3 rounded-lg shadow mb-2">
                        <div className="font-semibold text-stone-700">Civil Engineering Retention Rate</div>
                        {CEretention !== 0
                        ? <div className="text-stone-900">{CEretention.toFixed(1)}%</div>
                        : <div className="text-stone-900">Data Encoding is not Complete no 2nd Sem Found</div>
                        }
                    </div>

                    <div className="bg-stone-50 p-3 rounded-lg shadow mb-2">
                        <div className="font-semibold text-stone-700">Computer Engineering Retention Rate</div>
                        {CPEretention !== 0
                        ? <div className="text-stone-900">{CPEretention.toFixed(1)}%</div>
                        : <div className="text-stone-900">Data Encoding is not Complete no 2nd Sem Found</div>
                        }
                    </div>

                    <div className="bg-stone-50 p-3 rounded-lg shadow mb-2">
                        <div className="font-semibold text-stone-700">Electrical Engineering Retention Rate</div>
                        {EEretention !== 0
                        ? <div className="text-stone-900">{EEretention.toFixed(1)}%</div>
                        : <div className="text-stone-900">Data Encoding is not Complete no 2nd Sem Found</div>
                        }
                    </div>

                    <div className="bg-stone-50 p-3 rounded-lg shadow mb-2">
                        <div className="font-semibold text-stone-700">Electronics Engineering Retention Rate</div>
                        {ECEretention !== 0
                        ? <div className="text-stone-900">{ECEretention.toFixed(1)}%</div>
                        : <div className="text-stone-900">Data Encoding is not Complete no 2nd Sem Found</div>
                        }
                    </div>

                    <div className="bg-stone-50 p-3 rounded-lg shadow mb-2">
                        <div className="font-semibold text-stone-700">Industrial Engineering Retention Rate</div>
                        {IEretention !== 0
                        ? <div className="text-stone-900">{IEretention.toFixed(1)}%</div>
                        : <div className="text-stone-900">Data Encoding is not Complete no 2nd Sem Found</div>
                        }
                    </div>

                    <div className="bg-stone-50 p-3 rounded-lg shadow mb-2">
                        <div className="font-semibold text-stone-700">Mechanical Engineering Retention Rate</div>
                        {MEretention !== 0
                        ? <div className="text-stone-900">{MEretention.toFixed(1)}%</div>
                        : <div className="text-stone-900">Data Encoding is not Complete no 2nd Sem Found</div>
                        }
                    </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg shadow mb-2">
                    <div className="font-semibold text-green-700 text-2xl">All Engineering Department Retention Rate</div>
                    {allDepartmentRetention !== 0
                        ? <div className={` text-1xl font-bold ${( allDepartmentRetention >= 80 ) ? "text-green-500" : "text-red-500"}`} >{allDepartmentRetention.toFixed(1)}% {(sortedData[sortedData.length - 1].gradeLevel != "4th") ? ` As Of ${sortedData[sortedData.length - 1].gradeLevel} Year` : " "}</div>
                        : <div className="text-green-900 text-1xl font-bold ">Data Encoding is not Complete</div>
                    }
                    </div>
                </>
                )}



        
        </div>  
    );
};

export default PChart;
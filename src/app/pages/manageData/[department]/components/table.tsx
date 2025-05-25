"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { bgStyle } from "@/utils/customFunction"
import Image from "next/image"
import { courseInterface } from "@/types/interface"
import { getCourseName } from "@/utils/customFunction"

export default function TableCourse({ course } : { course : courseInterface[]})  {
    
    
     

      const [selectBatch, setSelectBatch] = useState<string>("all")
      const [selectedYear, setSelectedYear] = useState<string>("all")

      const [filteredData, setFilteredData] = useState<courseInterface[]>(course)

      useEffect(() => {
        setFilteredData(course)
        setSelectBatch("all")
        setSelectedYear("all")
      }, [course])


      const parseSelectedYear = (value: string) => {
        const parts = value.split(" ");
        return {
          gradeLevel: parts[0], // e.g. "1st"
          sem: parseInt(parts[2]), // e.g. "1" from "1st yr 1st sem"
        };
      };
      
      const applyFilter = (batch: string, yearValue: string) => {
        let newFilteredData = [...course];
      
        if (batch !== "all") {
          newFilteredData = newFilteredData.filter((item) => item.batch === batch);
        }
      
        if (yearValue !== "all") {
          const { gradeLevel, sem } = parseSelectedYear(yearValue);
          newFilteredData = newFilteredData.filter(
            (item) => item.gradeLevel === gradeLevel && item.sem === sem
          );
        }
      
        setFilteredData(newFilteredData);
      };
      
      const handleFilterBatch = (selected: string) => {
        setSelectBatch(selected);
        applyFilter(selected, selectedYear);
      };
      
      const handleFilterYear = (selected: string) => {
        setSelectedYear(selected);
        applyFilter(selectBatch, selected);
      };
      
    


  return (
    <>
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5 ">
                        <Label className="text-white" htmlFor="year-select">Filter by Batch</Label>
                        <Select  value={selectBatch} onValueChange={handleFilterBatch} >
                        <SelectTrigger id="year-select" className="w-[200px] bg-white">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="all">select Batch</SelectItem>
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

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className="text-white" htmlFor="year-select"> Year Level </Label>
                        <Select  value={selectedYear} onValueChange={handleFilterYear} >
                        <SelectTrigger id="year-select" className="w-[250px] bg-white">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent >
                        <SelectItem value="all">Select Year Level and Sem</SelectItem>
                        <SelectItem value="1st yr 1st sem">1st yr 1st sem</SelectItem>
                        <SelectItem value="1st yr 2nd sem">1st yr 2nd sem</SelectItem>
                        <SelectItem value="2nd yr 1st sem">2nd yr 1st sem</SelectItem>
                        <SelectItem value="2nd yr 2nd sem">2nd yr 2nd sem</SelectItem>
                        <SelectItem value="3rd yr 1st sem">3rd yr 1st sem</SelectItem>
                        <SelectItem value="3rd yr 2nd sem">3rd yr 2nd sem</SelectItem>
                        <SelectItem value="4th yr 1st sem">4th yr 1st sem</SelectItem>
                        <SelectItem value="4th yr 2nd sem">4th yr 2nd sem</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>


                 
                </div>



                
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead> Year Level </TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead> Batch </TableHead>
                        <TableHead>Total Enrolled</TableHead>
                        <TableHead>Passed</TableHead>
                        <TableHead>Failed</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.courseCode}</TableCell>
                            <TableCell>{getCourseName(item.courseCode)}</TableCell>
                            <TableCell>{item.gradeLevel}</TableCell>
                            <TableCell>{item.sem}</TableCell>
                            <TableCell>{item.batch}</TableCell>
                            <TableCell>{item.totalEnrolled}</TableCell>
                            <TableCell>{item.passed}</TableCell>
                            <TableCell>{(item.totalEnrolled - item.passed)}</TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                        No data found
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </div>       
    </>
  )
}

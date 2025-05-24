"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { bgStyle } from "@/utils/customFunction"
import Image from "next/image"



export default function TableCourse() {
    const initialData = [
        {
          year: "2021-2022",
          course: "BS02",
          total_enrolled: 47,
          passed: 42,
          failed: 5,
          sem: 1,
        },
        {
          year: "2022-2023",
          course: "BS02",
          total_enrolled: 80,
          passed: 70,
          failed: 10,
          sem: 1,
        },
        {
          year: "2023-2024",
          course: "BS02",
          total_enrolled: 80,
          passed: 75,
          failed: 5,
          sem: 1,
        },
      ]
    
      const [data, setData] = useState(initialData)
      const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
      const [selectedYear, setSelectedYear] = useState<string>("all")
    
      const handleDelete = (index: number) => {
        setData(data.filter((_, i) => i !== index))
      }

      const filteredData = selectedYear === "all" ? data : data.filter((item) => item.year === selectedYear)


  return (
    <>
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5 ">
                        <Label className="text-white" htmlFor="year-select">Filter by Batch</Label>
                        <Select  value={selectedYear} onValueChange={setSelectedYear} >
                        <SelectTrigger id="year-select" className="w-[200px] bg-white">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="all">select Batch</SelectItem>
                            <SelectItem value="2020-2024">2020-2024</SelectItem>
                            <SelectItem value="2021-2025">2021-2025</SelectItem>
                            <SelectItem value="2022-2026">2022-2026</SelectItem>
                            <SelectItem value="2023-2027">2023-2027</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className="text-white" htmlFor="year-select"> Year Level </Label>
                        <Select  value={selectedYear} onValueChange={setSelectedYear} >
                        <SelectTrigger id="year-select" className="w-[200px] bg-white">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="all">Select Year Level </SelectItem>
                            <SelectItem value="1st">1st</SelectItem>
                            <SelectItem value="2nd">2nd</SelectItem>
                            <SelectItem value="3rd">3rd</SelectItem>
                            <SelectItem value="4th">4th</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>


                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label className="text-white" htmlFor="year-select"> Sem </Label>
                        <Select  value={selectedYear} onValueChange={setSelectedYear} >
                        <SelectTrigger id="year-select" className="w-[200px] bg-white">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="all">Select Sem </SelectItem>
                            <SelectItem value="1">1st</SelectItem>
                            <SelectItem value="2">2nd</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                </div>



                
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead> Year Level </TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Total Enrolled</TableHead>
                        <TableHead>Passed</TableHead>
                        <TableHead>Failed</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.year}</TableCell>
                            <TableCell>{item.sem}</TableCell>
                            <TableCell>{item.course}</TableCell>
                            <TableCell>{item.total_enrolled}</TableCell>
                            <TableCell>{item.passed}</TableCell>
                            <TableCell>{item.failed}</TableCell>
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

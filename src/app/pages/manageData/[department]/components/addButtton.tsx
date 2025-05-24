"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

import { Plus } from "lucide-react";

import {CEcourse, CPEcourse, EEcourse, ECEcourse, IEcourse, MEcourse} from "../DepartmentCourse/course"

import { departmentCourseStructureInterface } from "@/types/interface"


type yearType = "firstYear" | "secondYear" | "thirdYear" | "fourthYear"
type semType = "firstSem" | "secondSem"
type bactchType = "2020-2024" | "2021" | "thirdYear" | "fourthYear"
type BatchYear = "2020-2024" | "2021-2025" | "2022-2026" | "2023-2027" | "2024-2028" | "2025-2029" | "2026-2030" | "2027-2031";

 
export function AddButton() {

    const [open, setOpen] = useState(false)

    const [departmentCourse, setDepartmentCourse] = useState([])
    
    const [selectedDepartment, setSelectedDepartment] = useState("CE");
    const [selectedYear, setSelectedYear] = useState<yearType>("firstYear");
    const [selectedSem, setSelectedSem] = useState<semType>("firstSem");
    const [selectedBatch, setSelectedBatch] = useState("all");
   

    /*
    const mutation = useMutation({
        mutationFn : (data : employeeAddInterface) => axios.post(backendUrl("employee"), data),
        onSuccess : (response : { data : employeeGetInterface[]} ) => {
          setEmployees(response.data)
          successAlert("Employee Added")
        },
        onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
    })*/

      const handleDepartmentChange = ( selected : string ) => {
        setSelectedDepartment(selected)
        setSelectedBatch("all")
      }
      
      const handleYearChange = (selected : yearType ) => {
        setSelectedYear(selected)
        setSelectedBatch("all")
      }

      const handleSenChange = (selected : semType ) => {
        setSelectedSem(selected)
        setSelectedBatch("all")
      }

      const handleBatchChange = (selected : string ) => {
        if(selected == "") return
        setSelectedBatch(selected)
        switch(selectedDepartment)
        {
          case "CE":
            console.log(CEcourse[selectedYear][selectedSem])
          break;

          case "CPE":
            console.log(CPEcourse[selectedYear][selectedSem])
          break;

          case "EE":
            console.log(EEcourse[selectedYear][selectedSem])
          break;

          case "ECE":
            console.log(ECEcourse[selectedYear][selectedSem])
          break;

          case "IE":
            console.log(IEcourse[selectedYear][selectedSem])
          break;

          case "ME":
            console.log(MEcourse[selectedYear][selectedSem])
          break;

          
        }
      }

  
  
    return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)} asChild >
        <Button size={"lg"} variant="default" className="bg-green-500 hover:bg-green-600">  <Plus className=" h-4 w-4 " /> Add </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Data</SheetTitle>
          <SheetDescription>
            you can add Data here. Click Submit  when you're done.
          </SheetDescription>
        </SheetHeader>



          <div className=" rounded-lg p-6 shadow-sm w-full m-auto h-[800px] overflow-auto">

            <div className=" gap-6 mb-3">

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-white" htmlFor="department-select">Filter by Department</Label>
                <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger id="department-select" className="w-[280px] bg-white">
                    <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="CE">Civil Engineering</SelectItem>
                    <SelectItem value="CPE">Computer Engineering</SelectItem>
                    <SelectItem value="EE">Electrical Engineering</SelectItem>
                    <SelectItem value="ECE">Electronics Engineering</SelectItem>
                    <SelectItem value="IE">Industrial Engineering</SelectItem>
                    <SelectItem value="ME">Mechanical Engineering</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Year Dropdown */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-white" htmlFor="year-select">Filter by Year</Label>
                <Select value={selectedYear} onValueChange={handleYearChange} >
                <SelectTrigger id="year-select" className="w-[280px] bg-white">
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="firstYear">1st Year</SelectItem>
                    <SelectItem value="secondYear">2nd Year</SelectItem>
                    <SelectItem value="thirdYear">3rd Year</SelectItem>
                    <SelectItem value="fourthYear">4th Year</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Semester Dropdown */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-white" htmlFor="semester-select">Filter by Semester</Label>
                <Select value={selectedSem} onValueChange={handleSenChange} >
                <SelectTrigger id="semester-select" className="w-[280px] bg-white">
                    <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="firstSem">1st Semester</SelectItem>
                    <SelectItem value="secondSem">2nd Semester</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Status Dropdown */}
            <div className="grid w-full max-w-sm items-center gap-1.5 mb-3">
                <Label className="text-white" htmlFor="status-select"> Batch </Label>
                <Select value={selectedBatch} onValueChange={handleBatchChange} >
                <SelectTrigger id="status-select" className="w-[280px] bg-white">
                    <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                                <SelectItem value="all">Select Batch</SelectItem>
                                <SelectItem value="2020-2024">2020-2024</SelectItem>
                                <SelectItem value="2021-2025">2021-2025</SelectItem>
                                <SelectItem value="2022-2026">2022-2026</SelectItem>
                                <SelectItem value="2023-2027">2023-2027</SelectItem>
                
                                <SelectItem value="2024-2028">2020-2024</SelectItem>
                                <SelectItem value="2025-2029">2021-2025</SelectItem>
                                <SelectItem value="2026-2030">2022-2026</SelectItem>
                                <SelectItem value="2027-2031">2023-2027</SelectItem>
                </SelectContent>
                </Select>
            </div>


            <div className="bg-red-500 w-full h-64">


            </div>



            </div>

            <div className="flex flex-col gap-2">
              <Button  >
                    Submit
              </Button>
            </div>
          </div>


        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit"> Close </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
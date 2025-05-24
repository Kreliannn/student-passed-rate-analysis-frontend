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

 
export function AddButton() {

    const [open, setOpen] = useState(false)
    
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedSem, setSelectedSem] = useState("all");
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

            <div className="grid gap-6 mb-6">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-white" htmlFor="department-select">Filter by Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger id="department-select" className="w-[280px] bg-white">
                    <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="civil-engineering">Civil Engineering</SelectItem>
                    <SelectItem value="computer-engineering">Computer Engineering</SelectItem>
                    <SelectItem value="electrical-engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="electronics-engineering">Electronics Engineering</SelectItem>
                    <SelectItem value="industrial-engineering">Industrial Engineering</SelectItem>
                    <SelectItem value="mechanical-engineering">Mechanical Engineering</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Year Dropdown */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-white" htmlFor="year-select">Filter by Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="year-select" className="w-[280px] bg-white">
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Select Year Level</SelectItem>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Semester Dropdown */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-white" htmlFor="semester-select">Filter by Semester</Label>
                <Select value={selectedSem} onValueChange={setSelectedSem}>
                <SelectTrigger id="semester-select" className="w-[280px] bg-white">
                    <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Select Semester</SelectItem>
                    <SelectItem value="1">1st Semester</SelectItem>
                    <SelectItem value="2">2nd Semester</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Status Dropdown */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-white" htmlFor="status-select"> Batch </Label>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger id="status-select" className="w-[280px] bg-white">
                    <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                                <SelectItem value="all"> select Batch </SelectItem>
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
"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { courseInterface } from "@/types/interface"
import { errorAlert, successAlert } from "@/utils/alerts"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { backendUrl } from "@/utils/url"

export function DeleteButton({ department , setCourseDataGlobal} : { department : string, setCourseDataGlobal : React.Dispatch<React.SetStateAction<courseInterface[]>> }) {

  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSem, setSelectedSem] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");

  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn : () => axios.post(backendUrl("course/delete"), { department : selectedDepartment, gradeLevel : selectedYear, sem : Number(selectedSem), batch : selectedBatch}),
    onSuccess : (response : { data : courseInterface[]} ) => {
      const newCourseData = response.data
      if(department == newCourseData[0].department) setCourseDataGlobal(newCourseData)
      successAlert("Data Deleted successfuly")
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  })


  const handleDelete = () => {
    setOpen(false)
    if(selectedBatch == "all" || selectedDepartment == "all" || selectedYear == "all" || selectedSem == "all") return errorAlert("empty field")
    mutation.mutate()
    }

 
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-600"  onClick={() => setOpen(true)}>
                    <Trash2 className="h-4 w-4" />
                    Delete Data
                </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Data</DialogTitle>
          <DialogDescription>
            Be careful on what you Input
          </DialogDescription>
        </DialogHeader>

       

        <div className="grid gap-6 mb-6">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-white" htmlFor="department-select">Filter by Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger id="department-select" className="w-[380px] bg-white">
                    <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
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
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="year-select" className="w-[380px] bg-white">
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
                <SelectTrigger id="semester-select" className="w-[380px] bg-white">
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
                <SelectTrigger id="status-select" className="w-[380px] bg-white">
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

        <DialogFooter>
          <Button type="submit" onClick={handleDelete}>Delete Permanently</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

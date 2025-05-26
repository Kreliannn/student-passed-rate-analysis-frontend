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
import { useEffect, useState } from "react"
import { courseInterface , deleteItemCourse} from "@/types/interface"
import { errorAlert, successAlert , confirmAlert} from "@/utils/alerts"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { backendUrl } from "@/utils/url"
import {CEcourse, CPEcourse, EEcourse, ECEcourse, IEcourse, MEcourse} from "../DepartmentCourse/course"
import { convertSem, convertYearLevel, getCourseName } from "@/utils/customFunction"
import { useRouter } from "next/navigation"

type yearType = "firstYear" | "secondYear" | "thirdYear" | "fourthYear"
type semType = "firstSem" | "secondSem"
type bactchType = "2020-2024" | "2021" | "thirdYear" | "fourthYear"

 

export function DeleteButton({refreshPage, department , setCourseDataGlobal} : {refreshPage : () => void, department : string, setCourseDataGlobal : React.Dispatch<React.SetStateAction<courseInterface[]>> }) {


  const router = useRouter()

  const [selectedItemToDelete, setselectedItemToDelete] = useState<deleteItemCourse[]>([])

  const [selectedDepartment, setSelectedDepartment] = useState("CE");
  const [selectedYear, setSelectedYear] = useState<yearType>("firstYear");
  const [selectedSem, setSelectedSem] = useState<semType>("firstSem");
  const [selectedBatch, setSelectedBatch] = useState("all");

  const [courseData, setCourseData] = useState<deleteItemCourse[]>([])
  
  const [departmentCourse, setDepartmentCourse] = useState<string[]>([])

  const [open, setOpen] = useState(false);

  const [addedCourse, setAddedCourse] = useState("");

  console.log(selectedItemToDelete)

  

  const mutation = useMutation({
    mutationFn : () => axios.post(backendUrl("course/delete"), { itemToDelete : selectedItemToDelete, department : selectedDepartment}),
    onSuccess : (response : { data : courseInterface[]} ) => {
      const newCourseData = response.data
      if(department == newCourseData[0].department) setTimeout(() => setCourseDataGlobal(newCourseData) , 200) 
      setOpen(false)
      setTimeout(() => refreshPage(), 500)
      setselectedItemToDelete([])
    },
    onError : (err : { request : { response : string}}) => errorAlert(err.request.response)
  })


  const handleDelete = () => {
    setOpen(false)
    if(selectedItemToDelete.length == 0) return errorAlert("select subject first")
    confirmAlert("data will be deleted permanently", "delete", () => {
      console.log(selectedItemToDelete)
      mutation.mutate()
    })
    
    }

    const handleDepartmentChange = ( selected : string ) => {
      setSelectedDepartment(selected)
      setSelectedBatch("all")
      setDepartmentCourse([])
      setselectedItemToDelete([])
    }
    
    const handleYearChange = (selected : yearType ) => {
      setSelectedYear(selected)
      setSelectedBatch("all")
      setselectedItemToDelete([])
    }

    const handleSenChange = (selected : semType ) => {
      setSelectedSem(selected)
      setSelectedBatch("all")
      setselectedItemToDelete([])
    }


    const handleBatchChange = (selected : string ) => {
      if(selected == "") return
      setSelectedBatch(selected)
      switch(selectedDepartment)
      {
        case "CE":
          setDepartmentCourse(CEcourse[selectedYear][selectedSem])
        break;

        case "CPE":
          setDepartmentCourse(CPEcourse[selectedYear][selectedSem])
        break;

        case "EE":
          setDepartmentCourse(EEcourse[selectedYear][selectedSem])
        break;

        case "ECE":
          setDepartmentCourse(ECEcourse[selectedYear][selectedSem])
        break;

        case "IE":
          setDepartmentCourse(IEcourse[selectedYear][selectedSem])
        break;

        case "ME":
          setDepartmentCourse(MEcourse[selectedYear][selectedSem])
        break;
      }

     
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

       

        <div className=" gap-6 mb-6">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-white" htmlFor="department-select">Filter by Department</Label>
                <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger id="department-select" className="w-[380px] bg-white">
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
                <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger id="year-select" className="w-[380px] bg-white">
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
                <Select value={selectedSem} onValueChange={handleSenChange}>
                <SelectTrigger id="semester-select" className="w-[380px] bg-white">
                    <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
              
                    <SelectItem value="firstSem">1st Semester</SelectItem>
                    <SelectItem value="secondSem">2nd Semester</SelectItem>
                </SelectContent>
                </Select>
            </div>

            {/* Status Dropdown */}
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label className="text-white" htmlFor="status-select"> Batch </Label>
                <Select value={selectedBatch} onValueChange={handleBatchChange}>
                <SelectTrigger id="status-select" className="w-[380px] bg-white">
                    <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                                <SelectItem value="all">Select Batch </SelectItem>
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




                {
              selectedBatch !== "all" && (
                <div className="w-full h-32 overflow-x-hidden" >
                 {departmentCourse.map((courseName) => (
                  <div className="w-full p-2 flex justify-between items-center " key={courseName}>
                  <label className="text-sm font-bold text-gray-800">
                    {`${courseName} - ${getCourseName(courseName)}`}
                  </label>
                  <input type="checkbox" onChange={(e) => {
                      if(e.target.checked)
                      {
                  
                        const item : deleteItemCourse = {
                          department : selectedDepartment,
                          gradeLevel : convertYearLevel(selectedYear), 
                          sem : convertSem(selectedSem),
                          batch : selectedBatch,
                          courseCode : courseName,
                        }
                        setselectedItemToDelete((prev) => [...prev, item])
                      }
                      else
                      {
                        setselectedItemToDelete((prev) => prev.filter((item) => item.courseCode != courseName ))
                      }
                  }} />
                </div>
                
                  ))}
                </div>
              )
            }





            </div>

        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleDelete}>Delete Permanently</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

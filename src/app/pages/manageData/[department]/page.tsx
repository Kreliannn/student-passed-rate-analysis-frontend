"use client"

import { use, useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useParams } from "next/navigation"
import { bgStyle } from "@/utils/customFunction"
import Image from "next/image"
import { DeleteButton } from "./components/deleteButton"
import TableCourse from "./components/table"
import { convertCodeToName } from "@/utils/customFunction"
import { AddButton } from "./components/addButtton"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { backendUrl } from "@/utils/url"
import { courseInterface } from "@/types/interface"

export default function LandingPage() {
      
      const params = useParams()
      const department = params.department as string
    
      const [courseData, setCourseData] = useState<courseInterface[]>([])
      const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

      const { data } = useQuery({
        queryKey : ['course'],
        queryFn : () => axios.get(backendUrl("course/" + department))
      })

      useEffect(() => {
        console.log("USE EFFECT")
        if(data?.data)
        {
            setCourseData(data.data)
            console.log(data.data)
        }
      }, [data])
    

  return (
    <div className="min-h-screen " style={bgStyle}>
        <div className="h-dvh w-full  overflow-auto">
          
        <div className="w-full flex items-center justify-between p-6">
            <Image src="/logo1.png" alt="Logo 1" width={80} height={80} className="object-contain rounded-full" />
            <h2 className="text-xl md:text-2xl font-medium text-white">Southern Luzon State University</h2>
            <Image src="/logo2.png" alt="Logo 2" width={80} height={80} className="object-contain rounded-full" />
      </div>

        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-2">

                <div className="flex items-center gap-4 w-4/6  h-10">
                    <h1 className="text-3xl font-bold text-white"> Department Of  {convertCodeToName(department)} ({department}) </h1>
                </div>

                <div className="flex justify-end  gap-4 w-2/6  h-10">

                    <DeleteButton department={department} setCourseDataGlobal={setCourseData}/>

                    <AddButton department={department} setCourseDataGlobal={setCourseData}/>
                
                </div>

               
            </div>

            <div className=" rounded-md ">
                {courseData.length != 0 ?  <TableCourse course={courseData} /> : null}
            </div>
        </div>
           
        </div>
    </div>
  )
}










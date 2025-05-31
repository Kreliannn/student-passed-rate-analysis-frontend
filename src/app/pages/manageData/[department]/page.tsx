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
import { useRouter } from "next/navigation"

export default function LandingPage() {

      const router = useRouter()
      
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


      const refreshPage = () => {
        window.location.reload()
        console.log("refresh")
      }
    

  return (
    <div className="min-h-screen " style={bgStyle}>
        <div className="h-dvh w-full  overflow-auto">
          
        <div className="w-full flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            {/* Left Logo */}
            <Image
              src="/logo1.png"
              alt="Logo 1"
              width={80}
              height={80}
              className="object-contain rounded-full"
            />
            {/* Text close to Left Logo */}
            <div className="">
              <h2 className="text-xl md:text-3xl font-medium text-white">
                Southern Luzon State University
              </h2>
              <h3 className="font-bold text-muted">
                College of Engineering
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Button close to Right Logo */}
            <div className="" onClick={() => router.push("/pages/departments_2")}>
              <Button>Back</Button>
            </div>
            {/* Right Logo */}
            <Image
              src="/logo2.png"
              alt="Logo 2"
              width={80}
              height={80}
              className="object-contain rounded-full"
            />
          </div>
        </div>

        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-2">

                <div className="flex items-center gap-4 w-4/6  h-10">
                    <h1 className="text-3xl font-bold text-white"> Department Of  {convertCodeToName(department)} ({department}) </h1>
                </div>

                <div className="flex justify-end  gap-4 w-2/6  h-10">

                   
                
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










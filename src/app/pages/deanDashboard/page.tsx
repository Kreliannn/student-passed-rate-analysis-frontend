"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { bgStyle, convertCodeToName, getCourseName } from "@/utils/customFunction"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

import { useParams } from "next/navigation"
import { useState, useRef } from "react"
import { courseInterface } from "@/types/interface"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { backendUrl } from "@/utils/url"
import { getSortedCourses } from "@/utils/customFunction"
import { getAllCourseCode } from "@/utils/customFunction"
import RetentionRateSection from "./components/retentionRate"
import { getCL } from "@/utils/customFunction"
import { getSortedCoursesByYear } from "@/utils/customFunction"

import Pchart from "./components/Pchart"
import  EmptyPchart_2 from "./components/emptyChart"
import GenerateReport from "./components/generateReport"

export default function LandingPage() {
 
  const router = useRouter()



  const [selectedDepartment, setSelectedDepartment] = useState<string>("CE")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedBatch, setSelectedBatch] = useState<string>("all")
  const [data, setData] = useState<courseInterface[]>([])

  const [batchData, setBatchData] = useState<courseInterface[]>([])

  const [allData, setAllData] = useState<courseInterface[]>([])
 

 

  const [coursedataChart, setCoursedataChart] = useState<courseInterface[]>([])

  const [coursedataChartSavePoint, setCoursedataChartSavePoint] = useState<courseInterface[]>([])

  
  const handleSelectCourse = (selected : string) => {
    setSelectedCourse(selected)
    setCoursedataChart(coursedataChartSavePoint.filter((course : courseInterface) => course.courseCode == selected ))
  }


  const { data : courseData  } = useQuery({
    queryKey : ['courseall'],
    queryFn : () => axios.get(backendUrl("courseAll"))
  })

  

  useEffect(() => {
    if(courseData?.data)
    {
      setCoursedataChartSavePoint(courseData?.data.filter((course : courseInterface) => course.department == "CE" ))
      setAllData(courseData?.data)
    }
  }, [courseData])

  // Ref for scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null)



  useEffect(() => {
    if(selectedYear != "all" && courseData?.data)
    {
      const getByBatch = coursedataChartSavePoint.filter((course : courseInterface) => course.batch == selectedYear )
      setData(getSortedCourses(getByBatch))
    }
    else
    {
      setData([])
    }
  }, [selectedYear])


  
  useEffect(() => {
    if (data.length > 0) {
      scrollContainerRef.current?.scrollTo({ top: 800, behavior: "smooth" });
    }
  }, [data]);

  const handleSelectedBatch = (selected : string) => {
    setSelectedBatch(selected)
    if(selected == "all")
    {
      setBatchData([])
      return
    }
    const getByBatch = allData.filter((course : courseInterface) => course.batch == selected )
    setBatchData(getSortedCourses(getByBatch))
  }

  const scrollDown = () => {
    scrollContainerRef.current?.scrollTo({ top: 800, behavior: "smooth" });
  }



  useEffect(() => {
    if(courseData?.data)
    {
      const getByDepartment = allData.filter((course : courseInterface) => course.department == selectedDepartment )
      setCoursedataChartSavePoint(getSortedCourses(getByDepartment))
      setData([])
      setSelectedYear("all")
    }
    else
    {
      setData([])
    }
  }, [selectedDepartment])
  
 


  return (
    <div className="min-h-screen" style={bgStyle}>
      <div ref={scrollContainerRef} className="h-dvh w-full overflow-auto relative">


       

         
    


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
            <div className="">
              <Button onClick={() => router.push("/pages/deanMainPage")  }>Back</Button>
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


      

        <div className="m-auto p-5">
            {courseData?.data
            ?  <RetentionRateSection data={batchData} setSelectedYear={handleSelectedBatch} selectedYear={selectedBatch} />  
            : <div> none </div>
            }
        </div>

        <div className="m-auto p-5">
          <GenerateReport data={batchData} selectedYear={selectedBatch} />
        </div>
      

  
        <div className="m-auto p-5">
            {data.length !== 0 
            ? <Pchart scrollDown={scrollDown} selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment}   data={data} setSelectedYear={setSelectedYear} selectedYear={selectedYear} /> 
            : <EmptyPchart_2 selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment}  setSelectedYear={setSelectedYear} selectedYear={selectedYear} data={data} />}
        </div>
      

          <br /><br /><br />
      </div>
    </div>
  )
}

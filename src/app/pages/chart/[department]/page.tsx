"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { bgStyle, convertCodeToName, getCourseName } from "@/utils/customFunction"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Pchart from "./components/pchart"
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
import PChartSecond from "./components/second_pchart"


export default function LandingPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.department as string
  const departmentName = convertCodeToName(code)


  
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [data, setData] = useState<courseInterface[]>([])
  const [sortedData, setSortedData] = useState<courseInterface[]>([])

  const [coursedataChart, setCoursedataChart] = useState<courseInterface[]>([])

  
  const handleSelectCourse = (selected : string) => {
    setSelectedCourse(selected)
    setCoursedataChart(courseData?.data.filter((course : courseInterface) => course.courseCode == selected ))
  }


  const { data : courseData  } = useQuery({
    queryKey : ['course'],
    queryFn : () => axios.get(backendUrl("course/" + code))
  })

  

  useEffect(() => {
    if(courseData?.data)
    {
      setSortedData(getSortedCourses(courseData?.data))
    }
  }, [courseData])

  // Ref for scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(selectedYear != "all" && courseData?.data)
    {
      const getByBatch = courseData.data.filter((course : courseInterface) => course.batch == selectedYear )
      setData(getSortedCourses(getByBatch))
    }
    else
    {
      setData([])
    }
  }, [selectedYear])

  useEffect(() => {
    if (data.length > 0) {
      scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" });
    }
  }, [data]);


  useEffect(() => {
    if(data.length == 0 && selectedCourse != "all") scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" })
    else if(selectedCourse != "all") scrollContainerRef.current?.scrollTo({ top: 2450, behavior: "smooth" })
  }, [ selectedCourse]);
  
 

  return (
    <div className="min-h-screen" style={bgStyle}>
      <div ref={scrollContainerRef} className="h-dvh w-full overflow-auto">



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
              <Button onClick={() => router.push("/pages/departments")}>Back</Button>
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


        <div className="w-4/6 h-[50px] m-auto flex items-center justify-between px-4 rounded-lg">
             


                {(courseData?.data) ?
                  <Select  value={selectedCourse} onValueChange={handleSelectCourse} >
                    <SelectTrigger id="year-select" className="w-[200px] bg-white">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                      <SelectContent >
                            <SelectItem value="all"> Select Subject </SelectItem>
                            {
                              getAllCourseCode(getSortedCourses(courseData?.data)).map((course : courseInterface ) => (
                                <SelectItem key={course.courseCode} value={course.courseCode}> {`${course.gradeLevel} yr | sem - ${course.sem} ${course.courseCode} - ${getCourseName(course.courseCode)}`} </SelectItem>
                              ))
                            }
                      </SelectContent>  
                    </Select>
                : null}


              <h1 className="text-3xl text-white text-center font-bold ">
                {departmentName} ({code})
              </h1>
     

              
        </div>

      
        <div className="w-4/6 h-[750px] bg-red-900 m-auto rounded relative">
          <Image
            src={`/${code}.jpg`}
            alt="Logo 2"
            fill
            className="object-contain rounded"
            sizes="(max-width: 768px) 100vw, 83vw"
            quality={100}
            priority
          />
        </div>
       


      
      {
        /*
                   <Select  value={selectedYear} onValueChange={setSelectedYear} >
                  <SelectTrigger id="year-select" className="w-[200px] bg-white">
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



          <div className="m-auto p-5">
            {data.length !== 0 ? <Pchart data={data} /> : null}
          </div>
        */
      }
      


 


        <div className="m-auto p-5">
          {coursedataChart.length !== 0 ? <PChartSecond data={coursedataChart} /> : null}
        </div>
        
          <br /><br /><br />
      </div>
    </div>
  )
}

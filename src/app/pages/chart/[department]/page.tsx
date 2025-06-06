"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { bgStyle, convertCodeToName, getCourseName } from "@/utils/customFunction"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Pchart from "./components/pchart"
import EmptyPchart_2 from "./components/emptyChart_2"
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
import { getCL } from "@/utils/customFunction"
import { getSortedCoursesByYear } from "@/utils/customFunction"
import EmptyChart from "./components/emptyChart"




export default function LandingPage() {
  const params = useParams()
  const router = useRouter()
  const paramsValue = params.department as string
  const [code, user] = paramsValue.split("_") 
  const departmentName = convertCodeToName(code)

  const L = 0
  const H = 0
  

  
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [data, setData] = useState<courseInterface[]>([])
  const [sortedData, setSortedData] = useState<courseInterface[]>([])

 

  const [coursedataChart, setCoursedataChart] = useState<courseInterface[]>([])

  const [coursedataChartSavePoint, setCoursedataChartSavePoint] = useState<courseInterface[]>([])

  
  const handleSelectCourse = (selected : string) => {
    setSelectedCourse(selected)
    setCoursedataChart(coursedataChartSavePoint.filter((course : courseInterface) => course.courseCode == selected ))
  }


  const { data : courseData  } = useQuery({
    queryKey : ['course'],
    queryFn : () => axios.get(backendUrl("course/" + code))
  })

  

  useEffect(() => {
    if(courseData?.data)
    {
      setSortedData(getSortedCourses(courseData?.data))
      setCoursedataChartSavePoint(courseData?.data)
    }
  }, [courseData])

  // Ref for scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null)



  useEffect(() => {
    if (data.length > 0) {
      scrollContainerRef.current?.scrollTo({ top: 2100, behavior: "smooth" });
    }
  }, [data]);


  useEffect(() => {
    if(selectedCourse != "all") scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" }) 
  }, [ selectedCourse]);

  const scrollUp = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }


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

  const scrollDown = () => {
    scrollContainerRef.current?.scrollTo({ top: 2100, behavior: "smooth" })
  }
  


  return (
    <div className="min-h-screen" style={bgStyle}>
      <div ref={scrollContainerRef} className="h-dvh w-full overflow-auto relative">


        {(coursedataChartSavePoint && code == "IE") ? (
          <>
           <Button
              onClick={() => {
                setCoursedataChart(coursedataChartSavePoint.filter((course: courseInterface) => course.courseCode == "CHM01a"))
                setSelectedCourse("CHM01a")
                scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" })
              }}
              className="absolute flex flex-col items-center justify-center leading-[0] p-2 z-50 w-[57px]"
              style={{ top: `${380 + H}px`, left: `${260 + L}px` }}
            >
              <span className="mt-2">CHM0a1</span>
              <span className="text-xs whitespace-nowrap">{getCL(coursedataChartSavePoint.filter((course1: courseInterface) => course1.courseCode == 'CHM01a'))}</span>
            </Button>

            <Button
              onClick={() => {
                setCoursedataChart(coursedataChartSavePoint.filter((course: courseInterface) => course.courseCode == "CHM01aL"))
                setSelectedCourse("CHM01aL")
                scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" })
              }}
              className="absolute flex flex-col items-center justify-center leading-[0] p-1 z-50 w-[57px]"
              style={{ top: `${420 + H}px`, left: `${260 + L}px` }}
            >
              <span className="mt-2">CHM01aL</span>
              <span className="text-xs whitespace-nowrap">{getCL(coursedataChartSavePoint.filter((course1: courseInterface) => course1.courseCode == 'CHM01aL'))}</span>
            </Button>

            <Button
              onClick={() => {
                setCoursedataChart(coursedataChartSavePoint.filter((course: courseInterface) => course.courseCode == "MAT04"))
                setSelectedCourse("MAT04")
                scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" })
              }}
              className="absolute flex flex-col items-center justify-center leading-[0] p-1 z-50 w-[57px]"
              style={{ top: `${500 + H}px`, left: `${260 + L}px` }}
            >
              <span className="mt-2">MAT04</span>
              <span className="text-xs whitespace-nowrap">{getCL(coursedataChartSavePoint.filter((course1: courseInterface) => course1.courseCode == 'MAT04'))}</span>
            </Button>

            <Button
              onClick={() => {
                setCoursedataChart(coursedataChartSavePoint.filter((course: courseInterface) => course.courseCode == "PHY03"))
                setSelectedCourse("PHY03")
                scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" })
              }}
              className="absolute flex flex-col items-center justify-center leading-[0] p-1 z-50 w-[57px]"
              style={{ top: `${420 + H}px`, left: `${360 + L}px` }}
            >
              <span className="mt-2">PHY03</span>
              <span className="text-xs whitespace-nowrap">{getCL(coursedataChartSavePoint.filter((course1: courseInterface) => course1.courseCode == 'PHY03'))}</span>
            </Button>

            <Button
              onClick={() => {
                setCoursedataChart(coursedataChartSavePoint.filter((course: courseInterface) => course.courseCode == "PHY03L"))
                setSelectedCourse("PHY03L")
                scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" })
              }}
              className="absolute flex flex-col items-center justify-center leading-[0] p-1 z-50 w-[57px]"
              style={{ top: `${460 + H}px`, left: `${360 + L}px` }}
            >
              <span className="mt-2">PHY03L </span>
              <span className="text-xs whitespace-nowrap">{getCL(coursedataChartSavePoint.filter((course1: courseInterface) => course1.courseCode == 'PHY03L'))}</span>
            </Button>

            <Button
              onClick={() => {
                setCoursedataChart(coursedataChartSavePoint.filter((course: courseInterface) => course.courseCode == "MAT05"))
                setSelectedCourse("MAT05")
                scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" })
              }}
              className="absolute flex flex-col items-center justify-center leading-[0] p-1 z-50 w-[57px]"
              style={{ top: `${500 + H}px`, left: `${360 + L}px` }}
            >
              <span className="mt-2">MAT05 </span>
              <span className="text-xs whitespace-nowrap">{getCL(coursedataChartSavePoint.filter((course1: courseInterface) => course1.courseCode == 'MAT05'))}</span>
            </Button>

            <Button
              onClick={() => {
                setCoursedataChart(coursedataChartSavePoint.filter((course: courseInterface) => course.courseCode == "IEN01"))
                setSelectedCourse("IEN01")
                scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" })
              }}
              className="absolute flex flex-col items-center justify-center leading-[0] p-1 z-50 w-[57px]"
              style={{ top: `${540 + H}px`, left: `${360 + L}px` }}
            >
              <span className="mt-2">IEN01 </span>
              <span className="text-xs whitespace-nowrap">{getCL(coursedataChartSavePoint.filter((course1: courseInterface) => course1.courseCode == 'IEN01'))}</span>
            </Button>



              { /*
                <Button
                onClick={() => {
                  setCoursedataChart(coursedataChartSavePoint.filter((course : courseInterface) => course.courseCode == "IEN03" ))
                  setSelectedCourse("IEN03")
                  scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" })
                  }}
                className="absolute flex flex-col items-center justify-center leading-[0] p-1 z-50 w-[57px]"
                style={{ top: '342px', left: '457px' }}
              >
                <span className="mt-2">IEN03 </span>
                <span className="text-xs whitespace-nowrap">{getCL(coursedataChartSavePoint.filter((course1 : courseInterface) => course1.courseCode ==  'IEN03'))}</span>
              </Button>
              */}
            

            


          </>
        ) : null}

         
    


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
              <Button onClick={() => (user == "dean") ?  router.push("/pages/departments_dean")  : router.push("/pages/departments")}>Back</Button>
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



       
     
                            

        <div className="m-auto p-5">
          {selectedCourse !== "all" 
          ? <PChartSecond initialData={coursedataChartSavePoint} selectCourse={selectedCourse} handleSelectCourse={handleSelectCourse} scrollUp={scrollUp} data={coursedataChart} setData={setCoursedataChart} setDataSavePoint={setCoursedataChartSavePoint} /> 
          : < EmptyChart initialData={coursedataChartSavePoint} selectCourse={selectedCourse} handleSelectCourse={handleSelectCourse}  scrollUp={scrollUp} data={coursedataChart} setData={setCoursedataChart} setDataSavePoint={setCoursedataChartSavePoint} />}
        </div>

    

          <div className="m-auto p-5">
            {data.length !== 0 ? <Pchart  scrollDown={scrollDown} data={data} setSelectedYear={setSelectedYear} selectedYear={selectedYear} /> : <EmptyPchart_2 setSelectedYear={setSelectedYear} selectedYear={selectedYear} data={data} />}
          </div>
       
  
      


 

        
          <br /><br /><br />
      </div>
    </div>
  )
}

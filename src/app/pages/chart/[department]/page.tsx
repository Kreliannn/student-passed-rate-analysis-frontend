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
import SubjectMapping from "./components/subjectMapping"



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
    if(selectedCourse != "all") scrollContainerRef.current?.scrollTo({ top: 400, behavior: "smooth" }) 
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
  
  const scroll = () => {
    //1150
    scrollContainerRef.current?.scrollTo({ top: 1150, behavior: "smooth" })
  }


  return (
    <div className="min-h-screen" style={bgStyle}>
      <div ref={scrollContainerRef} className="h-dvh w-full overflow-auto relative">


      {coursedataChartSavePoint && code === "IE" && (
        <>
          <SubjectMapping subject="CHM01a" top={380} left={260} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="CHM01aL" top={420} left={260} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="MAT04" top={500} left={260} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          
          <SubjectMapping subject="PHY03" top={420} left={360} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="PHY03L" top={460} left={360} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="MAT05" top={500} left={360} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN01" top={540} left={360} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          
          <SubjectMapping subject="IEN03" top={342} left={457} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN03L" top={382} left={457} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="MEC00" top={422} left={457} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="MAT07" top={500} left={457} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN02" top={538} left={457} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN04" top={615} left={457} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="COM01" top={695} left={457} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
        
          <SubjectMapping subject="BES01" top={342} left={551} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="BES05" top={382} left={551} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="MCE01a" top={422} left={551} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN05" top={500} left={551} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="AEC02" top={576} left={551} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN06" top={616} left={551} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN06L" top={654} left={551} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="CAD01" top={693} left={551} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />


          <SubjectMapping subject="AEC04" top={342} left={649} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEE01" top={382} left={649} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="EEN01a" top={422} left={649} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN07" top={500} left={649} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN08" top={539} left={649} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN09" top={616} left={649} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN09L" top={654} left={649} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />

          <SubjectMapping subject="AEC05" top={342} left={743} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="BES04" top={382} left={743} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN10" top={462} left={743} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN11" top={500} left={743} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN12" top={577} left={743} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN12L" top={616} left={743} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEE02" top={654} left={743} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN13" top={694} left={743} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          <SubjectMapping subject="IEN13L" top={734} left={743} coursedataChartSavePoint={coursedataChartSavePoint} scrollDown={scroll} setSelectedCourse={setSelectedCourse} setCoursedataChart={setCoursedataChart} />
          
        </>
      )}
    


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

"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import { bgStyle, convertCodeToName } from "@/utils/customFunction"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Pchart from "./components/pchart"
import { useParams } from "next/navigation"
import { useState, useRef } from "react"
import { courseInterface } from "@/types/interface"
import { data as CEdata } from "./components/data/CE"
import { data as CPEdata } from "./components/data/CPE"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"


export default function LandingPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.department as string
  const departmentName = convertCodeToName(code)

  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [data, setData] = useState<courseInterface[]>([])

  // Ref for scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(selectedYear != "all")
    {
      if(selectedYear == "2020-2024") setData(CEdata)
      else if(selectedYear == "2021-2025") setData(CPEdata)
    }
    else
    {
      setData([])
    }
  }, [selectedYear])

  useEffect(() => {
    if (data.length > 0) {
      scrollContainerRef.current?.scrollTo({ top: 500, behavior: "smooth" });
    }
  }, [data]);
  
 

  return (
    <div className="min-h-screen" style={bgStyle}>
      <div ref={scrollContainerRef} className="h-dvh w-full overflow-auto">
        <Button className="m-5" size="lg" onClick={() => router.push("/pages/departments")}>
          Back To Departments
        </Button>

        <h1 className="text-3xl text-white text-center font-bold mb-5">
          {departmentName} ({code})
        </h1>


      <div className="grid w-full max-w-sm items-center gap-1.5 m-5">
              <Label className="text-white" htmlFor="year-select">Filter by Batch</Label>
              <Select  value={selectedYear} onValueChange={setSelectedYear} >
                <SelectTrigger id="year-select" className="w-[200px] bg-white">
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                  <SelectContent >
                        <SelectItem value="all"> Select Batch </SelectItem>
                        <SelectItem value="2020-2024">2020-2024</SelectItem>
                        <SelectItem value="2021-2025">2021-2025</SelectItem>
                        <SelectItem value="2022-2023">2023-2026</SelectItem>
                        <SelectItem value="2023-2024">2024-2027</SelectItem>
                  </SelectContent>
              </Select>
        </div>

        
        

      

        <div className="m-auto p-5">
          {data.length !== 0 ? <Pchart data={data} /> : null}
        </div>
      </div>
    </div>
  )
}

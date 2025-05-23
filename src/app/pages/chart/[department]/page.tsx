"use client"
import Image from "next/image"
import Link from "next/link"
import { bgStyle, convertCodeToName } from "@/utils/customFunction"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import  Pchart from "./components/pchart"
import { useParams } from "next/navigation"
import { useState } from "react"
import { courseInterface } from "@/types/interface"
import {data as CEdata} from "./components/data/CE"
import {data as CPEdata} from "./components/data/CPE"

export default function LandingPage() {

    const params = useParams()
    const router = useRouter()
    const code = params.department as string
    const departmentName = convertCodeToName(code)

    const [data, setData] = useState<courseInterface[]>([])

    // smooth scroll to 500px
  return (
    <div className="min-h-screen " style={bgStyle}>
        <div className="h-dvh w-full  overflow-auto">
          
            <Button className="m-5 " size="lg" onClick={() => router.push("/pages/departments")}> Back To Departments </Button>
            <h1 className="text-3xl text-white text-center font-bold mb-5"> {departmentName} ({code}) </h1>

            <Button className="m-5 " size="lg" onClick={() => setData(CEdata)}> CE </Button>
            <Button className="m-5 " size="lg" onClick={() => setData(CPEdata)}> CPE </Button>
            <Button className="m-5 " size="lg" onClick={() => setData([])}> Blank </Button>
            <Button className="m-5 " size="lg" onClick={() =>  window.scrollTo({ top: 100, behavior: 'smooth' })}> Blank </Button>


            <div className=" m-auto p-5">
              {data.length != 0 ? <Pchart data={data} /> : null}
            </div>

           
        </div>
    </div>
  )
}
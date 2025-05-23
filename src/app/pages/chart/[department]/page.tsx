"use client"
import Image from "next/image"
import Link from "next/link"
import { bgStyle } from "@/utils/customFunction"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import  Pchart from "./components/pchart"
import { useParams } from "next/navigation"

const convertCodeToName = (code : string) => {
  switch(code)
  {
    case "CE":
      return "Civil Engeneering"
      break 

    case "CPE":
      return "Computer Engeneering"
      break

    case "EE":
      return "Electrical Engeneering"
      break

    case "ECE":
      return "Electronic Engeneering"
      break

    case "IE":
      return "industrial Engeneering"
      break

    case "ME":
      return "Mechanical Engeneering"
      break
  }
}

export default function LandingPage() {

    const params = useParams()
    const router = useRouter()
    const code = params.department as string
    const departmentName = convertCodeToName(code)


  return (
    <div className="min-h-screen " style={bgStyle}>
        <div className="h-dvh w-full  overflow-auto">
          
            <Button className="m-5 " size="lg" onClick={() => router.push("/pages/departments")}> Back To Departments </Button>
            <h1 className="text-3xl text-white text-center font-bold mb-5"> {departmentName} ({code}) </h1>

            <div className=" m-auto p-5">
              <Pchart />
            </div>

           
        </div>
    </div>
  )
}
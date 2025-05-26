"use client"
import Image from "next/image"
import Link from "next/link"
import { bgStyle } from "@/utils/customFunction"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


export default function LandingPage() {

    const router = useRouter()


  return (
    <div className="min-h-screen flex flex-col items-center" style={bgStyle}>
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
          <div className="" onClick={() => router.push("/pages/mainPage")}>
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
        <div className="w-2/6 bg-white m-auto p-10 rounded-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-700 text-center">Departments</h2>
            <br />
            <Button size="lg" className="w-full shadow-lg m-2  " onClick={() => router.push("/pages/manageData/CE")}> Civil Engineering </Button>
            <Button size="lg" className="w-full shadow-lg m-2  " onClick={() => router.push("/pages/manageData/CPE")}> Computer Engineering </Button>
            <Button size="lg" className="w-full shadow-lg m-2  " onClick={() => router.push("/pages/manageData/EE")}>  Electrical Engineering </Button>
            <Button size="lg" className="w-full shadow-lg m-2  " onClick={() => router.push("/pages/manageData/ECE")}> Electronics Engineering </Button>
            <Button size="lg" className="w-full shadow-lg m-2  " onClick={() => router.push("/pages/manageData/IE")}> Industrial Engineering </Button>
            <Button size="lg" className="w-full shadow-lg m-2  " onClick={() => router.push("/pages/manageData/ME")}> Mechanical Engineering </Button>
        </div>
    </div>
  )
}
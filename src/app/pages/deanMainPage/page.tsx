
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
      {/* Top section with university name and logos */}
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
              <h2 className="text-xl md:text-4xl font-medium text-white">
                        Dean Panel
              </h2>
              <h3 className="font-bold text-muted text-sm">
              Southern Luzon State University College of Engineering
              </h3>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Button close to Right Logo */}
          <div className="" onClick={() => router.push("/")}>
            <Button>Logout</Button>
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

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Student Retention Rate Monitoring System
        </h1>

        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl">
          Track, analyze, and improve student retention rates with our comprehensive monitoring system
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" variant={"default"} className="bg-red-900 hover:bg-red-800"> 
            <Link
              href="/pages/departments_dean"
              className="  "
            >  Proceed to Chart </Link>
          </Button>

          <Button size="lg" variant={"outline"} > 
            <Link
              href="/pages/deanDashboard"
              className="t  "
            >  Dean Dashboard </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}



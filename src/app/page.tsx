
import Image from "next/image"
import Link from "next/link"
import { bgStyle } from "@/utils/customFunction"
import { Button } from "@/components/ui/button"


export default function LandingPage() {

  

  return (
    <div className="min-h-screen flex flex-col items-center" style={bgStyle}>
      {/* Top section with university name and logos */}
      <div className="w-full flex items-center justify-between p-6">
        <Image src="/logo1.png" alt="Logo 1" width={80} height={80} className="object-contain rounded-full" />
        <div className="">
              <h2 className="text-xl md:text-3xl font-medium text-white">
                Southern Luzon State University
              </h2>
              <h3 className="font-bold text-muted text-center">
                College of Engineering
              </h3>
        </div>
        <Image src="/logo2.png" alt="Logo 2" width={80} height={80} className="object-contain rounded-full" />
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
              href="/pages/departments"
              className="  "
            >  Proceed to Chart </Link>
          </Button>

          <Button size="lg" variant={"outline"} > 
            <Link
              href="/pages/departments_2"
              className="t  "
            >  Manage Data </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

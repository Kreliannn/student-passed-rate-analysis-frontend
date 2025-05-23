"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { bgStyle } from "@/utils/customFunction"
import Image from "next/image"



export default function LandingPage() {
   
    
      const [data, setData] = useState([])
      const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
     
    
     
     


  return (
    <div className="min-h-screen " style={bgStyle}>
        <div className="h-dvh w-full  overflow-auto">
          
        <div className="w-full flex items-center justify-between p-6">
            <Image src="/logo1.png" alt="Logo 1" width={80} height={80} className="object-contain rounded-full" />
            <h2 className="text-xl md:text-2xl font-medium text-white">Southern Luzon State University</h2>
            <Image src="/logo2.png" alt="Logo 2" width={80} height={80} className="object-contain rounded-full" />
      </div>

        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5 ">
                        <Label className="text-white" htmlFor="year-select">Filter by Department</Label>
                        <Select  value={selectedDepartment} onValueChange={setSelectedDepartment} >
                        <SelectTrigger id="year-select" className="w-[200px] bg-white">
                            <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="all"> select Department</SelectItem>
                            <SelectItem value="ssss">Civil Engeneering</SelectItem>
                            <SelectItem value="ssss">Computer Engeneering</SelectItem>
                            <SelectItem value="ssss">Electrical Engeneering</SelectItem>
                            <SelectItem value="ssss">Electronics Engeneering</SelectItem>
                            <SelectItem value="ssss">Industrial Engeneering</SelectItem>
                            <SelectItem value="ssss">Mechanic Engeneering</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-600">
                    <Trash2 className="h-4 w-4" />
                    Delete Data
                </Button>

                <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600">
                    <Plus className="h-4 w-4" />
                    Add Data
                </Button>
            </div>

            <div className="border rounded-md bg-white">
                
            </div>
        </div>
           
        </div>
    </div>
  )
}










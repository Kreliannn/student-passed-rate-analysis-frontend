"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react";
import { errorAlert, successAlert } from "@/utils/alerts"
import { bgStyle } from "@/utils/customFunction"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const submit = () => {
    if(username == "admin" && password == "123") {
      successAlert("Welcome!!")
      router.push("pages/mainPage")
    } else {
      errorAlert("Invalid Credentials")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" style={bgStyle}>
      {/* Top Navbar */}
      <div className="w-full flex items-center justify-between p-6">
        <Image 
          src="/logo1.png" 
          alt="Logo 1" 
          width={80} 
          height={80} 
          className="object-contain rounded-full" 
        />
        
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-medium text-white">
            Southern Luzon State University
          </h2>
          <h3 className="font-bold text-muted">
            College of Engineering
          </h3>
        </div>
        
        <Image 
          src="/logo2.png" 
          alt="Logo 2" 
          width={80} 
          height={80} 
          className="object-contain rounded-full" 
        />
      </div>

      {/* Centered Login Form */}
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Login as Admin</h2>
            <p className="mt-2 text-sm text-gray-600">Enter credentials below</p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full"
              />
            </div>

            <Button onClick={submit} className="w-full">
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
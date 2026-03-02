import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/userSlice'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    // console.log(formData);
    try {
      setLoading(true)
      const res = await axios.post(`https://ekart-backend-pink.vercel.app/api/v1/user/login`, formData, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.data.success) {
        navigate('/')
        dispatch(setUser(res.data.user))
        localStorage.setItem('accessToken', res.data.accessToken)

        toast.success(res.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
    finally {
      setLoading(false)
    }
  }
  return (

    <div div className="flex justify-center items-center min-h-screen bg-pink-100 px-4" >
      <Card className="w-full max-w-md sm:max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Login your account
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter given details below to login your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a password"
                  required
                  className="pr-10"
                />

                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword(false)}
                    className="w-5 h-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="w-5 h-5 text-gray-700 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  />
                )}
              </div>
            </div>

          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button
            onClick={submitHandler}
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Please wait
              </>
            ) : (
              "Login"
            )}
          </Button>

          <p className="text-gray-700 text-sm text-center">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="hover:underline text-pink-800"
            >
              Signup
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div >
  )
}

export default Login

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from '../../assets/user-logo.jpg'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { setUser } from "@/redux/userSlice"
import { toast } from "sonner"

const UserInfo = () => {

  const navigate = useNavigate()

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    role: ""
  })
  const [file, setFile] = useState(null)
  const { user } = useSelector(store => store.user)
  const params = useParams()
  const userId = params.id
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) }) //preview only
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(updateUser);
    const accessToken = localStorage.getItem('accessToken')
    try {
      //use FormData for text and file
      const formData = new FormData()
      formData.append('firstName', updateUser.firstName)
      formData.append('lastName', updateUser.lastName)
      formData.append('email', updateUser.email)
      formData.append('phoneNo', updateUser.phoneNo)
      formData.append('address', updateUser.address)
      formData.append('city', updateUser.city)
      formData.append('zipCode', updateUser.zipCode)
      formData.append('role', updateUser.role)

      if (file) {
        formData.append('file', file) //image file for backend multer
      }
      const res = await axios.put(`https://ekart-backend-pink.vercel.app/api/v1/user/update/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        // dispatch(setUser(res.data.user))
        // Only update Redux if logged in user updated themselves
        if (user?._id === userId) {
          dispatch(setUser(res.data.user))
        }
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed To Update Profile")
    }
  }

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`https://ekart-backend-pink.vercel.app/api/v1/user/get-user/${userId}`)
      if (res.data.success) {
        setUpdateUser(res.data.user)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [userId])

  return (
    <div className='pt-14 min-h-screen bg-gray-100'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
          <div className='flex justify-between gap-10'>
            <Button onClick={() => navigate(-1)}><ArrowLeft /></Button>
            <h1 className='font-bold mb-7 text-2xl text-gray-800'>Update Profile</h1>
          </div>
          <div className='w-full flex gap-10 justify-between items-start px-7 max-w-2xl'>
            {/* Profile Picture */}
            <div className='flex flex-col items-center'>
              <img src={updateUser?.profilePic || userLogo} alt="profile" className='w-32 h-32 rounded-full object-cover border-4 border-pink-800' />
              <label className='bg-pink-700'>Change Picture
                <input onChange={handleFileChange} type="file" accept='image/*' className='hidden' />
              </label>
            </div>
            {/* Profile form */}
            <form onSubmit={handleSubmit} className='space-y-4 shadow-lg p-5 rounded-lg bg-white'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold'>First Name</label>
                  <input type="text" name='firstName'
                    placeholder='John'
                    value={updateUser.firstName || ""}
                    onChange={handleChange}
                    className='w-full border rounded-lg px-3 py-2 mt-1' />
                </div>

                <div>
                  <label className='block text-sm font-semibold'>Last Name</label>
                  <input type="text" name='lastName'
                    placeholder='Doe'
                    value={updateUser.lastName || ""}
                    onChange={handleChange}
                    className='w-full border rounded-lg px-3 py-2 mt-1' />
                </div>
              </div>
              <div>
                <label className='block text-sm font-semibold'>Email</label>
                <input type="email"
                  name='email'
                  value={updateUser.email || ""}
                  onChange={handleChange}
                  disabled
                  className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed' />
              </div>
              <div>
                <label className='block text-sm font-semibold'>Phone Number</label>
                <input type="text"
                  name='phoneNo'
                  placeholder='Enter your Contact No'
                  value={updateUser.phoneNo || ""}
                  onChange={handleChange}
                  className='w-full border rounded-lg px-3 py-2 mt-1' />
              </div>

              <div>
                <label className='block text-sm font-semibold'>Address</label>
                <input type="text"
                  name='address'
                  value={updateUser.address || ""}
                  onChange={handleChange}
                  placeholder='Enter your Address'
                  className='w-full border rounded-lg px-3 py-2 mt-1' />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold'>City</label>
                  <input type="text"
                    name='city'
                    value={updateUser.city || ""}
                    onChange={handleChange}
                    placeholder='Enter your City'
                    className='w-full border rounded-lg px-3 py-2 mt-1' />
                </div>

                <div>
                  <label className='block text-sm font-semibold'>Zip Code</label>
                  <input type="text"
                    name='zipCode'
                    value={updateUser.zipCode || ""}
                    onChange={handleChange}
                    placeholder='Enter your ZipCode'
                    className='w-full border rounded-lg px-3 py-2 mt-1' />
                </div>
              </div>
              <div className='flex gap-3 items-center'>
                <Label className='block text-sm font-medium'>Role :</Label>

                <RadioGroup
                  value={updateUser?.role}
                  onValueChange={(value) => setUpdateUser({ ...updateUser, role: value })}
                  className='flex items-center'
                >

                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='user' id='user' />
                    <Label htmlFor='user'>User</Label>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='admin' id='admin' />
                    <Label htmlFor='admin'>Admin</Label>
                  </div>

                </RadioGroup>
              </div>


              <Button type='submit' className='w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg'>
                Update Profile
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
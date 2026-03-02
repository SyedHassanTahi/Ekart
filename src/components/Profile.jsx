import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from '../assets/user-logo.jpg'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlice'
import MyOrder from '@/pages/MyOrder'

const Profile = () => {
  const { user } = useSelector(store => store.user)
  const params = useParams()
  const userId = params.userId
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo: user?.phoneNo,
    address: user?.address,
    city: user?.city,
    zipCode: user?.zipCode,
    profilePic: user?.profilePic,
    role: user?.role
  })

  const [file, setFile] = useState(null)
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
        dispatch(setUser(res.data.user))
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed To Update Profile")
    }
  }
  return (
    <div className="pt-20 min-h-screen bg-gray-100 px-4">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Profile form */}
        <TabsContent value="profile">
          <div className="flex flex-col justify-center items-center bg-gray-100 px-4">
            <h1 className='font-bold mb-7 text-2xl text-center'>Update Profile</h1>

            <div className='w-full flex flex-col lg:flex-row gap-10 justify-center items-start px-2 lg:px-7 max-w-2xl'>
              {/* Profile Picture */}
              <div className='flex flex-col items-center'>
                <img
                  src={updateUser?.profilePic || userLogo}
                  alt="Profile Picture"
                  className='w-32 h-32 rounded-full object-cover border-4 border-pink-800'
                />
                <label className='mt-3 bg-pink-700 text-white px-4 py-2 rounded cursor-pointer'>
                  Change Picture
                  <input
                    onChange={handleFileChange}
                    type="file"
                    accept='image/*'
                    className='hidden'
                  />
                </label>
              </div>

              {/* Profile form */}
              <form
                onSubmit={handleSubmit}
                className='w-full shadow-lg p-5 rounded-lg bg-white'
              >
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-semibold'>First Name</label>
                    <input
                      type="text"
                      name='firstName'
                      placeholder='John'
                      value={updateUser.firstName}
                      onChange={handleChange}
                      className='w-full border rounded-lg px-3 py-2 mt-1'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold'>Last Name</label>
                    <input
                      type="text"
                      name='lastName'
                      placeholder='Doe'
                      value={updateUser.lastName}
                      onChange={handleChange}
                      className='w-full border rounded-lg px-3 py-2 mt-1'
                    />
                  </div>
                </div>

                <div className='mt-4'>
                  <label className='block text-sm font-semibold'>Email</label>
                  <input
                    type="email"
                    name='email'
                    value={updateUser.email}
                    onChange={handleChange}
                    disabled
                    className='w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed'
                  />
                </div>

                <div className='mt-4'>
                  <label className='block text-sm font-semibold'>Phone Number</label>
                  <input
                    type="text"
                    name='phoneNo'
                    placeholder='Enter your Contact No'
                    value={updateUser.phoneNo}
                    onChange={handleChange}
                    className='w-full border rounded-lg px-3 py-2 mt-1'
                  />
                </div>

                <div className='mt-4'>
                  <label className='block text-sm font-semibold'>Address</label>
                  <input
                    type="text"
                    name='address'
                    value={updateUser.address}
                    onChange={handleChange}
                    placeholder='Enter your Address'
                    className='w-full border rounded-lg px-3 py-2 mt-1'
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                  <div>
                    <label className='block text-sm font-semibold'>City</label>
                    <input
                      type="text"
                      name='city'
                      value={updateUser.city}
                      onChange={handleChange}
                      placeholder='Enter your City'
                      className='w-full border rounded-lg px-3 py-2 mt-1'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-semibold'>Zip Code</label>
                    <input
                      type="text"
                      name='zipCode'
                      value={updateUser.zipCode}
                      onChange={handleChange}
                      placeholder='Enter your ZipCode'
                      className='w-full border rounded-lg px-3 py-2 mt-1'
                    />
                  </div>
                </div>

                <Button
                  type='submit'
                  className='w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg'
                >
                  Update Profile
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>

        {/* Orders form */}
        <TabsContent value="orders">
          <MyOrder />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile

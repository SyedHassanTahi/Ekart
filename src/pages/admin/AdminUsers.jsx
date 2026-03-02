import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Edit, Eye, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import UserLogo from '../../assets/user-logo.jpg'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    const getAllUsers = async () => {
        const accessToken = localStorage.getItem("accessToken")
        try {
            const res = await axios.get(`https://ekart-backend-pink.vercel.app/api/v1/user/all-user`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                setUsers(res.data.users)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        getAllUsers()
    }, [])

    return (
        <div className='py-10 px-4 sm:px-6 lg:px-12 lg:pl-65 lg:pt-30 max-w-7xl mx-auto'>
            
            {/* Header */}
            <h1 className='font-bold text-2xl sm:text-3xl'>User Management</h1>
            <p className='text-gray-600 mt-1'>View and manage registered users</p>

            {/* Search */}
            <div className='relative w-full sm:w-80 mt-6'>
                <Search className='absolute left-3 top-3 text-gray-600 w-5 h-5' />
                <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-10'
                    placeholder="Search Users..."
                />
            </div>

            {/* Users Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8'>
                {
                    filteredUsers.map((user) => {
                        return (
                            <div key={user._id} className='bg-pink-100 p-5 rounded-lg shadow-sm'>
                                
                                {/* User Info */}
                                <div className='flex items-center gap-3'>
                                    <img
                                        src={user?.profilePic || UserLogo}
                                        alt="user"
                                        className='rounded-full w-16 h-16 object-cover border border-pink-600'
                                    />
                                    <div className='wrap-break-word'>
                                        <h1 className='font-semibold text-lg'>
                                            {user?.firstName} {user?.lastName}
                                        </h1>
                                        <h3 className='text-sm text-gray-700 break-all'>
                                            {user?.email}
                                        </h3>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className='flex flex-col sm:flex-row gap-3 mt-4'>
                                    <Button
                                        variant='outline'
                                        className='w-full sm:w-auto'
                                        onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                                    >
                                        <Edit className='w-4 h-4 mr-1' />
                                        Edit
                                    </Button>

                                    <Button
                                        className='w-full sm:w-auto'
                                        onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)}
                                    >
                                        <Eye className='w-4 h-4 mr-1' />
                                        Show Order
                                    </Button>
                                </div>

                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}

export default AdminUsers
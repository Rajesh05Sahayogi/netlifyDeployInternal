import React, { useEffect } from 'react'
import Header from '../components/Header'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import UserList from './UserList'
import OrgForm from './OrgForm'

export default function SuperAdmin() {

  return (
    <>
      <div className='text-5xl p-3 text-black mt-20 flex items-center justify-between px-10'>
        <div className='flex justify-center items-center'>
        </div>
        <div className='flex gap-1'>
        <div className='bg-green-600 font-semibold text-xs text-white p-2 rounded'>
          <Link to="/ApprovedUsersList">Approved User</Link>
        </div>
        <div className='bg-green-600 font-semibold text-xs text-white p-2 rounded'>
          <Link to="/superAdmin/OrgDashboard">Org Dashboard</Link>
        </div>
        </div>
      </div>
        <UserList/>
    </>
  )
}

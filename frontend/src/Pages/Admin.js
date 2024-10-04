import React, { useEffect } from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SalesAdmin from './SalesAdmin'

export default function Admin() {

  const user = useSelector(state => state?.user?.user)
  const navigate = useNavigate()


  useEffect(()=>{
      if(user?.role !== "Admin"){
          navigate("/")
      }
  },[user])


  return (
    <>
      <div className='text-5xl text-black mt-20 flex items-center justify-center'>
        <div className='text-2xl text-black h-20 w-96 text-center'>Welocome to Admin Dashboard</div>
      </div>
      <SalesAdmin/>
    </>

  )
}

import React, { useEffect } from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SalesPersonDashboard from './SalesPersonDashboard'
import OnboardingTeam from './OnboardingTeam'

export default function User() {

  const user = useSelector(state => state?.user?.user)
  const navigate = useNavigate()


  useEffect(()=>{
      if(user?.role !== "User"){
          navigate("/")
      }
      // IF(user?.)
      // if(user?.department == "")
  },[user])

  
  return (   
    <>
      <div className='text-5xl text-black mt-20 flex items-center justify-center'>
        <div className='text-2xl text-black  w-96 text-center'>Welocome to User Dashboard</div>
      </div>

       <SalesPersonDashboard/>
  
    </>
  )
}

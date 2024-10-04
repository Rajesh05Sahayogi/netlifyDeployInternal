import React from 'react'
import HeroSection from '../components/HeroSection'
import FunctionalSec from '../components/FunctionalSec'
import ProductsSection from '../components/ProductsSection'
import ReviewSection from '../components/ReviewSection'
import FAQSection from '../components/FAQSection'
import Footer from '../components/Footer'
import ResponsiveFooter from '../components/ResponsiveFooter'
const LandingPage = () => {
    const user=localStorage.getItem("user")
    if(user)
    {
        window.history.go(-1);
    }
  return (
    <div className="mt-20 ">
      <HeroSection />
      <FunctionalSec />
      <ProductsSection/>
      <ReviewSection/>
      <FAQSection/>
      <ResponsiveFooter/>
    </div>
  )
}

export default LandingPage
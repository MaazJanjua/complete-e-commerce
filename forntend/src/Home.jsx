import React from 'react'
import Hero from './Pages/Hero/Hero.jsx'

import HomeCategoriesGrid from './Pages/HomeCategoriesGrid/homeCategoriesGrid.jsx'
import TrendingProducts from './Pages/Home/TrendingProducts'
import TrustBadges from './Components/common/Trustbadges.jsx'
import PromoBannersAndInstagram from './Components/common/PromoBannersAndInstagram'; // <-- 1. Import

const Home = () => {
  return (
    <>
      <Hero />
      <TrustBadges />
      <HomeCategoriesGrid />
      <TrendingProducts />
      {/* 2. Banner and Instagram Feed */}
      <PromoBannersAndInstagram />
    </>
  )
}

export default Home
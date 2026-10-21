import React from 'react'
import Hero from './Pages/Hero/Hero.jsx'

import HomeCategoriesGrid from './Pages/HomeCategoriesGrid/homeCategoriesGrid.jsx'
import TrendingProducts from './Pages/Home/TrendingProducts'
import TrustBadges from './Components/common/Trustbadges.jsx'

const Home = () => {
  return (
    <>
      <Hero />
      <TrustBadges />
      <HomeCategoriesGrid />
      <TrendingProducts />
    </>
  )
}

export default Home
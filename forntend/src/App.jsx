import React from 'react'
import './index.css'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import { Outlet } from "react-router-dom"

const App = () => {
  return (
    <>
      {/* <Header />
      <Outlet />
      <Footer /> */}
      <div className=" flex flex-col">
        <Header />
        <main className="flex-1"> 
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App

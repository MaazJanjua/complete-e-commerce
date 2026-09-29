// import React from 'react'

// const Hero = () => {
//     return (
//         <div>
//             {/* <img
//                 className="w-full lg:h-[65vh]"
//                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnkoUry8SKtN6p8rEEjVmHBXum3kBSezx1TKZTNhYmqQ&s=10"
//                 alt="Hero"
//             /> */}
//             <div className=' w-full h-[65vh] bg-(--dark-black) relative '>
//                 <div className=' text-amber-50 absolute bottom-45 left-38 max-w-[89vw] '>
//                     <h2 className='uppercase font-bold text-xl text-(-gray)' >New Arrivals</h2>
//                     <h1 className='text-8xl font-bold uppercase'>HM.  <span>shop</span></h1>
//                     <p className='w-[24vw] mt-4 text-xl'>premium thrifted pieces,Handpicked for Quality. Price for you</p>
//                     <button className='bg-(--background) text-(--gray) px-4 py-2 mt-6 rounded'>SHop Now</button>
//                 </div>

//             </div>

//         </div>
//     )
// }

// export default Hero

import React from 'react'

const Hero = () => {
    return (
        <section
            className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh] bg-[#1a1a1a] overflow-hidden"
            aria-label="Hero banner"
        >
            {/* Background Image with SEO-friendly alt text */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-40"
                style={{
                    backgroundImage: `url('https://www.pinterest.com/pin/568579521734025206/')`
                }}
                role="img"
                aria-label="Hero background image showcasing thrifted fashion pieces"
            />

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content Container */}
            <div className="relative z-10 flex items-center justify-start w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
                <div className="max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] 2xl:max-w-[40vw] text-white">
                    {/* Badge */}
                    <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3 sm:mb-4">
                        <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-300 font-medium">
                            New Arrivals
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase leading-tight">
                        HM. <span className="text-gray-300">shop</span>
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 text-gray-200 max-w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
                        Premium thrifted pieces, handpicked for quality. Priced for you.
                    </p>

                    {/* CTA Button */}
                    <button
                        className="bg-white text-[#1a1a1a] px-6 sm:px-8 py-2.5 sm:py-3 mt-4 sm:mt-6 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        aria-label="Shop now for premium thrifted pieces"
                    >
                        Shop Now
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Hero

// import React from 'react'

// const Hero = () => {
//     return (
//         <section
//             className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh] bg-[#1a1a1a] overflow-hidden"
//             aria-label="Hero banner"
//         >
//             {/* Background Image - public folder path */}
//             <div
//                 className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-40"
//                 style={{
//                     backgroundImage: `url('/home-baclground-image(1).jpeg')` // Agar public/images/ mein hai to '/images/hero-bg.jpg'
//                 }}
//                 role="img"
//                 aria-label="Hero background image showcasing thrifted fashion pieces"
//             />

//             {/* Overlay for better text readability */}
//             <div className="absolute inset-0 bg-black/30" />

//             {/* Content Container */}
//             <div className="relative z-10 flex  items-center justify-start w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
//                 <div className="max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] 2xl:max-w-[40vw] text-white">
//                     {/* Badge */}
//                     <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3 sm:mb-4">
//                         <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-300 font-medium">
//                             New Arrivals
//                         </span>
//                     </div>

//                     {/* Main Heading */}
//                     <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase leading-tight">
//                         HM. <span className="text-gray-300">shop</span>
//                     </h1>

//                     {/* Description */}
//                     <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 text-gray-200 max-w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
//                         Premium thrifted pieces, handpicked for quality. Priced for you.
//                     </p>

//                     {/* CTA Button */}
//                     <button
//                         className="bg-white text-[#1a1a1a] px-6 sm:px-8 py-2.5 sm:py-3 mt-4 sm:mt-6 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
//                         aria-label="Shop now for premium thrifted pieces"
//                     >
//                         Shop Now
//                     </button>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default Hero

// import React from 'react'

// const Hero = () => {
//     return (
//         <section
//             className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh] bg-[#1a1a1a] overflow-hidden"
//             aria-label="Hero banner"
//         >
//             {/* Background Image - public/images path */}
//             <div
//                 className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-40"
//                 style={{
//                     backgroundImage: `url('/images/home-baclground-image(1).jpeg')`
//                 }}
//                 role="img"
//                 aria-label="Hero background image showcasing thrifted fashion pieces"
//             />

//             {/* Dark Overlay */}
//             <div className="absolute inset-0 bg-black/40" />

//             {/* Content Container */}
//             <div className="relative z-10 flex items-center justify-start w-full h-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
//                 <div className="max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] 2xl:max-w-[40vw] text-white">
//                     {/* Badge */}
//                     <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3 sm:mb-4">
//                         <span className="text-xs sm:text-sm uppercase tracking-wider text-gray-300 font-medium">
//                             New Arrivals
//                         </span>
//                     </div>

//                     {/* Main Heading */}
//                     <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase leading-tight">
//                         HM. <span className="text-gray-300">shop</span>
//                     </h1>

//                     {/* Description */}
//                     <p className="text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 text-gray-200 max-w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%]">
//                         Premium thrifted pieces, handpicked for quality. Priced for you.
//                     </p>

//                     {/* CTA Button */}
//                     <button
//                         className="bg-white text-[#1a1a1a] px-6 sm:px-8 py-2.5 sm:py-3 mt-4 sm:mt-6 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
//                         aria-label="Shop now for premium thrifted pieces"
//                     >
//                         Shop Now
//                     </button>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default Hero
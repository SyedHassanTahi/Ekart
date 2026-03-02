import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate();
    return (
        <section className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">

                {/* Text Content */}
                <div className="lg:grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium">
                        Latest Electronics at Best Prices
                    </h1>
                    <p className="text-xl mb-8 leading-relaxed text-blue-100">
                        Discover cutting-edge technology with unbeatable deals on smartphones, laptops and more.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button onClick={() => navigate("/products")} className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto">
                            Shop Now
                        </Button>
                        <Button onClick={() => navigate("/products")} className="border-white border text-white hover:bg-white hover:text-blue-600 bg-transparent w-full sm:w-auto">
                            View Deals
                        </Button>
                    </div>
                </div>

                {/* Image */}
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                    <img
                        className="object-cover object-center rounded"
                        alt="hero"
                        src="/hero-img.png"
                    />
                </div>
            </div>
        </section>

    )
}

export default Hero
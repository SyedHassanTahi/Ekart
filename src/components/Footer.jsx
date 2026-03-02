import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200 py-10">
            <div className="max-w-7xl mx-auto px-4">

                {/* Top section */}
                <div className="grid gap-8 md:grid-cols-4">

                    {/* Info */}
                    <div>
                        <Link to="/">
                            <img src="/logo.png" alt="Zapro logo" className="w-32" />
                        </Link>
                        <p className="mt-2 text-sm">
                            Powering Your World with the Best in Electronics.
                        </p>
                        <p className="mt-2 text-sm">
                            123 Electronics St, Style City, NY 10001
                        </p>
                        <p className="text-sm">Email, support@zapro.com</p>
                        <p className="text-sm">Phone, (123) 456-7898</p>
                    </div>

                    {/* Customer service */}
                    <div>
                        <h3 className="text-xl font-semibold">Customer Services</h3>
                        <ul className="mt-2 text-sm space-y-2">
                            <li className="hover:text-white cursor-pointer">Contact Us</li>
                            <li className="hover:text-white cursor-pointer">Shipping & Returns</li>
                            <li className="hover:text-white cursor-pointer">FAQs</li>
                            <li className="hover:text-white cursor-pointer">Order Tracking</li>
                            <li className="hover:text-white cursor-pointer">Size Guide</li>
                        </ul>
                    </div>

                    {/* Social media */}
                    <div>
                        <h3 className="text-xl font-semibold">Follow Us</h3>
                        <div className="flex space-x-4 mt-3 text-2xl">
                            <FaFacebook className="hover:text-white cursor-pointer" />
                            <FaInstagram className="hover:text-white cursor-pointer" />
                            <FaTwitterSquare className="hover:text-white cursor-pointer" />
                            <FaPinterest className="hover:text-white cursor-pointer" />
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xl font-semibold">Stay in the loop</h3>
                        <p className="mt-2 text-sm">
                            Subscribe to get special offers, free giveaways, and more
                        </p>

                        <form className="mt-4 flex">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full p-2 rounded-l-md text-gray-400 bg-white focus:outline-none
                                focus:ring-2 focus:ring-gray-500"
                            />
                            <button
                                type="submit"
                                className="bg-pink-600 text-white px-4 rounded-r-md hover:bg-pink-700"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom section */}
                <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
                    <p>
                        © {new Date().getFullYear()} <span className="font-semibold">Ekart</span>. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>

    )
}

export default Footer
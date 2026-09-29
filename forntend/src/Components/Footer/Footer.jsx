import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from 'react-icons/fa';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-(--background)  mt-auto w-full">
      {/* Main Footer */}
      <div className="max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="space-y-4 font-(--font-primary)">
            <h2 className="text-4xl font-bold tracking-tight ">
              HM<span className="">Store</span>
            </h2>
            <p className="text-(--gray) capitalize lg:text-[.85vw] text-[3.2vw] md:text-[2.2vw]   break-all lg:w-[15vw] w-[79vw] md:w-[36vw] leading-relaxed font-semibold">
              Your trusted destination for quality products. We bring you the best
              deals and premium shopping experience right at your fingertips.
            </p>
            <div className="flex space-x-4 pt-2 text-(--gray)  ">
              <a
                href="#"
                className="transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebook className="hover:text-(--dark-black) w-7 h-7" />
              </a>
              <a
                href="#"
                className=" transition-colors duration-200"
                aria-label="Twitter"
              >
                <FaTwitter className="hover:text-(--dark-black) w-7 h-7" />
              </a>
              <a
                href="#"
                className=" transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="hover:text-(--dark-black) w-7 h-7" />
              </a>
              <a
                href="#"
                className=" hover:text-(--dark-black) transition-colors duration-200"
                aria-label="YouTube"
              >
                <FaYoutube className="w-7 h-7" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-extrabold uppercase mb-4 text-(--dark-black)">Quick Links</h3>
            <ul className="space-y-2.5 text-sm lg:text-[.85vw] font-bold text-(--gray)">
              <li>
                <Link to="/about" className=" hover:text-orange-400 transition-colors duration-200 ">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shop" className=" hover:text-orange-400 transition-colors duration-200 ">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className=" hover:text-orange-400 transition-colors duration-200 ">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className=" hover:text-orange-400 transition-colors duration-200 ">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-extrabold mb-4 text-(--dark-black) uppercase">Customer Service</h3>
            <ul className="space-y-2.5 text-(--gray) font-bold">
              <li>
                <Link to="/shipping" className=" hover:text-orange-400 transition-colors duration-200 text-sm">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className=" hover:text-orange-400 transition-colors duration-200 text-sm">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className=" hover:text-orange-400 transition-colors duration-200 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className=" hover:text-orange-400 transition-colors duration-200 text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Payment */}
          <div>
            <h3 className="text-lg font-extrabold mb-4 text-(--dark-black) uppercase">Get In Touch</h3>
            <ul className="space-y-3 text-(--gray) font-bold">
              <li className="flex items-start space-x-3  text-sm">
                <FaMapMarkerAlt className="w-5 h-5 mt-0.5 shrink-0 text-(--dark-black) text-[.8vw]" />
                <span>123 Commerce Street, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center space-x-3  text-sm">
                <FaPhone className="w-5 h-5 mt-0.5 shrink-0 text-(--dark-black)" />
                <a href="tel:+923001234567" className="hover:text-(--gray) lg:text-[.8vw] text-[4vw] md:text-[2.1vw] transition-colors duration-200">
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center space-x-3  text-sm">
                <FaEnvelope className="w-5 h-5 mt-0.5 shrink-0 text-(--dark-black)" />
                <a href="mailto:info@hmstore.com" className="hover:text-(--gray) lg:text-[.8vw] md:text-[2.1vw] text-[4vw] transition-colors duration-200">
                  info@hmstore.com
                </a>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="mt-4 pt-4 border-t border-gray-500">
              <h4 className=" font-medium text-gray-500 uppercase tracking-wider mb-3">
                We <span className='text-(--primary)'>Accept </span>
              </h4>
              <div className="flex space-x-3 text-[2.2vw] md:text-[2.5vw] text-(--gray)">
                <FaCcVisa className="hover:text-(--dark-black) transition-colors duration-200" />
                <FaCcMastercard className="hover:text-(--dark-black) transition-colors duration-200" />
                <FaCcPaypal className="hover:text-(--dark-black) transition-colors duration-200" />
                <FaCcAmex className="hover:text-(--dark-black) transition-colors duration-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-[89vw] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-(--dark-black) font-bold ">
              &copy; {currentYear} <span className="font-semibold text-(--dark-black) ">HM <span className='text-(--primary)'>Store</span></span>. All rights reserved.
            </p>
            <div className="flex items-center space-x-4  text-(--gray)">
              <Link to="/terms" className="hover:text-(--dark-black) transition-colors duration-200">
                Terms
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/privacy" className="hover:text-(--dark-black) transition-colors duration-200">
                Privacy
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/cookies" className="hover:text-(--dark-black) transition-colors duration-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
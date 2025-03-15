import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <section className="bg-gray-50 flex items-center flex-col">
  <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen">
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="p-3 text-3xl font-extrabold sm:text-5xl">
      Welcome to Expense Tracker 
        <strong className="mt-3 font-extrabold text-blue-700 sm:block">Take Control of Your Finances! </strong>
      </h1>

      <p className="mt-4 font-serif sm:text-xl/relaxed">
      Managing your finances doesn’t have to be complicated. With Expense Tracker, you can effortlessly monitor your income, track your expenses, and gain insights into your spending habits—all in one place.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          className="block w-full rounded-sm bg-blue-600 px-12 py-3 text-lg font-medium text-white shadow-sm hover:bg-red-700 focus:ring-3 focus:outline-hidden sm:w-auto"
          href="#"
        >
          Get Started
        </a>
      </div>
    </div>
  </div>
  <Image src={'/dashboard.png'} alt='dashboard'
  width={1000}
  height={700}
  className='-mt-9 rounded-xl border-2'
  />
</section>
  )
}

export default Hero
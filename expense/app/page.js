import React from 'react'
import Header from './_components/Header'
import Hero from './_components/Hero'
import { SignIn, SignUp } from '@clerk/nextjs'
const Home = () => {
  return (
    <>
    <Header/>
    <Hero/>
    </>
  )
}

export default Home
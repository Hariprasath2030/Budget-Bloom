import React from 'react'
import Link from 'next/link'

function Home() {
  return (
    <div>
      Dashboard
    </div>
  )
}
<Link href="/dashboard">
  <button className="bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition">
    Dashboard
  </button>
</Link>


export default Home

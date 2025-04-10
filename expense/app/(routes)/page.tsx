import React from 'react';
import Link from 'next/link';

function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-2xl font-bold mb-4">
                Dashboard
            </div>
            <Link href="/dashboard">
                <button className="bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition">
                    Go to Dashboard
                </button>
            </Link>
        </div>
    );
}

export default Home;

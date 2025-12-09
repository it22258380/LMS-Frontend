'use client';

import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext'; 

export const HeroSection = () => {
    const { user, isAuthenticated } = useAuth();
    
    // 1. Logged OUT / Guest View (Focus: Discovery & Sign-up)
    const renderGuestHero = () => (
        <>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
                Your Next Great Read Awaits.
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto mb-8">
                Explore our vast digital catalog, reserve your favorites, and manage your literary journey with ease.
            </p>
            <div className="flex justify-center space-x-4">
                <Link href="/books" className="px-8 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-800 transition duration-150">
                    Start Browsing Catalog
                </Link>
                <Link href="/register" className="px-8 py-3 bg-transparent border-2 border-indigo-700 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition duration-150">
                    Join the Community
                </Link>
            </div>
        </>
    );

    // 2. Librarian View (Focus: Management)
    const renderLibrarianHero = () => (
        <>
            <h1 className="text-5xl font-extrabold text-green-700 mb-4">
                Librarian Dashboard: Everything in Control.
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Seamlessly manage inventory, oversee user activity, and maintain the library catalog efficiently.
            </p>
            {/* Simple Metric Cards (Placeholder Data) */}
            <div className="flex justify-center space-x-6 mb-8">
                <div className="p-4 bg-white shadow-md rounded-lg border-l-4 border-green-500">
                    <p className="text-3xl font-bold">5,321</p>
                    <p className="text-sm text-gray-500">Total Books</p>
                </div>
                <div className="p-4 bg-white shadow-md rounded-lg border-l-4 border-green-500">
                    <p className="text-3xl font-bold">12</p>
                    <p className="text-sm text-gray-500">Reserved Today</p>
                </div>
            </div>
            <Link href="/admin/dashboard" className="px-10 py-4 bg-green-600 text-white text-xl font-semibold rounded-lg shadow-xl hover:bg-green-700 transition duration-150">
                Go to Admin Dashboard
            </Link>
        </>
    );
    
    // 3. Regular User View (Focus: Engagement)
    const renderUserHero = () => (
        <>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome Back, Ready to Read?
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                View your active reservations or discover new titles from our curated collection.
            </p>
            <div className="flex justify-center space-x-4">
                <Link href="/profile?tab=reservations" className="px-8 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-800 transition duration-150">
                    My Active Reservations
                </Link>
                <Link href="/books" className="px-8 py-3 bg-transparent border-2 border-indigo-700 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-50 transition duration-150">
                    Continue Browsing
                </Link>
            </div>
        </>
    );

    let contentToRender;
    if (!isAuthenticated) {
        contentToRender = renderGuestHero();
    } else if (user?.role === 'LIBRARIAN') {
        contentToRender = renderLibrarianHero();
    } else {
        contentToRender = renderUserHero();
    }

    return (
        <section className="bg-white py-20 text-center border-b border-gray-200">
            {contentToRender}
        </section>
    );
};
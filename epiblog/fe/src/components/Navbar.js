import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-gray-900 p-3 text-white flex flex-wrap justify-between align-items-center">
            <div>Strive Blogs!</div>
            <ul className="flex">
                <li className="mr-6">
                    <a 
                        className="text-blue-500 hover:text-blue-800"
                        href="/home">Home
                    </a>
                </li>
                <li className="mr-6">
                    <a
                        className="text-blue-500 hover:text-blue-800"
                        href="/about">About
                    </a>
                </li>
                <li className="mr-6">
                    <a
                        className="text-blue-500 hover:text-blue-800"
                        href="/browse">Browse
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
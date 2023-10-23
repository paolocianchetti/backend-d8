import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-gray-900 p-3 text-white flex flex-wrap justify-between align-items-center">
            <div>LOGO</div>
            <div>
                <ul className="flex gap-4">
                    <li>link 1</li>
                    <li>link 1</li>
                    <li>link 1</li>
                    <li>link 1</li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
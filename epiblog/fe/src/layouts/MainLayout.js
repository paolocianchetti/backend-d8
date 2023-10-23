import React from 'react';
import Navbar from "../components/Navbar";

const MainLayout = ({children}) => {
    return (
        <div className="h-screen">
            <Navbar />
            {children}
        </div>
    );
};

export default MainLayout;
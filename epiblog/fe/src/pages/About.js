import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className=''>
            <h1>About</h1>
            <p>Strive Blogs!, 2023. All rights reserved.</p>
            <button className=''>
                <Link to="/home">Torna alla Home</Link>
            </button>
        </div>
    );
};

export default About;
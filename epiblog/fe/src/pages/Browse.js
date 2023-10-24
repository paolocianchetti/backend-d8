import React from 'react';
import { Link } from 'react-router-dom';

const Browse = () => {
    return (
        <div className=''>
            <h1>Browse</h1>
            <br></br>
            <p>Sito in costruzione!</p>
            <button className=''>
                <Link className='' to="/home">Torna alla Home</Link>
            </button>
        </div>
    );
};

export default Browse;
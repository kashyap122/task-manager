import React from 'react'
import MainTask from './MainTask';
import AllUsers from './AllUsers';


const Body = () => {
    return (
        <div className="flex">
            <AllUsers/>
            <MainTask/>
        </div>
    )
}

export default Body
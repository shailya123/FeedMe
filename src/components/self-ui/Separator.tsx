import React from 'react'
type props={
    value:string;
}
const Separator = ({ value }:props) => {
    return (
        <div className="flex justify-center items-center">
            <div className="flex items-center w-full max-w-xl">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="mx-4 text-gray-400 font-bold">{value}</span>
                <div className="flex-grow border-t border-gray-400"></div>
            </div>
        </div>
    )
}

export default Separator

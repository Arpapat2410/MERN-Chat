import React from 'react'
import Avatar from './Avatar'

const Contect = ({ username, id, online, selected }) => {
    return (
        <div className={'border border-[#4e4e4e] flex items-center gap-2 cursor-pointer' + 
            (selected ? 'bg-blue-200' : '')}>
             {selected && (<div className='w-1 bg-[#ffaa00] h-12 rounded-r-md'></div>)}
            <div className='flex gap-2 py-2 pl-4 items-center '>
            <Avatar username={username} userId={id} online={online} />
                <span className='text-white'>
                    {username}
                </span>
            </div>
        </div>
    )
}

export default Contect
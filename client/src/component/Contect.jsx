import React from 'react'
import Avatar from './Avatar'

const Contect = ({ username, id, online, selected ,onClick }) => {
    return (
        <div onClick={()=>onClick(id)} className={' flex items-center gap-2 cursor-pointer ' +
            (selected ? 'bg-[#09090B]' : '')}>
            {selected &&  (<div className='w-2 bg-[#ffaa00] h-12 rounded-r-md'></div>)}
            <div className='flex gap-2 py-2 pl-4 items-center '>
                <Avatar username={username} userId={id} online={online} />
                <span className='text-[#D49F4A]'>
                   {username}
                </span>
            </div>
        </div>
    )
}

export default Contect
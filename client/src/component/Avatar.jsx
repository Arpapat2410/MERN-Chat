import React from 'react';

const Avatar = ({ username, online, userId }) => {
    const colors = [
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-purple-200',
        'bg-blue-200',
        'bg-yellow-200',
        'bg-orange-200',
        'bg-fuchsia-200',
        'bg-rose-200',
    ];

    // Check if userId is defined before accessing its properties
    if (!userId || typeof userId !== 'string') {
        return null; // or handle the case where userId is undefined or not a string
    }

    const userIdBase10 = parseInt(userId.substring(10), 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];

    return (
        <div className={'w-8 h-8 relative rounded-full flex items-center' + color}>
            <div className='text-center w-full opacity-70'>
                {username[0]}
            </div>
            {online && (
                <div className='absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white'>
                </div>
            )}
            {!online && (
                <div className='absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white'>
                </div>
            )}
        </div>
    );
}

export default Avatar;

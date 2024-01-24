import React from 'react'

const NavBar = () => {
    return (
        
   <div className='bg-neutral text-neutral-content'>
        <div className="navbar mx-auto ">
        <div className="flex-1">
            <a className="btn btn-ghost text-xl text-white" >MERN CHAT</a>
        </div>
        <div className="flex-none">
            <div className="dropdown dropdown-end mr-2">
                <button className='btn btn-ghost text-xl text-white' >Home</button>
            </div>
            
            <div className="dropdown dropdown-end mr-2">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                        <a className="justify-between">
                            Profile
                            <span className="badge">New</span>
                        </a>
                    </li>
                    <li><a>Logout</a></li>
                </ul>
            </div>
        </div>
    </div> 
    </div>
    )
}

export default NavBar
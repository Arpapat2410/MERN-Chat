import React from 'react'
import NavBar from './NavBar'
import { UserContext } from "../context/UserContext"
import axios from 'axios'
import Logo from './Logo'
import Contect from './Contect'

const Chat = () => {
    return (
        <>
            <NavBar />
            <div className='flex h-screen'>
                <div className='w-1/3 flex flex-col bg-[#22262d]'>
                    <div className='flex-grow text-'>
                        <Logo />
                        <Contect 
                            username={"user1"}
                            userId={"65a78462ffb2f3cf2d2a9373"}
                            online={true}
                            selected={true}/>
                        <Contect 
                            username={"user2"}
                            userId={"65a78479ffb2f3cf2d2a9375"}
                            online={false}
                            selected={false}/>
                    </div>
                    <div className='p-2 text-center flex items-center justify-center'>
                        <span className='mr-2 text-sm text-white flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-1 w-6 h-6">
                                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                            </svg>
                            Username
                        </span>
                        <button className='text-sm text-white ml-3 py-1 px-2 border rounded-md text-center'>
                            Logout
                        </button>
                    </div>
                </div>

                <div className='w-2/3 flex flex-col p-4'>
                    <div className='flex-grow'>
                        <div className='flex  h-full flex-grow items-center justify-center'>
                            <div className='text-white'>
                                &larr; Seleact a person from sideber
                            </div>
                        </div>
                    </div>
                    <form className='flex gap-2'>
                        <input
                            className='flex-grow border border-[#3d4451] rounded-lg p-2'
                            type='text'
                            placeholder='Type your message'
                        />
                        <label className='bg-blue-200 p-2 text-white cursor-pointer rounded-lg '>
                            <input type='file' className='hidden' />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 0 0-3-3h-3.879a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H6a3 3 0 0 0-3 3v3.162A3.756 3.756 0 0 1 4.094 9h15.812ZM4.094 10.5a2.25 2.25 0 0 0-2.227 2.568l.857 6A2.25 2.25 0 0 0 4.951 21H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-2.227-2.568H4.094Z" />
                            </svg>
                        </label>
                        <button className='bg-[#ffaa00] rounded-lg w-[3%] text-white items-center ' type='submit'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className=" w-6 h-6">
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

        </>

    )
}

export default Chat
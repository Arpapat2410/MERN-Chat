import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const RegisterAndLoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");
    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

    const handleSubmit = async (e) => { // Corrected function name from handleSunmite to handleSubmit
        e.preventDefault();
        const url = isLoginOrRegister === 'register' ? "register" : "login";
        const { data } = await axios.post(url, { username, password });

        setLoggedInUsername(username);
        setId(data.id);
    };

    return (
        <div className=' h-screen flex items-center'>
            <form onSubmit={handleSubmit} className='w-64 mx-auto mb-12  '>
                <div className='text-center text-4xl mb-5'>MERNCHAT </div>
                <input
                    type='text'
                    value={username}
                    className='block w-full rounded-lg p-2 border'
                    placeholder='Username'
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type='password'
                    value={password}
                    className='block w-full rounded-lg p-2 border mt-5'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn w-full bg-[#ea9c00] text-white mt-5" type="submit">
                    {isLoginOrRegister === "register" ? "Register" : "Login"}
                </button>
                <div className='text-center'>
                    {isLoginOrRegister === "register" && (
                        <div className='mt-5'>
                            Already a member?{" "}
                            <button className='ml-1 mt-2' onClick={() => { setIsLoginOrRegister("login") }}>
                                Login here
                            </button>
                        </div>
                    )}
                    {isLoginOrRegister === "login" && (
                        <div className='mt-5'>
                            Don't have an account?{" "}
                            <button className='ml-1 mt-2' onClick={() => { setIsLoginOrRegister("register") }}>
                                Register here
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default RegisterAndLoginForm;

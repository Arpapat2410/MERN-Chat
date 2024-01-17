import ResgiterAndLoginForm from "./component/ResgiterAndLoginForm";
import Chat from "./component/Chat";
import { UserContext } from "./context/UserContext";
import { useContext } from "react";

import React from 'react'

const Routes = () => {
    const { username } = useContext(UserContext);
    if (username) { 
        return <Chat/>
    }
    return <ResgiterAndLoginForm/>
  
}

export default Routes
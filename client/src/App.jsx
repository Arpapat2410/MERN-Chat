import axios from "axios";
import NavBar from "./component/NavBar";
import { UserContextProvider } from "./context/UserContext";
import Routes from "./Routes";
import { useState } from "react";

function App() {
  //set axios url 
  axios.defaults.baseURL = "http://localhost:4000"; // Corrected property name
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;

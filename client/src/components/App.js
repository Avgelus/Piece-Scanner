import React, { useEffect, useState } from "react";
import {Outlet, useNavigate, useOutletContext} from "react-router-dom";
import Login from "./Pages/Login/Login";
import { Button } from "@mui/material";


function App() {

  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    fetch('/check_session')
    .then((resp) => {
      if(resp.ok) {
        resp.json().then((user) => setUser(user))
      } else {
        console.log('error')
      }
    })
  }, [])
  
console.log(user)

function handleLogout() {
    fetch('/logout', {
      method: 'DELETE' 
    }).then((resp) => {
      if (resp.ok) {
        setUser(null);
        navigate('/login')
      }
    });
  }

const context={
  setUser,
  handleLogout,
  navigate
}
if(!user) {
    <Outlet context={context}/>
}

  return (
  
  <div> 
    <Outlet context={context}/>
    {user&&<Button variant="contained" onClick={handleLogout}>Logout</Button>}
  </div>
   
  )
}

export default App;

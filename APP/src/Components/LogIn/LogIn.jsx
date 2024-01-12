import React, { useCallback, useContext, useRef } from "react";
import { useState } from "react";
import { userContext } from "../../App";


const LogIn=()=>{

   const userNameRef = useRef("");
   const websiteRef = useRef("");
   const errMessageRef = useRef("");
   const {currentUser, setCurrentUser} = useContext(userContext);
   function handleSubmit(event)
   {
     event.preventDefault();
     fetch(`http://localhost:3000/users?username=${userNameRef.current.value}&website=${websiteRef.current.value}`)
     .then(result=>result.json())
     .then(json=>
        {
            console.log(json);
            navToHomePage(json)})
     .catch(error=>
        errMessageRef.current="Incorrect username or password")
   }

   function navToHomePage(userDetails){
    localStorage.setItem("currentUser", userDetails)
    setCurrentUser(userDetails);
   }

    
    return(
        <>
            <div className="login-wrapper">
                <h1>Please Log In</h1>
                <form onSubmit={handleSubmit}> 
                <label>
                    <p>Username</p>
                    <input ref={userNameRef} type="text" />
                </label>
                <label>
                    <p>Website</p>
                    <input ref={websiteRef} type="password" />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
                </form>
            </div>
            <p>{errMessageRef.current.value}</p>
        </>
    )
}

export default LogIn
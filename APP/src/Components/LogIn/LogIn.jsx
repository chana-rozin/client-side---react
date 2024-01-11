import React from "react";
import { useState } from "react";


const LogIn=()=>{

   const[userName,setUserName] = useState("");
   const[website,setWebsite] = useState("");

   function handleSubmit(event)
   {
     
   }
    
    return(
        <>
            <div className="login-wrapper">
                <h1>Please Log In</h1>
                <form>
                <label>
                    <p>Username</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Website</p>
                    <input type="password" />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
                </form>
            </div>
        </>
    )
}

export default LogIn
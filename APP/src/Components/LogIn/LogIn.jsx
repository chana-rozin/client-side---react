import React, {useContext} from "react";
import { useState } from "react";
import { userContext } from "../../App";
import { Link } from "react-router-dom";


const LogIn=()=>{
   const [errMessage,setErrMessage]= useState("");
   const {currentUser, setCurrentUser} = useContext(userContext);
   function handleSubmit(event)
   {
     event.preventDefault();
     const username=event.target.username.value;
     const password=event.target.password.value;
     fetch(`http://localhost:3000/users?username=${username}&website=${password}`)
     .then(result=>result.json())
     .then(json=>json.length? navToHomePage(json[0]):setErrMessage("Incorrect username or password"))
     .catch(error=>setErrMessage("ERROR try agian"))
   }

   function navToHomePage(userDetails){
    localStorage.setItem("currentUser", JSON.stringify(userDetails));
    setCurrentUser(userDetails);
   }

    
    return(
        <>
            <div className="login-wrapper">
                <h1>Please Log In</h1>
                <form onSubmit={handleSubmit}> 
                    <label htmlFor="username">username</label>
                        <input name="username" type="text" />
                    <label htmlFor="password">Password</label>
                        <input name="password" type="password" />
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
            <p>{errMessage}</p>
            <p>don't have an account yet? let's <Link to={"/register"}>sign up</Link></p>
            
        </>
    )
}

export default LogIn
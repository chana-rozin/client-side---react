import React, { useCallback, useContext, useRef, useState } from "react";


const Register = ()=>{
    const [password,setPassword] = useState("");
    const [verifyPassword,setVerifyPassword] = useState("");
    const [isPwVerified,setIsPwVerified] = useState(false);
    const [errMessage,setErrMessage]= useState("");
    const [registerStep,setRgisterStep] = useState(1);

    function handlePwVerifyChange(event)
    {
        event.preventDefault();
        setVerifyPassword(event.target.verifyPassword.value);
        setIsPwVerified(password===verifyPassword);
    }

    const handlePasswordChange=(event)=>{
      setPassword(event.target.password.value)
    }

    function handleNextBtn(event)
    {
        event.preventDefault();
        fetch(`http://localhost:3000/users?username=${event.target.username.value}`)
        .then(result=>result.json())
        .then(json=>json.length? setErrMessage("This username already exists"):requestMoreDetails())
        .catch(error=>setErrMessage("ERROR try agian"))
    }
   
    function requestMoreDetails(){
    localStorage.setItem("currentUser", JSON.stringify(userDetails));
    setCurrentUser(userDetails);
    }

    return(
        <>
          <div className="signUp-wrapper">
                <h1>Please sign up</h1>
                <form disabled={registerStep!=1} onSubmit={handleNextBtn}> 
                    <label htmlFor="username">Username</label>
                        <input name="username" type="text" />
                    <label htmlFor="password">Password</label>
                        <input onChange={handlePasswordChange} name="password" type="password" />
                    <label htmlFor="verifyPassword">Verify Password</label>
                        <input onChange={handlePwVerifyChange} name="verifyPassword" type="password" />
                    {registerStep===1 &&<div>
                       <button disabled={!isPwVerified} type="submit">Next</button>
                    </div>}
                </form>

                {registerStep===2 && <form onSubmit={handleSubmit}> 
                    <label htmlFor="username">Username</label>
                        <input name="username" type="text" />
                    <label htmlFor="password">Password</label>
                        <input onChange={handlePasswordChange} name="password" type="password" />
                    <label htmlFor="verifyPassword">Verify Password</label>
                        <input onChange={handlePwVerifyChange} name="verifyPassword" type="password" />
                    <div>
                       <button type="submit">submit</button>
                    </div>
                </form>}
                {
              "id": 1,
              "name": "Leanne Graham",
              "username": "Bret",
              "email": "Sincere@april.biz",
              "address": {
                "street": "Kulas Light",
                "suite": "Apt. 556",
                "city": "Gwenborough",
                "zipcode": "92998-3874",
                "geo": {
                  "lat": "-37.3159",
                  "lng": "81.1496"
                }
              },
              "phone": "1-770-736-8031 x56442",
              "website": "hildegard.org",
              "company": {
                "name": "Romaguera-Crona",
                "catchPhrase": "Multi-layered client-server neural-net",
                "bs": "harness real-time e-markets"
              }
            },

            </div>
            <p>{errMessage}</p>
        </>
    )

}
export default Register
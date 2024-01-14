import React, { useCallback, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ()=>{
    const [password,setPassword] = useState("");
    const [verifyPassword,setVerifyPassword] = useState("");
    const [isPwVerified,setIsPwVerified] = useState(false);
    const [errMessage,setErrMessage]= useState("");
    const [registerStep,setRgisterStep] = useState(1);
    const navigate = useNavigate();
    const user={
        "id": 0,
        "name": "",
        "username": "",
        "email": "",
        "address": {
            "street": "",
            "suite": "",
            "city": "",
            "zipcode": "",
            "geo": {
              "lat": "",
              "lng": ""
            }
          },
          "phone": "",
          "website": "",
          "company": {
            "name": "",
            "catchPhrase": "",
            "bs": ""
          }
    }
    
    function handlePwVerifyChange(event)
    {
        event.preventDefault();
        setIsPwVerified(password===event.target.value);
    }

    const handlePasswordChange=(event)=>{
      event.preventDefault();
      setPassword(event.target.value)
    }

    function handleNextBtn(event)
    {
        event.preventDefault();
        fetch(`http://localhost:3000/users?username=${event.target.username.value}`)
        .then(result=>result.json())
        .then(json=>json.length? setErrMessage("This username already exists"):requestMoreDetails(event))
        .catch(error=>setErrMessage("ERROR try agian"))
    }
   
    function requestMoreDetails(event){
        user.username=event.target.username.value;
        user.website=event.target.password.value;
        setRgisterStep(2);
    }

    async function handleSubmit(event)
    {
      event.preventDefault();
      user.id=await  getNextId()??alert("sorry, try later");
      
      navigate("/home");
    }

    function getNextId()
    {
        return fetch(`http://localhost:3000/config`)
        .then(result=>result.json())
        .then(json=>json.id)
        .catch(error=>null)
    }

    return(
        <>
          <div className="signUp-wrapper">
                <h1>Please sign up</h1>
                <form onSubmit={(event)=>handleNextBtn(event)}> 
                    <label htmlFor="username">Username</label>
                        <input disabled={registerStep!=1} name="username" type="text" />
                    <label htmlFor="password">Password</label>
                        <input disabled={registerStep!=1} onChange={(event)=>handlePasswordChange(event)} name="password" type="password" />
                    <label htmlFor="verifyPassword">Verify Password</label>
                        <input disabled={registerStep!=1} onChange={(event)=>handlePwVerifyChange(event)} name="verifyPassword" type="password" />
                    {registerStep===1 &&<div>
                       <button disabled={!isPwVerified} type="submit">Next</button>
                    </div>}
                </form>

                {registerStep===2 && <form onSubmit={handleSubmit}> 
                    <label htmlFor="name">Name</label>
                        <input name="name" type="text" />
                    <label htmlFor="email">Email</label>
                        <input required name="email" type="email" />
                    <label>Address</label>    
                    <label htmlFor="street">street</label>
                        <input required name="street" type="text" />
                    <label htmlFor="suite">suite</label>
                        <input required name="suite" type="text" />
                    <label htmlFor="city">city</label>
                        <input required name="city" type="text" />
                    <label htmlFor="zipcode">zipcode</label>
                        <input required name="zipcode" type="text" />
                    <label>geo</label>
                    <label htmlFor="lat">lat</label>
                        <input required name="lat" type="text" />
                    <label htmlFor="lng">lng</label>
                        <input required name="lng" type="text" />
                    <label htmlFor="phone">phone</label>
                        <input required name="phone" type="text" />
                    <label>company</label>
                    <label htmlFor="name">name</label>
                        <input required name="name" type="text" />
                    <label htmlFor="catchPhrase">catchPhrase</label>
                        <input required name="catchPhrase" type="text" />
                    <label htmlFor="bs">bs</label>
                        <input required name="bs" type="text" />
                    <div>
                       <button type="submit">submit</button>
                    </div>
                </form>}
            </div>
            <p>{errMessage}</p>
        </>
    )

}
export default Register
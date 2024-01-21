import React, { useContext } from "react";
import { useState } from "react";
import { userContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { currentUser, setCurrentUser } = useContext(userContext);
  const navigate = useNavigate();

  function handleFormSubmit(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    fetch(`http://localhost:3000/users?username=${username}&website=${password}`)
      .then((result) => result.json())
      .then((json) =>
        json.length ? navigateToHomePage(json[0]) : setErrorMessage("Incorrect username or password")
      )
      .catch((error) => setErrorMessage("ERROR. Please try again"));
  }

  function navigateToHomePage(userDetails) {
    delete userDetails["website"];
    localStorage.setItem("currentUser", JSON.stringify(userDetails));
    navigate("/home");
    setCurrentUser(userDetails);
  }

  return (
    <>
      <div className="login-wrapper">
        <h1>Please Log In</h1>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="username">Username</label>
          <input name="username" type="text" required />
          <label htmlFor="password">Password</label>
          <input name="password" type="password" required />
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      <p>{errorMessage}</p>
      <p>
        Don't have an account yet? Let's <Link to={"/register"}>sign up</Link>
      </p>
    </>
  );
};

export default Login;

import {useNavigate, Navigate, Outlet} from "react-router-dom";
import { userContext } from "../../App";
import { React, useContext } from "react";

const PrivateRoute=()=>{
    const {currentUser, setCurrentUser} = useContext(userContext);
    return(
       <> {currentUser==null ? <Navigate to={"/login"}/>:<Outlet/>}</>
    )
}

export default PrivateRoute;
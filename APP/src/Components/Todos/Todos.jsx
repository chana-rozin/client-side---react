import React, {useContext} from "react";
import { userContext } from "../../App";

import {Navigate, useNavigate } from 'react-router-dom'

    const Todos=()=>{
    const navigate = useNavigate();
    const {currentUser, setCurrentUser} = useContext(userContext);

    return(<>
    <p>todos</p>
    </>)
}

export default Todos
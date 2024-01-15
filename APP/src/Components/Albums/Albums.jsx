import React, {useContext} from "react";
import { userContext } from "../../App";

import {Navigate, useNavigate } from 'react-router-dom'

    const Albums=()=>{
    const navigate = useNavigate();
    const {currentUser, setCurrentUser} = useContext(userContext);

    return(<>
        <p>Albums</p>
        </>)
}

export default Albums
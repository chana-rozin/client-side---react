import { Link , Outlet, useNavigate, useParams} from "react-router-dom"
import React, {useContext} from "react";
import { userContext } from "../../App";
import style from "./Layout.module.css";

const Layout = ()=>{

    const navigate = useNavigate();
    const {currentUser, setCurrentUser} = useContext(userContext);
    const userId= currentUser.id;
    function handleLogout(){
        localStorage.removeItem("currentUser");
        navigate("/login");
        setCurrentUser(null);
    }

    
    return (
        <>
            <h1>{currentUser.name}</h1>
            <nav className={style.c}>
                    <Link to={`/users/${userId}/info`} >
                        <dt>Info</dt>
                    </Link>
                    <Link to={`/users/${userId}/todos`} >
                        <dt>Todos</dt>
                    </Link>
                    <Link to={`/users/${userId}/posts`} >
                        <dt>Posts</dt>
                    </Link>
                    <Link to={`/users/${userId}/albums`} >
                        <dt>Albums</dt>
                    </Link>
                    <a onClick={()=>handleLogout()} >
                        <dt>Logout</dt>
                   </a>
            </nav>
            <Outlet/>
        </>
    )
}

export default Layout
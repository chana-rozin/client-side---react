import { Link, Outlet, useNavigate, useParams } from "react-router-dom"
import React, { useContext } from "react";
import { userContext } from "../../App";
import style from "./Layout.module.css";

const Layout = () => {

    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;;
    
    function handleLogout() {
        localStorage.removeItem("currentUser");
        navigate("/login");
        setCurrentUser(null);
    }


    return (
        <><header>
            <h1>Hi {currentUser.name}</h1>
            <nav className={style.links}>
                <Link to={`/home`} >
                    <dt>Home</dt>
                </Link>
                <Link to={`/users/${userId}/info`} >
                    <dt>Info</dt>
                </Link>
                <Link to={`/users/${userId}/todos`} >
                    <dt>Todos</dt>
                </Link>
                <Link to={`/users/${userId}/posts`} onClick={localStorage.setItem("displayMode", "personalPosts")}>
                    <dt>Posts</dt>
                </Link>
                <Link to={`/users/${userId}/albums`} >
                    <dt>Albums</dt>
                </Link>
                <a onClick={() => handleLogout()} >
                    <dt>Logout</dt>
                </a>
            </nav>
        </header>
            <div className={style.content}><Outlet /></div>
        </>
    )
}

export default Layout
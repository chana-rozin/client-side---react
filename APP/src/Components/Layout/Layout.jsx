import { Link , Outlet, useNavigate, useParams} from "react-router-dom"
import React, {useContext} from "react";
import { userContext } from "../../App";

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
            <nav>
                <ul>
                    <Link to={`/users/${userId}/info`}>
                        <li>Info</li>
                    </Link>
                    <Link to={`/users/${userId}/todos`}>
                        <li>Todos</li>
                    </Link>
                    <Link to={`/users/${userId}/posts`}>
                        <li>Posts</li>
                    </Link>
                    <Link to={`/users/${userId}/albums`}>
                        <li>Albums</li>
                    </Link>
                    <a onClick={()=>handleLogout()}>
                        <li>Logout</li>
                   </a>
                </ul>
            </nav>
            <Outlet/>
        </>
    )
}

export default Layout
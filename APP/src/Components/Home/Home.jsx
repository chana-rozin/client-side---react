import { Link , useNavigate} from "react-router-dom"
import React, {useContext} from "react";
import { userContext } from "../../App";

const Home = ()=>{

    const navigate = useNavigate();
    const {currentUser, setCurrentUser} = useContext(userContext);
    function handleLogout(){
        localStorage.clear();
        navigate("/login");
        setCurrentUser(null);
    }

    return (
        <>
            <h1>hi!</h1>
            <nav>
                <ul>
                    <Link to={"/info"}>
                        <li>Info</li>
                    </Link>
                    <Link to={"/todos"}>
                        <li>Todos</li>
                    </Link>
                    <Link to={"/posts"}>
                        <li>Posts</li>
                    </Link>
                    <Link to={"/albums"}>
                        <li>Albums</li>
                    </Link>
                    <a onClick={()=>handleLogout()}>
                        <li>Logout</li>
                   </a>
                </ul>
            </nav>
        </>
    )
}

export default Home
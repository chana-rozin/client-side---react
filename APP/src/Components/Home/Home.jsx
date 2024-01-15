import { Link , useNavigate} from "react-router-dom"

const Home = ()=>{

    const navigate = useNavigate();

    function handleLogout(){
        localStorage.clear();
        navigate("/login");
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
import { Link } from "react-router-dom"

const Home = ()=>{
    return (
        <>
            <h1>hi!</h1>
            <nav>
                <ul>
                    <Link to={"./Dashboard"}>
                        <li>Info</li>
                    </Link>
                </ul>
            </nav>
        </>
    )
}

export default Home
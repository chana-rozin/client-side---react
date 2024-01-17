import { Link, useLocation } from "react-router-dom"

const PostDetails=()=>{
    const location = useLocation();
    const {postBody} = location.state;
    console.log(postBody)

    return(<><h1>hi</h1></>)
}

export default PostDetails
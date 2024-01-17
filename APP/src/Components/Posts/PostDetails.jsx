import { Link, useLocation } from "react-router-dom"

const PostDetails=()=>{
    const location = useLocation();
    const {postBody} = location.state;
    console.log(postBody)

    return(<><p>{postBody} </p></>)
}

export default PostDetails
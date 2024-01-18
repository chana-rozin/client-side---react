import { Link, useLocation } from "react-router-dom"

const PostDetails = (props) => {
    const { post, setAllData } = props;

    return (
        <>
            <p>{post.body} </p>
            
        </>)

}

export default PostDetails
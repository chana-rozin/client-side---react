import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PostDetails from "../Posts/PostDetails";
import { userContext } from "../../App";
import { useContext, useState } from "react";
import UpdateComment from "./UpdateComment"
const Comments = () => {
    const location = useLocation()
    const {postId} = location.state;
    const [commentsData, setCommentsData] = useState([]);
    const [inEditing, setInEditing] = useState(-1);
    const { currentUser, setCurrentUser } = useContext(userContext);

    useEffect(() => {
        const fetchComments = async () =>
            fetch(`http://localhost:3000/comments?postId=${postId}`)
                .then(response => response.json())
                .then(data => {
                    setCommentsData(data);
                })
                .catch(error =>
                    console.error(error));
        fetchComments();
    }, []);

    return (<>
        <div>
            {commentsData.map(comment =>
                <div key={comment.id}>
                    {inEditing!=comment.id ?<>
                    <div ><b>{comment.name}</b></div>
                    <div>{comment.body}</div>
                    {comment.email == currentUser.email && <>
                        <span onClick={() => deleteComment(comment.id)}><RiDeleteBin7Fill /></span>
                        <span onClick={() => setInEditing(comment.id)}><MdOutlineEdit /></span>
                    </>}</>
                    :<UpdateComment comment={comment} setInEditing={setInEditing} setCommentsData={setCommentsData}/>}
                </div>
           )}
        </div>

    </>)
}

export default Comments;
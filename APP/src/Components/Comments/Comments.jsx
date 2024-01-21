import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PostDetails from "../Posts/PostDetails";
import { userContext } from "../../App";
import { useContext, useState } from "react";
import UpdateComment from "./UpdateComment"
import Popup from 'reactjs-popup';
import { FiPlusCircle } from "react-icons/fi";
import AddComment from "./AddComment";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
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

    function deleteComment(id) {
        setCommentsData(prevArr => prevArr.filter(comment => comment.id != id));

        fetch(`http://localhost:3000/comments/${id}`, {
            method: 'DELETE',
        })
            .then(re => console.log(re));
    }
    console.log(currentUser);

    return (<>
    <div> <Popup trigger=
                    {<FiPlusCircle />}
                    position="down">
                    {
                        close => (
                            <div className='modal'>
                                <div className='content'>
                                    <AddComment  postId={postId} setCommentsData={setCommentsData} closePopUp={close} />
                                </div>
                            </div>
                        )
                    }
                </Popup></div>
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
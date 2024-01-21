import React, { useEffect, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import PostDetails from "../Posts/PostDetails";
import { userContext } from "../../App";
import UpdateComment from "./UpdateComment";
import Popup from "reactjs-popup";
import { FiPlusCircle } from "react-icons/fi";
import AddComment from "./AddComment";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";

const Comments = () => {
  const location = useLocation();
  const { postId } = location.state;
  const [commentsData, setCommentsData] = useState([]);
  const [inEditingCommentId, setInEditingCommentId] = useState(-1);
  const { currentUser, setCurrentUser } = useContext(userContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/comments?postId=${postId}`);
        const data = await response.json();
        setCommentsData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
  }, [postId]);

  function handleDeleteComment(id) {
    setCommentsData((prevComments) => prevComments.filter((comment) => comment.id !== id));

    fetch(`http://localhost:3000/comments/${id}`, {
      method: "DELETE",
    })
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  }

  return (
    <>
      <div>
        <Popup trigger={<FiPlusCircle />} position="down">
          {(close) => (
            <div className="modal">
              <div className="content">
                <AddComment postId={postId} setCommentsData={setCommentsData} closePopUp={close} />
              </div>
            </div>
          )}
        </Popup>
      </div>
      <div>
        {commentsData.map((comment) => (
          <div key={comment.id}>
            {inEditingCommentId !== comment.id ? (
              <>
                <div>
                  <b>{comment.name}</b>
                </div>
                <div>{comment.body}</div>
                {comment.email === currentUser.email && (
                  <>
                    <span onClick={() => handleDeleteComment(comment.id)}>
                      <RiDeleteBin7Fill />
                    </span>
                    <span onClick={() => setInEditingCommentId(comment.id)}>
                      <MdOutlineEdit />
                    </span>
                  </>
                )}
              </>
            ) : (
              <UpdateComment comment={comment} setInEditing={setInEditingCommentId} setCommentsData={setCommentsData} />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Comments;

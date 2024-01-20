import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../../App";
const AddComment = (props) => {

    const {postId, setAllData, closePopUp,setIsAdded} = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
    const navigate = useNavigate();

    const comment = {
        "postId": {postId},
        "id": "",
        "name": "",
        "email": currentUser.email,
        "body": ""
      }
    async function handleAddBtn(event) {
        event.preventDefault();
        comment.name = event.target.title.value;
        comment.body = event.target.body.value;
        comment.id = await getCommentId();
        addComment();
        closePopUp();
    }

    async function addComment() {
        await fetch("http://localhost:3000/comments", {
            method: 'POST',
            body: JSON.stringify(post),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.status === 201) {
                    increaseCommentId();
                    setAllData(prevArr=>[...prevArr,post]);
                    setIsAdded(true);
                }
                else {
                    setErrMessage("500 something get worng:( try latter.")
                }
            })
    }

    function increaseCommentId() {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ "postId": (Number)(post.id) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .catch(err => console.error(err))
    }


    async function getPostId() {
        const id = await fetch("http://localhost:3000/config/1")
            .then(result => result.json())
            .then(json => json.postId.toString())
            .catch(error => console.error(error));
        return id;
    }

    return (
        <>
            <p>add your post:</p>
            <div>
                <form onSubmit={(event) => handleAddBtn(event)}>
                    <span><input placeholder="your post title:" type="text" name="title"></input></span>
                    <span><input placeholder="your post body:" type="text" name="body"></input></span>
                    <button type="submit">add</button>
                </form>
            </div>
        </>
    )
}


export default AddComment
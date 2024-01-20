import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../../App";
const AddComment = (props) => {

    const {postId, setCommentsData, closePopUp} = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
    const navigate = useNavigate();

    const comment = {
        "postId": postId,
        "id": "",
        "name": "",
        "email": currentUser.email,
        "body": ""
      }
    async function handleAddBtn(event) {
        event.preventDefault();
        comment.name = event.target.name.value;
        comment.body = event.target.body.value;
        comment.id = await getCommentId();
        addComment();
        closePopUp();
    }

    async function addComment() {
        await fetch("http://localhost:3000/comments", {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.status === 201) {
                    increaseCommentId();
                    setCommentsData(prevArr=>[...prevArr,comment]);
                }
                else {
                    setErrMessage("500 something get worng:( try latter.")
                }
            })
    }

    function increaseCommentId() {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ "commentId": (Number)(comment.id) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .catch(err => console.error(err))
    }


    async function getCommentId() {
        const id = await fetch("http://localhost:3000/config/1")
            .then(result => result.json())
            .then(json => json.commentId.toString())
            .catch(error => console.error(error));
        return id;
    }

    return (
        <>
            <p>add your comment:</p>
            <div>
                <form onSubmit={(event) => handleAddBtn(event)}>
                    <span><input placeholder="name" type="text" name="name" required></input></span>
                    <span><input placeholder="your text here" type="text" name="body" required></input></span>
                    <button type="submit">add</button>
                </form>
            </div>
        </>
    )
}


export default AddComment
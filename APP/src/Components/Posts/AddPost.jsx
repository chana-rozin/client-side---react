import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../../App";
const AddPost = (props) => {

    const { setAllData, closePopUp, setIsAdded } = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;
    const navigate = useNavigate();

    const post = {
        "userId": "0",
        "id": "0",
        "title": "",
        "body": ""
    }
    async function handleAddBtn(event) {
        event.preventDefault();
        post.userId = userId;
        post.title = event.target.title.value;
        post.body = event.target.body.value;
        post.id = await getPostId();
        addPost();
        closePopUp();
    }

    async function addPost() {
        await fetch("http://localhost:3000/posts", {
            method: 'POST',
            body: JSON.stringify(post),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.status === 201) {
                    increasePostId();
                    setAllData(prevArr => [...prevArr, post]);
                }
                else {
                    setErrMessage("500 something get worng:( try latter.")
                }
            })
    }

    function increasePostId() {
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
            <div className="container">
                <p>add your post:</p>
                <form onSubmit={handleAddBtn}>
                    <input placeholder="your post title:" type="text" name="title"></input>
                    <textarea name="body" placeholder="your post body:"></textarea>
                    <input type="submit" value="Add"></input>
                </form>
            </div>
        </>
    )
}


export default AddPost
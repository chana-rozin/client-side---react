import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../../App";
const AddAlbum = (props) => {

    const { setMyAlbums, closePopUp,setIsAdded} = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
    const userId = currentUser.id;
    const navigate = useNavigate();

    const Album = {
        "userId": "0",
        "id": "0",
        "title": ""
      }
    async function handleAddBtn(event) {
        event.preventDefault();
        post.userId = userId;
        post.title = event.target.title.value;
        post.id = await getAlbumId();
        addAlbum();
        closePopUp();
    }

    async function addAlbum() {
        await fetch("http://localhost:3000/albums", {
            method: 'POST',
            body: JSON.stringify(album),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.status === 201) {
                    increaseAlbumId();
                    setMyAlbums(prevArr=>[...prevArr,album]);
                    setIsAdded(true);
                }
                else {
                    setErrMessage("500 something get worng:( try latter.")
                }
            })
    }

    function increaseAlbumId() {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ "postId": (Number)(post.id) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .catch(err => console.error(err))
    }


    async function getAlbumId() {
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


export default AddAlbum
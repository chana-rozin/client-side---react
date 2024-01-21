import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../../App";

const AddPhoto = (props) => {

    const {albumId, setPhotosArr, closePopUp} = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
    const navigate = useNavigate();

    const photo = {
      "albumId": albumId,
      "id": "0",
      "title": "",
      "url": "",
      "thumbnailUrl": ""
    }

    async function handleAddBtn(event) {
        event.preventDefault();
        photo.title = event.target.title.value;
        photo.url = event.target.url.value;
        photo.thumbnailUrl = event.target.thumbnailUrl.value;
        photo.id = await getPhotoId();
        addPhoto();
        closePopUp();
    }

    async function addPhoto() {
        await fetch("http://localhost:3000/photos", {
            method: 'POST',
            body: JSON.stringify(photo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.status === 201) {
                    increasePhotoId();
                    setPhotosArr(prevArr=>[...prevArr,photo]);
                }
                else {
                    setErrMessage("500 something get worng:( try latter.")
                }
            })
    }

    function increasePhotoId() {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ "photoId": (Number)(photo.id) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .catch(err => console.error(err))
    }


    async function getPhotoId() {
        const id = await fetch("http://localhost:3000/config/1")
            .then(result => result.json())
            .then(json => json.photoId.toString())
            .catch(error => console.error(error));
        return id;
    }

    return (
        <>
            <p>add your photo:</p>
            <div>
                <form onSubmit={(event) => handleAddBtn(event)}>
                    <span><input placeholder="title" type="text" name="title"></input></span>
                    <span><input placeholder="your photo url" type="url" name="url" required></input></span>
                    <span><input placeholder="your thumbnail url" type="url" name="thumbnailUrl" required></input></span>
                    <button type="submit">add</button>
                </form>
            </div>
        </>
    )
}


export default AddPhoto
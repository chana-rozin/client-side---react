import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../../App";
import { cacheContext } from "../../App";

const AddAlbum = (props) => {
    const { setMyAlbumsArr, closePopUp} = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
    const {cacheGet,updateCacheFrequencies} = useContext(cacheContext);
    const userId = currentUser.id;
    const navigate = useNavigate();

    const defaultAlbum = {
        "userId": "0",
        "id": "0",
        "title": ""
    };

    const [album, setAlbum] = useState({ ...defaultAlbum });
    const [errMessage, setErrMessage] = useState("");

    async function handleAddBtn(event) {
        event.preventDefault();
        const newAlbum = {
            userId: userId,
            title: event.target.title.value,
            id: await getAlbumId(),
        };
        setAlbum(newAlbum);
        addAlbum(newAlbum);
        closePopUp();
    }

    async function addAlbum(newAlbum) {
        try {
            const response = await fetch("http://localhost:3000/albums", {
                method: 'POST',
                body: JSON.stringify(newAlbum),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (response.ok) {
                increaseAlbumId();
                let updateData;
                setMyAlbumsArr((prevArr) => {updateData=[...prevArr, newAlbum];
                    return updateData;});
                localStorage.setItem("albums", JSON.stringify({user:currentUser.id,data:updateData}))
                updateCacheFrequencies("albums");
            } else {
                setErrMessage("500 something get wrong:( try later.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    function increaseAlbumId(newAlbum) {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ "albumId": Number(newAlbum.id) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .catch(err => console.error(err));
    }

    async function getAlbumId() {
        try {
            const id = await fetch("http://localhost:3000/config/1")
                .then(result => result.json())
                .then(json => json.albumId.toString());
            return id;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="container">
            <p>Add your album:</p>
                <form onSubmit={handleAddBtn}>
                <input placeholder="Your album title:" type="text" name="title"></input>
                    <input type="submit" value="Add"></input>
                </form>
            </div>
        </>
    );
};

export default AddAlbum;

import { useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect, useRef } from "react";
import { userContext } from "../../App";

const AddAlbum = (props) => {
    const { setMyAlbums, closePopUp, setIsAdded } = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
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

            if (response.status === 201) {
                increaseAlbumId();
                setMyAlbums(prevArr => [...prevArr, newAlbum]);
                setIsAdded(true);
            } else {
                setErrMessage("500 something get wrong:( try later.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    function increaseAlbumId() {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ "albumId": Number(album.id) + 1 }),
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
            <p>Add your album:</p>
            <div>
                <form onSubmit={(event) => handleAddBtn(event)}>
                    <span><input placeholder="Your album title:" type="text" name="title"></input></span>
                    <button type="submit">Add</button>
                </form>
            </div>
        </>
    );
};

export default AddAlbum;

import React, { useContext} from "react";
import { userContext } from "../../App";
import { cacheContext } from "../../App";

const AddAlbum = (props) => {
    const { setMyAlbumsArr, closePopUp } = props;
    const { currentUser} = useContext(userContext);
    const {updateCacheFrequencies } = useContext(cacheContext);
    const userId = currentUser.id;

    const album = {
        "userId": "0",
        "id": "0",
        "title": ""
    };

    async function handleAddBtn(event) {
        event.preventDefault();
        album.userId = userId,
        album.title = event.target.title.value,
        album.id = await getAlbumId(),
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
            .then((respons) => {
                if (respons.ok) {
                    increaseAlbumId();
                    let updateData;
                    setMyAlbumsArr((prevArr) => {
                        updateData = [...prevArr, album];
                        return updateData;
                    });
                    localStorage.setItem("albums", JSON.stringify({ user: currentUser.id, data: updateData }))
                    updateCacheFrequencies("albums");
                }
            })
            .catch((error) => console.error(error))
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
        const id = await fetch("http://localhost:3000/config/1")
            .then(result => result.json())
            .then(json => json.albumId.toString())
            .catch(err => console.error(err));
        return id;
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

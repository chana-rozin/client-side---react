import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../App";
import "../commonStyle/popupStyle.css"

const AddPhoto = (props) => {
    const { albumId, setPhotosArr, closePopUp } = props;
    const { currentUser } = useContext(userContext);
    const navigate = useNavigate();

    const newPhoto = {
        albumId: albumId,
        id: "0",
        title: "",
        url: "",
        thumbnailUrl: ""
    };

    async function handleAddBtn(event) {
        event.preventDefault();
        newPhoto.title = event.target.title.value;
        newPhoto.url = event.target.url.value;
        newPhoto.thumbnailUrl = event.target.thumbnailUrl.value;
        newPhoto.id = await getPhotoId();
        addPhoto();
        closePopUp();
    }

    async function addPhoto() {
        try {
            const response = await fetch("http://localhost:3000/photos", {
                method: 'POST',
                body: JSON.stringify(newPhoto),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (response.status === 201) {
                increasePhotoId();
                setPhotosArr(prevArr => [...prevArr, newPhoto]);
            } else {
                console.error("Failed to add photo");
            }
        } catch (error) {
            console.error(error);
        }
    }

    function increasePhotoId() {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ "photoId": parseInt(newPhoto.id, 10) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .catch(err => console.error(err))
    }

    async function getPhotoId() {
        try {
            const id = await fetch("http://localhost:3000/config/1")
                .then(result => result.json())
                .then(json => json.photoId.toString());
            return id;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            
            <div className="container">
                <p>Add your photo:</p>
                <form onSubmit={handleAddBtn}>
                    <input placeholder="Title" type="text" name="title" />
                    <input placeholder="Photo URL" type="url" name="url" required />
                    <input placeholder="Thumbnail URL" type="url" name="thumbnailUrl" required />
                    <input type="submit" value="Add"></input>
                </form>
            </div>
        </>
    )
}

export default AddPhoto;

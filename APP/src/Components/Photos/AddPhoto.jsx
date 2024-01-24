import React, { useContext } from "react";
import { userContext } from "../../App";
import { cacheContext } from "../../App";
import "../commonStyle/popupStyle.css"

const AddPhoto = (props) => {
    const { albumId, hasMore, photosArr, setPhotosArr, closePopUp } = props;
    const { currentUser } = useContext(userContext);
    const {updateCacheFrequencies} = useContext(cacheContext);

    const photo = {
        albumId: albumId,
        id: "0",
        title: "",
        url: "",
        thumbnailUrl: ""
    };

    async function handleAddBtn(event) {
        event.preventDefault();
        photo.title = event.target.title.value;
        photo.url = event.target.url.value;
        photo.thumbnailUrl = event.target.thumbnailUrl.value;
        photo.id = await getPhotoId();
        addPhoto();
        closePopUp();
    }

    async function addPhoto(){
        fetch("http://localhost:3000/photos", {
            method: 'POST',
            body: JSON.stringify(photo),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(response=>{
            if(response.ok) {
            increasePhotoId();
            const updateData = [...photosArr,photo];
            !hasMore && setPhotosArr(updateData);
            localStorage.setItem(`album${albumId}Photos`, JSON.stringify({ user: currentUser.id, data: updateData }))
            updateCacheFrequencies(`album${albumId}Photos`);
        }
        })
        .catch(error =>console.error(error));
    }

    function increasePhotoId() {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ "photoId": Number(photo.id) + 1 }),
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
            .catch(err => console.error(err));
        return id;
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

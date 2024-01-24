import React, { useContext } from "react";
import { cacheContext, userContext } from "../../App";

const UpdatePhoto = (props) => {
  const { photo, setInEditing, setPhotosArr } = props;
  const {currentUser, setCurrentUser} = useContext(userContext);
  const {cacheGet, updateCacheFrequencies} = useContext(cacheContext);
  async function handlePhotoUpdate(event) {
    event.preventDefault();
    const updatedTitle = event.target.title.value;

    fetch(`http://localhost:3000/photos/${photo.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: updatedTitle }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(response => {
        if (response.ok) {
          setInEditing(-1);
          let updateData;
          setPhotosArr(prev => {
            updateData = prev.map(el => (el.id === photo.id ? { ...photo, title: updatedTitle } : el))
            return updateData;
          });
          localStorage.setItem(`album${photo.albumId}Photos`, JSON.stringify({ user: currentUser.id, data: updateData }));
          updateCacheFrequencies(`album${photo.albumId}Photos`)
        }
      })
      .catch(error =>
        console.error(error));
  }

  return (
    <>
      <form onSubmit={(e) => handlePhotoUpdate(e)}>
        <img src={photo.thumbnailUrl}></img>
        <div><input type="text" name="title" defaultValue={photo.title} /></div>
        <button type="submit">Update</button>
      </form>
    </>
  );
};

export default UpdatePhoto;

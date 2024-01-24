import React from "react";

const UpdatePhoto = (props) => {
  const { photo, setInEditing, photosArr, setPhotosArr } = props;

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
      .then(response=>{
      if (response.ok) {
        setInEditing(-1);
        let updateData;
        setPhotosArr(prev => {
          updateData = prev.map(el => (el.id === photo.id ? { ...photo, title: updatedTitle } : el))
          return updateData;
        });
        localStorage.setItem("photos", JSON.stringify({ user: currentUser.id, data: updateData }));
        updateCacheFrequencies("photos")
      } })
    .catch (error=>
      console.error(error));
    }

  return (
    <>
      <image src={photo.thumbnailUrl}></image>
      <form onSubmit={(e) => handlePhotoUpdate(e)}>
        <input type="text" name="title" defaultValue={photo.title} />
        <button type="submit">Update</button>
      </form>
    </>
  );
};

export default UpdatePhoto;

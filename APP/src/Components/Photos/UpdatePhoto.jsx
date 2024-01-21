import { useState } from "react";
import { useLocation } from "react-router-dom";

const UpdatePhoto = (props) => {
  const { photo, setInEditing, setPhotosArr } = props;

  async function handlePhotoUpdate(event) {
    event.preventDefault();
    photo.title = event.target.title.value;
    fetch(`http://localhost:3000/photos/${photo.id}`, {
      method: 'PATCH',
      title: JSON.stringify({title: photo.title,}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(response =>{
        if(response.ok)
        {
          setInEditing(-1);
          setPhotosArr(prevArr=>prevArr.map(el=>el.id===photo.id?photo:el));
        }
        else{
          console.error("failed to update comment");
        }
      })
  
      .catch(err => console.error(err))

  }

  return (
    <>
      <form onSubmit={(e) => handlePhotoUpdate(e)}>
        <input type="text" name="title" defaultValue={photo.title} />
        <input type="submit" value="update"></input>
      </form>
    </>
  );
}
export default UpdatePhoto

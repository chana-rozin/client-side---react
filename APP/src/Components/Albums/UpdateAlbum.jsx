import { useState } from "react";
import { useLocation } from "react-router-dom";

const UpdateAlbum = (props) => {
  const { album, setInEditing, setMyAlbums } = props;
  async function handleAlbumUpdate(event) {
    event.preventDefault();
    album.title = event.target.title.value;
    fetch(`http://localhost:3000/albums/${album.id}`, {
      method: 'PATCH',
      body: JSON.stringify({title: album.title,}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(response =>{
        if(response.ok)
        {
          setInEditing(-1);
          setMyAlbums(prevArr=>prevArr.map(el=>el.id===album.id?album:el));
        }
        else{
          console.error("failed to update post");
        }
      })
  
      .catch(err => console.error(err))

  }

  return (
    <>
      <form onSubmit={(e) => handleAlbumUpdate(e)}>
        <input type="text" name="title" defaultValue={album.title} />
        <input type="submit" value="update"></input>
      </form>
    </>
  );
}
export default UpdateAlbum

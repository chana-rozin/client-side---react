import { useState } from "react";
import { useLocation } from "react-router-dom";

const UpdatePost = (props) => {
  const { post, setInEditing, setAllData } = props;

  async function handlePostUpdate(event) {
    event.preventDefault();
    post.title = event.target.title.value;
    post.body = event.target.body.value;
    fetch(`http://localhost:3000/posts/${post.id}`, {
      method: 'PATCH',
      body: JSON.stringify({title: post.title,
                            body: post.body,}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(response =>{
        if(response.ok)
        {
          setInEditing(-1);
          setAllData(prevArr=>prevArr.map(el=>el.id===post.id?post:el));
        }
        else{
          console.error("failed to update post");
        }
      })
  
      .catch(err => console.error(err))

  }

  return (
    <>
      <form onSubmit={(e) => handlePostUpdate(e)}>
        <input type="text" name="title" defaultValue={post.title} ></input>
        <span><input type="text" name="body" defaultValue={post.body} /></span>
        <input type="submit" value="update"></input>
      </form>
    </>
  );
}
export default UpdatePost

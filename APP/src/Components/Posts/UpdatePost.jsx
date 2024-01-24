import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { userContext } from "../../App";
import { cacheContext } from "../../App";

const UpdatePost = (props) => {
  const { post, setInEditing, setPostsArr } = props;
  const { cacheGet, updateCacheFrequencies } = useContext(cacheContext);
  const { currentUser, setCurrentUser } = useContext(userContext)
  async function handlePostUpdate(event) {
    event.preventDefault();
    post.title = event.target.title.value;
    post.body = event.target.body.value;
    fetch(`http://localhost:3000/posts/${post.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: post.title,
        body: post.body,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(response => {
        if (response.ok) {
          let updateData;
          setInEditing(-1);
          setPostsArr(prevArr => {
            updateData = prevArr.map(el => el.id === post.id ? post : el);
            return updateData;
          });
          localStorage.setItem("posts", JSON.stringify({ user: currentUser.id, data: updateData }))
          updateCacheFrequencies("posts");
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

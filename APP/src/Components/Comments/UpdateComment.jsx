import { useState } from "react";
import { useLocation } from "react-router-dom";

const UpdateComment = (props) => {
  const { comment, setInEditing, setCommentsData } = props;

  async function handleCommentUpdate(event) {
    event.preventDefault();
    comment.body = event.target.body.value;
    fetch(`http://localhost:3000/comments/${comment.id}`, {
      method: 'PATCH',
      body: JSON.stringify({body: post.body,}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(response =>{
        if(response.ok)
        {
          setInEditing(-1);
          setCommentsData(prevArr=>prevArr.map(el=>el.id===comment.id?comment:el));
        }
        else{
          console.error("failed to update post");
        }
      })
  
      .catch(err => console.error(err))

  }

  return (
    <>
      <form onSubmit={(e) => handleCommentUpdate(e)}>
        <input type="text" name="body" defaultValue={comment.body} />
        <input type="submit" value="update"></input>
      </form>
    </>
  );
}
export default UpdateComment

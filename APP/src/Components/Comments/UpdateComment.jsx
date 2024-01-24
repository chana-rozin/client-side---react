import React from "react";

const UpdateComment = (props) => {
  const { comment, setInEditing, commentsArr,setCommentsArr } = props;

  async function handleCommentUpdate(event) {
    event.preventDefault();

    const updatedBody = event.target.body.value;

    try {
      const response = await fetch(`http://localhost:3000/comments/${comment.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ body: updatedBody }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response.ok) {
        setInEditing(-1);
        const updateData=commentsArr.map(el => (el.id === comment.id ? { ...comment, body: updatedBody } : el));
        setCommentsArr(updateData);
        localStorage.setItem("comments", JSON.stringify({user:currentUser.id,data:updateData}));
        updateCacheFrequencies("comments")
      } else {
        console.error("Failed to update comment");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <form onSubmit={(e) => handleCommentUpdate(e)}>
        <input type="text" name="body" defaultValue={comment.body} />
        <input type="submit" value="Update" />
      </form>
    </>
  );
};

export default UpdateComment;

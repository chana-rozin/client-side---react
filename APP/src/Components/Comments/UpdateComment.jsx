import React, { useContext } from "react";
import { cacheContext, userContext } from "../../App";

const UpdateComment = (props) => {
    const { comment, setInEditing, commentsArr, setCommentsArr } = props;
    const { currentUser, setCurrentUser } = useContext(userContext);
    const { cacheGet, updateCacheFrequencies } = useContext(cacheContext);

    async function handleCommentUpdate(event) {
        event.preventDefault();

        const updatedBody = event.target.body.value;

        fetch(`http://localhost:3000/comments/${comment.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ body: updatedBody }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(response => {
                if (response.ok) {
                    setInEditing(-1);
                    let updateData;
                    setCommentsArr(prev => {
                        updateData = prev.map(el => (el.id === comment.id ? { ...comment, body: updatedBody } : el));
                        return updateData;
                    });
                    localStorage.setItem("comments", JSON.stringify({ user: currentUser.id, data: updateData }));
                    updateCacheFrequencies("comments")
                }
            })
            .catch((error) =>
                console.error(error));
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

import React, { useContext} from "react";
import { userContext } from "../../App";
import { cacheContext } from "../../App";

const AddComment = (props) => {
    const {postId, setCommentsArr, closePopUp} = props;
    const {currentUser} = useContext(userContext);
    const {updateCacheFrequencies } = useContext(cacheContext);

    const comment = {
        postId: postId,
        id: "",
        name: "",
        email: currentUser.email,
        body: "",
    };

    async function handleAddBtn(event) {
        event.preventDefault();
        comment.name = event.target.name.value,
        comment.email = event.target.email.value,
        comment.body = event.target.body.value,
        comment.id = await getCommentId(),
        addComment();
        closePopUp();
    }

    async function addComment() {
        await fetch("http://localhost:3000/comments", {
            method: 'POST',
            body: JSON.stringify(comment),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((respons) => {
                if (respons.ok) {
                    increaseCommentId();
                    let updateData;
                    setCommentsArr((prevArr) => {
                        updateData = [...prevArr, comment];
                        return updateData;
                    });
                    localStorage.setItem("comments", JSON.stringify({ user: currentUser.id, data: updateData }))
                    updateCacheFrequencies("comments");
                }
            })
            .catch((error) => console.error(error));
    }

    function increaseCommentId() {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ commentId: Number(comment.id) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .catch((err) => console.error(err));
    }

    async function getCommentId() {
        const id = await fetch("http://localhost:3000/config/1")
            .then((result) => result.json())
            .then((json) => json.commentId.toString())
            .catch(err => console.error(err));
        return id;
    }

    return (
        <>
            <div className="container">
                <p>Add your comment:</p>
                <form onSubmit={handleAddBtn}>
                    <input placeholder="Name" type="text" name="name" required></input>
                    <textarea name="body" placeholder="Your text here" required></textarea>
                    <input type="submit" value="Add"></input>
                </form>
            </div>
        </>
    );
};

export default AddComment;

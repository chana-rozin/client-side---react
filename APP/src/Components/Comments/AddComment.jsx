import { useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { userContext } from "../../App";
import { cacheContext } from "../../App";

const AddComment = (props) => {
    const { postId, setCommentsArr, closePopUp } = props;
    const { currentUser } = useContext(userContext);
    const {cacheGet,updateCacheFrequencies} = useContext(cacheContext);

    const navigate = useNavigate();

    const defaultComment = {
        postId: postId,
        id: "",
        name: "",
        email: currentUser.email,
        body: "",
    };

    const [comment, setComment] = useState({ ...defaultComment });
    const [errMessage, setErrMessage] = useState("");

    async function handleAddBtn(event) {
        event.preventDefault();
        const newComment = {
            ...comment,
            name: event.target.name.value,
            body: event.target.body.value,
            id: await getCommentId(),
        };
        setComment(newComment);
        addComment(newComment);
        closePopUp();
    }

    async function addComment(newComment) {
        try {
            const response = await fetch("http://localhost:3000/comments", {
                method: 'POST',
                body: JSON.stringify(newComment),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (response.ok) {
                increaseCommentId();
                let updateData;
                setCommentsArr((prevArr) => {updateData=[...prevArr, newComment];
                    return updateData;});
                localStorage.setItem("comments", JSON.stringify({user:currentUser.id,data:updateData}))
                updateCacheFrequencies("comments");
            } else {
                setErrMessage("500 something get wrong:( try later.");
            }
        } catch (error) {
            console.error(error);
        }
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
        try {
            const id = await fetch("http://localhost:3000/config/1")
                .then((result) => result.json())
                .then((json) => json.commentId.toString());
            return id;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="container">
                <p>Add your comment:</p>
                <form onSubmit={handleAddBtn}>
                    <input
                        placeholder="Name"
                        type="text"
                        name="name"
                        required
                    ></input>
                    <textarea name="body" placeholder="Your text here" required></textarea>
                    <input type="submit" value="Add"></input>
                </form>
            </div>
        </>
    );
};

export default AddComment;

import React, { useContext} from "react";
import { userContext } from "../../App";
import { cacheContext } from "../../App";

const AddPost = (props) => {

    const {setPostsArr, closePopUp} = props;
    const { currentUser} = useContext(userContext);
    const {updateCacheFrequencies } = useContext(cacheContext);
    const userId = currentUser.id;

    const post = {
        "userId": "0",
        "id": "0",
        "title": "",
        "body": ""
    }

    async function handleAddBtn(event) {
        event.preventDefault();
        post.userId = userId;
        post.title = event.target.title.value;
        post.body = event.target.body.value;
        post.id = await getPostId();
        addPost();
        closePopUp();
    }

    async function addPost() {
        await fetch("http://localhost:3000/posts", {
            method: 'POST',
            body: JSON.stringify(post),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => {
            if (response.ok) {
                let updateData;
                increasePostId();
                setPostsArr(prevArr => {updateData = [...prevArr, post];
                return updateData});
                localStorage.setItem("posts", JSON.stringify({ user: currentUser.id, data: updateData }))
            updateCacheFrequencies("photos");
            }
        })
        .catch ((error) => console.error(error))
    }

    function increasePostId() {
        fetch("http://localhost:3000/config/1", {
            method: 'PATCH',
            body: JSON.stringify({ "postId": (Number)(post.id) + 1 }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        .catch(err => console.error(err))
    }


    async function getPostId() {
        const id = await fetch("http://localhost:3000/config/1")
            .then(result => result.json())
            .then(json => json.postId.toString())
            .catch(error => console.error(error));
        return id;
    }

    return (
        <>
            <div className="container">
                <p>add your post:</p>
                <form onSubmit={handleAddBtn}>
                    <input placeholder="your post title:" type="text" name="title"></input>
                    <textarea name="body" placeholder="your post body:"></textarea>
                    <input type="submit" value="Add"></input>
                </form>
            </div>
        </>
    )
}


export default AddPost;
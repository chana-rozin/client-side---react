import React from "react";

const UpdatePhoto = (props) => {
    const { photo, setInEditing, setPhotosArr } = props;

    async function handlePhotoUpdate(event) {
        event.preventDefault();
        const updatedTitle = event.target.title.value;

        try {
            const response = await fetch(`http://localhost:3000/photos/${photo.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ title: updatedTitle }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });

            if (response.ok) {
                const updatedPhoto = { ...photo, title: updatedTitle };
                setInEditing(-1);
                setPhotosArr(prevArr => prevArr.map(el => (el.id === photo.id ? updatedPhoto : el)));
            } else {
                console.error("Failed to update photo");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <form onSubmit={(e) => handlePhotoUpdate(e)}>
                <input type="text" name="title" defaultValue={photo.title} />
                <button type="submit">Update</button>
            </form>
        </>
    );
};

export default UpdatePhoto;

// write your code here
// src/index.js
const baseURL = 'http://localhost:3000';
document.addEventListener('DOMContentLoaded', () => {
    const image=document.getElementById(`card-image`);
    fetchImageData(baseURL + '/images');
});

    // Function to fetch image data and initialize the page
const fetchImageData = () => {
        fetch(`${baseURL}/images/1`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(imageData => {
                updateImage(imageData);
                setupLikeButton(imageData.id);
            })
            .catch(error => {
                console.error('Error fetching image data:', error);
            });
};

    // Function to update the image details on the page
const updateImage = (imageData) => {
        document.getElementById('imageTitle').textContent = imageData.title;
        document.getElementById('image').src = `${baseURL}/${imageData.image}`;
        document.getElementById('likeCount').textContent = imageData.likes;
};

    // Function to setup the like button click event
const setupLikeButton = (imageId) => {
        const likeButton = document.getElementById('likeButton');

        likeButton.addEventListener('click', () => {
            fetch(`${baseURL}/images/${imageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ incrementLikes: true })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedImageData => {
                document.getElementById('likeCount').textContent = updatedImageData.likes;
            })
            .catch(error => {
                console.error('Error updating likes:', error);
            });
        });
    };

    // Initialize the page
    fetchImageData();

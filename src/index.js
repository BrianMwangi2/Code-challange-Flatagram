

const baseURL = 'http://localhost:3000'; // Update this to match your server URL

document.addEventListener('DOMContentLoaded', () => {
    fetchImageData();
    setupEventListeners();
});

// making imageData a variable 
let imageData = null;
// making fetch A FUnction
function fetchImageData() {
    fetch(`${baseURL}/images`)
        .then(response => { // A promise to the fetch 
            if (!response.ok) {
                throw new Error('Failed to fetch image data');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                imageData = data[0]; // Assuming you want to update the first image
                updateImage(imageData);
                displayComments(imageData.comments);
            } else {
                throw new Error('No image data found');
            }
        })
        .catch(error => {
            console.error('Error fetching image data:', error.message);// incase of an error the catch will be able to depict the error
        });
}
// function to update the image with the variable image data as a param
function updateImage(imageData) {
    const imageElement = document.getElementById('card-image');
    const titleElement = document.getElementById('card-title');
    const likeCountElement = document.getElementById('like-count');

    titleElement.textContent = imageData.title;
   //imageElement.src = `http://localhost:3000/${imageData.image}`;// Theres a problem here !
    likeCountElement.textContent = `${imageData.likes} likes`;
}
// function to display comments  on page load and when adding a comment
function displayComments(comments) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    if (Array.isArray(comments)) { // adding an array condition 
        comments.forEach(comment => {
            const li = document.createElement('li');
            li.textContent = comment.content;
            commentsList.appendChild(li);
        });
    } else {
        console.warn('Comments data is missing or invalid:', comments);
    }
}
// adding event listeners for the like button and also a function which is click
function setupEventListeners() {
    const likeButton = document.getElementById('like-button');
    likeButton.addEventListener('click', () => {
        if (imageData) {
            imageData.likes++;
            updateImage(imageData);
            updateImageOnServer(imageData.id, { likes: imageData.likes });
        }
    });
}
// This function us to  add a new image to the server and then display it in the browser
function updateImageOnServer(imageId, updatedData) {
    fetch(`${baseURL}/images/${imageId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update image on server');
        }
        return response.json();
    })
    .then(data => {
        console.log('Image updated successfully on server:', data);
    })
    .catch(error => {
        console.error('Error updating image on server:', error.message);
    });
}
fetchImageData();
updateImage();
displayComments();
setupEventListeners();
updateImageOnServer();
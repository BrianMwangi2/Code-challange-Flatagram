

const baseURL = 'http://localhost:3000'; // Update this to match your server URL

document.addEventListener('DOMContentLoaded', () => {
    fetchImageData();
    setupEventListeners();
});

// making imageData a variable 
let imageData = null;
// making fetch A FUnction
function fetchImageData() {
    fetch(`http://localhost:3000/images`)
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
            } else {
                throw new Error('No image data found');
            }
        })
        .catch(error => {
            console.error('Error fetching image data:', error.message);// incase of an error the catch will be able to depict the error
        });
    
}
function fetchComments() {
    fetch(`http://localhost:3000/comments`)
    .then(response => { // A promise to the fetch 
        if (!response.ok) {
            throw new Error('Failed to fetch image data');
        }
        return response.json();
    })
    .then((data) =>((data).forEach((comment)=>{displayComments(comment)})))
  
    
}
fetchComments();

// function to update the image with the variable image data as a param
function updateImage(imageData) {
    const imageElement = document.getElementById('card-image');
    const titleElement = document.getElementById('card-title');
    const likeCountElement = document.getElementById('like-count');

    titleElement.textContent = imageData.title;
   imageElement.src = `${imageData.image}`;// Theres a problem here !
    likeCountElement.textContent = `${imageData.likes} likes`;
}
// function to display comments  on page load and when adding a comment
function displayComments(comments) {
    const commentsList = document.getElementById('comments-list');
    let list=document.createElement('li')
    list.innerHTML = `<li class="commentList">${comments.content}<li>`;
    commentsList.appendChild(list);

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
// adding a comment 
document.getElementById(`comment-form`).addEventListener("submit",(event)=>{
    event.preventDefault();
    let newComment={
        content:event.target.comment.value,
        imageId:1
    }
    displayComments(newComment)
})
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
};

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";

fetch('https://us-central1-like-button-88f77.cloudfunctions.net/getFirebaseConfig') 
  .then(response => response.json()) 
  .then(config => {
    // console.log("Firebase config fetched:"); // for debugging
    firebase.initializeApp(config);
    const db = firebase.firestore(firebase.app(), "commenting");
    // console.log("Firebase initialized, Firestore instance:", db); // for debugging
    

    // Get post ID
    const postId = document.getElementById("post-data").dataset.postId;
    // console.log("Post ID:", postId); // For debugging

    // Get comments container from HTML
    const commentsContainer = document.getElementById("comments-container");

    // Password Toggle
    /* document.getElementById("toggle-password").addEventListener("change", function () {
    const passwordField = document.getElementById("password");
    passwordField.type = this.checked ? "text" : "password";
    }); */
    const passwordField = document.getElementById("password");
    const togglePassword = document.getElementById("toggle-password");

    togglePassword.addEventListener("change", () => {
        passwordField.type = togglePassword.checked ? "text" : "password";
    });



    // Submit comment
    document.getElementById("comment").addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const name = document.getElementById("name").value.trim();
        //const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        const password = document.getElementById("password").value.trim();
        
        if (!name || !message || !password) {
        alert("All fields are required!");
        return;
        }
    
        const passwordHash = md5(password);
        const isSecret = document.getElementById("secret-comment").checked; // secret comment state

        try{
            // Sanitize the message before saving to Firestore
            const cleanMessage = DOMPurify.sanitize(message);
            await db.collection("comments").add({
                postId,
                name,
                //email,
                message: cleanMessage,
                passwordHash,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                isSecret
            });
            alert("Comment posted!");
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("An error occurred while posting your comment. Please try again later.");
        }
        
        document.getElementById("comment").reset();
        loadComments();     
    });

    // Load comments
    async function loadComments() {
        commentsContainer.innerHTML = "";
    
        const querySnapshot = await db.collection("comments")
        .where("postId", "==", postId)
        .orderBy("timestamp", "desc")
        .get();
    
        querySnapshot.forEach((doc) => {
            const { name, message, timestamp, isSecret } = doc.data();
            const date = timestamp ? timestamp.toDate().toLocaleString() : "Just now";
    
            /* let commentHTML = `
                <div class="comment" data-id="${doc.id}">
                <p class="comment-meta"><strong>${name}</strong> - <small>${date}</small></p>
                <div class="comment-message">${message}</div>
                <button class="edit-comment">Edit</button>
                <button class="delete-comment">Delete</button>
            </div>
            `; */
            let commentHTML = `
                <div class="comment" data-id="${doc.id}">
                    <p class="comment-meta"><strong>${name}</strong> - <small>${date}</small></p>
            `;

            if (isSecret) {
                commentHTML += `
                    <div class="comment-message">(This comment is secret. Enter password to view.)</div>
                    <button class="reveal-comment">Reveal</button> 
                </div>
                `;
            } else {
                commentHTML += `
                    <div class="comment-message">${message}</div>
                    <button class="edit-comment">Edit</button>
                    <button class="delete-comment">Delete</button>
                </div>
                `;
            }

        commentsContainer.innerHTML += commentHTML;
    });
    }

    // Event Delegation for Reveal, Edit, and Delete
    commentsContainer.addEventListener("click", async (e) => {
        if (e.target.classList.contains("reveal-comment")) {
            const commentDiv = e.target.closest(".comment");
            const commentId = commentDiv.dataset.id;
            const revealButton = e.target; // The clicked element IS the button

            //console.log("reveal-button is clicked"); // For Debugging

            const password = prompt("Enter password for this secret comment:");
            if (!password) return;

            const passwordHash = md5(password);
            const commentRef = db.collection("comments").doc(commentId);
            const commentDoc = await commentRef.get();

            if (!commentDoc.exists || commentDoc.data().passwordHash !== passwordHash) {
                alert("Incorrect Password!");
                return;
            }

            
             const messageDiv = commentDiv.querySelector(".comment-message");
            if (messageDiv) {
                messageDiv.textContent = commentDoc.data().message; // Access message from the document data
                revealButton.remove();

                const editButton = document.createElement('button');
                editButton.className = 'edit-comment';
                editButton.textContent = 'Edit';
                /* editButton.addEventListener('click', handleEdit); */

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-comment';
                deleteButton.textContent = 'Delete';
                /* deleteButton.addEventListener('click', handleDelete); */
                
                commentDiv.appendChild(editButton);
                commentDiv.appendChild(deleteButton); 
            } 
        } else if (e.target.classList.contains("edit-comment")) {
            handleEdit(e); // Call handleEdit
        } else if (e.target.classList.contains("delete-comment")) {
            handleDelete(e); // Call handleDelete
        } 
    });
        
    // Edit Comment
    async function handleEdit(e) {
        const commentDiv = e.target.closest(".comment");
        const commentId = commentDiv.dataset.id;
        const newMessage = prompt("Enter new message:");
    
        if (!newMessage) return;

        const commentRef = db.collection("comments").doc(commentId);
        const commentDoc = await commentRef.get();
    
        if (!commentDoc.exists) { // || commentDoc.data().passwordHash !== passwordHash
        alert("Comment doesn't exist.");
        return;
        }
        // Check if the comment is secret
        if (commentDoc.data().isSecret) {
            const cleanNewMessage = DOMPurify.sanitize(newMessage);
            await commentRef.update({ message: cleanNewMessage });
            loadComments();
            return;
        } else {

        const password = prompt("Enter your password:");
        const passwordHash = md5(password);

        if (!password) return;
        if (!commentDoc.exists || commentDoc.data().passwordHash !== passwordHash) { // 
            alert("Incorrect Password.");
            return;
            }

        await commentRef.update({ message: newMessage });
        alert("Comment changed!");
        loadComments(); 
        }
    }
    
    // Delete Comment
    async function handleDelete(e) {
        const commentDiv = e.target.closest(".comment");
        const commentId = commentDiv.dataset.id;
    
        const password = prompt("Enter your password to delete:");
        if (!password) return;
    
        const passwordHash = md5(password);  
    
        const commentRef = db.collection("comments").doc(commentId);
        const commentDoc = await commentRef.get();
    
        if (!commentDoc.exists || commentDoc.data().passwordHash !== passwordHash) {
        alert("Incorrect Password!");
        return;
        }
    
        if (confirm("Are you sure you want to delete this comment?")) {
        await commentRef.delete();
        alert("Comment deleted!");
        loadComments();
        }
    }
    
    // Load comments when the page loads
    //document.addEventListener("DOMContentLoaded", loadComments);
    loadComments();


        
    // ... rest of your Firebase code
  })
  .catch(error => {
    console.error('Error fetching Firebase config:', error);
  });
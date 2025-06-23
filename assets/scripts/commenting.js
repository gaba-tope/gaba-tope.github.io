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

    // Secret Comment Toggle Feature
        let isSecret = false;
        const secretToggle = document.getElementById("secret-toggle");
        const lockIcon = document.getElementById("lock-icon");
        const secretMessage = document.getElementById("secret-message");

        //const isSecret = document.getElementById("secret-comment").checked; // secret comment state using checkbox

        secretToggle.addEventListener("click", async (e) => {
            isSecret = !isSecret;
            //console.log("비밀글 토글 눌러짐");
            if (isSecret) {
                //console.log("비밀글 설정됨.");
                // Change to locked (red) icon
                lockIcon.innerHTML = `
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="#ff4444"></rect>
                    <circle cx="12" cy="16" r="1" fill="white"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#ff4444"></path>
                `;
                lockIcon.style.color = '#ff4444';
                secretMessage.style.display = 'inline';
            } else {
                // Change to unlocked (default) icon
                lockIcon.innerHTML = `
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                `;
                lockIcon.style.color = 'currentColor';
                secretMessage.style.display = 'none';
            }
        });

    // Submit comment
    document.getElementById("comment").addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const name = document.getElementById("name").value.trim();
        //const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        const password = document.getElementById("password").value.trim();
        
        if (!name || !message || !password) {
        alert("All fields are required! 이름, 비밀번호, 댓글이 모두 있어야 합니다.");
        return;
        }
    
        const passwordHash = md5(password);

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
            alert("Comment posted! 댓글이 등록되었습니다!");
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
        .get();
        
        // Align Posts by Client
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data()});
        });

        // Align by Ascending Order
        comments.sort((a, b) => {
        if (!a.timestamp) return 1;
        if (!b.timestamp) return -1;
        return a.timestamp.toMillis() - b.timestamp.toMillis();
        });

        // 정렬된 댓글들을 화면에 표시
        comments.forEach((comment) => {
        const { name, message, timestamp, isSecret } = comment;
        const date = timestamp ? timestamp.toDate().toLocaleString() : "Just now";
        
        // 비밀글이면 자물쇠 아이콘 추가
        const lockIconSymbol = isSecret ? "🔒" : "";

        let commentHTML = `
            <div class="comment" data-id="${comment.id}">
                <p class="comment-meta"><strong>${lockIconSymbol}${name}</strong> - <small>${date}</small></p>
        `;

        if (isSecret) {
            commentHTML += `
                <div class="comment-message">(Enter password to view the secret comment.)<br>(비밀글을 열람하려면 비밀번호를 입력하세요.)</div>
                <button class="reveal-comment">Reveal (보기)</button> 
            </div>
            `;
        } else {
            commentHTML += `
                <div class="comment-message">${message}</div>
                <button class="edit-comment">Edit (수정)</button>
                <button class="delete-comment">Delete (삭제)</button>
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

            const password = prompt("Enter your password. 비밀번호를 입력하세요.");
            if (!password) return;

            const passwordHash = md5(password);
            const commentRef = db.collection("comments").doc(commentId);
            const commentDoc = await commentRef.get();

            if (!commentDoc.exists || commentDoc.data().passwordHash !== passwordHash) {
                alert("Incorrect Password! 잘못된 비밀번호입니다!");
                return;
            }

            
             const messageDiv = commentDiv.querySelector(".comment-message");
            if (messageDiv) {
                messageDiv.textContent = commentDoc.data().message; // Access message from the document data
                revealButton.remove();

                const editButton = document.createElement('button');
                editButton.className = 'edit-comment';
                editButton.textContent = 'Edit (수정)';
                /* editButton.addEventListener('click', handleEdit); */

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-comment';
                deleteButton.textContent = 'Delete (삭제)';
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

        const password = prompt("Enter your password. 비밀번호를 입력하세요.");
        const passwordHash = md5(password);

        if (!password) return;
        if (!commentDoc.exists || commentDoc.data().passwordHash !== passwordHash) { // 
            alert("Incorrect Password.");
            return;
            }

        await commentRef.update({ message: newMessage });
        alert("Comment changed! 댓글이 수정되었습니다!");
        loadComments(); 
        }
    }
    
    // Delete Comment
    async function handleDelete(e) {
        const commentDiv = e.target.closest(".comment");
        const commentId = commentDiv.dataset.id;
    
        const password = prompt("Enter your password to delete.\n댓글을 삭제하려면 비밀번호를 입력하세요");
        if (!password) return;
    
        const passwordHash = md5(password);  
    
        const commentRef = db.collection("comments").doc(commentId);
        const commentDoc = await commentRef.get();
    
        if (!commentDoc.exists || commentDoc.data().passwordHash !== passwordHash) {
        alert("Incorrect Password! 잘못된 비밀번호입니다!");
        return;
        }
    
        if (confirm("Are you sure you want to delete this comment?\n정말로 댓글을 삭제하시겠습니까?")) {
        await commentRef.delete();
        alert("Comment deleted! 댓글이 삭제되었습니다!");
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
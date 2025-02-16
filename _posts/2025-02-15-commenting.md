---
title: Making Comment Box in Jekyll Blog
tags: [jekyll]
categories: work
cover: /files/cover/2025-02-15-commenting.png
id: 2025-02-15-commenting
---

Comment Box in a Jekyll blog was created using Firebase, without any external plug-in! You don't need to log in Github to add a comment to a post :)
<!--more-->

There are several options for Jekyll Blog Comment box, such as [giscus](https://giscus.app/){:target='_blank'}, [disqus](https://disqus.com/){:target='_blank'}, [utterances](https://utteranc.es/){:target='_blank'}, and so on. They are convenient to use, but visitors need their Github account to comment on the post. Plus, it seemed that commenting services like Disqus are [blocked in some countries](https://www.geeksforgeeks.org/websites-blocked-in-china/){:target='_blank'}.

Since some viewers may not have a GitHub account to use the Giscus comment service for interaction, I decided to make my own comment box using [Firebase](https://firebase.google.com/){:target='_blank'}.

## Plan

1. Use the existing Firebase project that I made in [Like Button Project]({% post_url 2025-01-30-like-button %}){:target='_blank'}. I will use the same Firebase function to retrieve Firebase configuration information along with the unique post ID.
2. Viewer does not need to log-in any kind of service. Just name and password are needed to comment on the post.
3. The comment can be modified and deleted by the writer of the comment using the password.
4. Hashed password is saved in the Firestore database, so that raw password can only be known to the writer of the comment. MD5, pbkdf2, Argon2, etc may be used.
5. Secret comment feature so that only I and the writer of the comment can see the comment. If one want their comment shown only to me, they would just click the checkbox for that.
6. Measures to prevent [Cross-site Scripting (XSS)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS){:target='_blank'} attack. 

## How-to

### 1. Firebase Setting

Set up your Firebase project as I've explained in [Like Button Project Section 1 (Firebase settings)]({% post_url 2025-01-30-like-button %}#1-firebase-settings){:target='_blank'}. Create your Firebase account, log in, create Firebase project. 
I used the existing database I made for Like Button Project. It'll have two collection, one for like button and another for commenting service.

Everything is the same including configuration information stored as JSON file.

### 2. Post Setting

Also same as [Like Button Project Section 2 (Post setting)]({% post_url 2025-01-30-like-button %}#2-post-setting){:target='_blank'}. I utilized the existing unique id of YAML header of each post.

### 3. Front-end Setting

#### 3-1. Create HTML for the Comment Box.

The HTML for the comment box is created and saved as `_includes/commenting.html`.

<details>
<summary>Click to see the full HTML script</summary>

{% highlight html%}
{% raw %}
<div id="post-data" data-post-id="{{ page.id }}"></div>

<link rel="stylesheet" href="/assets/css/commenting.css">

<h3>Leave a comment</h3>

<form id="comment">
    <div class="input-row">
        <input type="text" id="name" placeholder="Name">
        <input type="password" id="password" placeholder="Password">
        <label class="switch">
            <input type="checkbox" id="toggle-password">
            <span class="slider round"></span>
        </label>
        <!-- <label><input type="checkbox" id="toggle-password">Show</label> -->
    </div>
    <label for="secret-comment">
        <input type="checkbox" id="secret-comment"> Secret Comment
    </label>

    <textarea id="message" placeholder="Message"></textarea>

  <input type="submit" value="Post Comment">
</form>

<div id="comments-container">
</div>

<!-- <script src="/assets/scripts/argon2-browser/dist/argon2.js"></script> -->
<script src="https://unpkg.com/dompurify@1.0.8/dist/purify.js"></script> <!--For Sanitizing HTML-->
<script src="https://unpkg.com/blueimp-md5@2.3.0/js/md5.min.js"></script> <!--For MD5 Hash Function for password-->
<!-- <script src="https://unpkg.com/showdown/dist/showdown.min.js"></script> --> <!--For markdown to HTML rendering-->
<script src="https://www.gstatic.com/firebasejs/11.2.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore-compat.js"></script>
<script type="module" src="/assets/scripts/commenting.js"></script>  <!--/scripts/customJS/fireBase.js-->
{% endraw %}
{% endhighlight %}
</details>

1. Retrieve page.id via liquid grammar.
2. Retrieve CSS file for styling from `/assets/css/commenting.css` which will be created in [section 3-2](#3-2-create-css-for-the-comment-box).
3. Make a form for comment submission. It will have textbox for name, password box for password, sliders to unmask the password, checkbox to make a comment secret, and submit button.
4. Import JavaScript files. 
    - `purify.js` is for sanitizing HTML. It is a necessary measure to protect clients from [Cross-site Scripting (XSS)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS){:target='_blank'} attack. 
    - `md5.min.js` is for retrieving hash value of password. Since oly the [MD5 hash](https://en.wikipedia.org/wiki/MD5){:target='_blank'} value is stored in Firestore database, even the owner of the database has no way to find out the password for the comment.
    - `firebase-app-compat.js` and `firebase-firestore-compat.js` are JavaScripts for FireBase.
    - `/assets/scripts/commenting.js` is the key JavaScript for my commenting feature.


#### 3-2. Create CSS for the Comment Box.

CSS for the comment box was created as `/assets/css/commenting.css`.

<details>
<summary>Click to see the full CSS.</summary>

{% highlight css%}
  /* ====== Form Styles ====== */
  form {
    border: 2px solid black;
    padding: 15px;
    width: 80%; /*500px*/
    background: white;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
  }
  
  /* Input Row: Name & Password */
  .input-row {
    display: flex;
    justify-content: space-between;
    align-items: left;
  }
  
  .input-row input {
    width: 40%;
    padding: 5px;
    font-style: italic;
    border: 1px solid black;
  }
  
  /* Password Toggle Checkbox */
  .input-row label {
    font-size: 14px;
    cursor: pointer;
  }
  
  /* Message Textarea */
  textarea {
    width: 100%;
    height: 100px;
    padding: 8px;
    font-style: italic;
    border: 1px solid black;
    resize: none;
  }
  
  /* Submit Button */
  input[type="submit"] {
    align-self: flex-start;
    padding: 8px 12px;
    border: 1px solid black;
    background-color: white;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s;
  }
  
  input[type="submit"]:hover {
    background-color: black;
    color: white;
  }
  
  /* Toggle Switch Styles */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.switch input { 
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #2196F3; /* Or your preferred color */
}

input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

  /* ====== Comment Section ====== */
  #comments-container {
    width: 500px;
    margin-top: 20px;
  }
  
  /* Individual Comment */
  .comment {
    border: 1px solid black;
    background: white;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .comment-meta {
    font-size: 14px;
    color: #666;
  }
  
  .comment-message {
    margin-top: 5px;
    margin-bottom: 2px;
    padding: 5px;
    border-radius: 5px;
    background: #f4f4f4;
  }
  
  /* Markdown Styling */
.comment-message h1,
.comment-message h2,
.comment-message h3 {
  margin-top: 10px;
  font-weight: bold;
}

.comment-message code {
  background: #f4f4f4;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: monospace;
}

.comment-message pre {
    background: #eee;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
  }
  
  .comment-message blockquote {
    border-left: 4px solid #3487FF;
    padding-left: 10px;
    color: #555;
    font-style: italic;
  }

  /* Edit & Delete Buttons */
  .comment button {
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: 0.3s;
    margin-right: 5px;
  }
  
  .comment .reveal-comment {
    background-color: #AA71F5;
    color: white;
  }
  
  .comment .reveal-comment:hover {
    background-color: #7C53B3;
  }

  .comment .edit-comment {
    background-color: #ffcc00;
  }
  
  .comment .edit-comment:hover {
    background-color: #e6b800;
  }
  
  .comment .delete-comment {
    background-color: #ff4d4d;
    color: white;
  }
  
  .comment .delete-comment:hover {
    background-color: #cc0000;
  }
  
  /* ====== Responsive Design ====== */
  @media (max-width: 550px) {
    form, #comments-container {
      width: 100%;
    }
  
    .input-row {
      flex-direction: column;
      gap: 5px;
    }
  
    .input-row input {
      width: 100%;
    }
  
    input[type="submit"] {
      width: 100%;
    }
  }
{% endhighlight %}
</details>

#### 3-3. Create Firebase Function.

I used the existing files that I created in [Like Button Project Section 3-3 (Create Firebase Function)]({% post_url 2025-01-30-like-button %}#3-3-create-firebase-function){:target='_blank'}. Refer to the post if you need to create a new one.

#### 3-4. Create JavaScript for the Comment Box.

Create `/assets/scripts/commenting.js`.

<details>
<summary>Click to see the full JavaScript.</summary>

{% highlight javascript%}
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

{% endhighlight %}
</details>

This is the **core functionality** of miy comment box. Below is the brief explanation of the code.

1. Initialize firebase.
    - `fetch('your function URL')` will fetch the Firebase function.
    - Then Firebase config will be assigned to `config`, as in `firebase.initializeApp(config);`.
2. Define Elements.
    - Define `db` as your Firestore database.
    - Define `postId` as the unique post ID of the post.
    - Define comment box form elements, such as `commentsContainer`, `passwordField`, `togglePassword`, and so on.
3. Feature: Submit comment
    - Define `name`, `message`, and `password` as input values submitted by the comment submission form.
    - If one of the name, message or password is missing, pop up an alert "All fields are required".
    - Define `passwordHash` as hash value of the input password using `md5()`.
    - Define `isSecret` to store whether the comment is secret or not.
    - Using `DOMPurify.sanitize()`, filter potential XSS attack within a comment and store it to `cleanMessage`.
    - Add `postId`, `name`, `cleanMessage`, `passwordHash`, `timestamp` and `isSecret` to Firestore database. 
    - Reset the comment submission form by `document.getElementById("comment").reset();` and load comments.
4. Function: loadComments()
    - Retrieve comment data from Firestore database of the post and order the comments by descending order of timestamp.
    - Add `name` and `date` to the `commentHTML`.
    - If the comment is secret, then show 'This comment is secret. Enter password to view.' and `reveal-comment` button.
    - If the comment isn't secret, then show `message`, `edit-comment` button and `delete-comment` button.
5. Event for Reveal, Edit, and Delete
    - When revealButton is clicked, prompt asking password appears. 
    - If the passwordHash of the input password is the same as the one stored in the Firestore Database, remove revealButton and show comments, editButton and deleteButton.
    - If  there is not revealButton, i.e. the comment is not secret, call `handleEdit();` and `handleDelete();` upon click event of editButton and deleteButton respectively.
6. Create functions handleEdit() and handleDelete()

#### 3-5. Embed HTML to your site.

Now, incorporate `commenting.html` to your site. I added the HTML to `_includes/article-footer.html`.

<details>
<summary> Click to see the full HTML script</summary>
{% highlight html%}
{% raw %}
<!----Commenting-->
{%- if page.comment -%}
<!--Comment Using Firebase-->
<div class="commenting"> {% include commenting.html %} </div>
{%- endif -%}
{% endraw %}
{% endhighlight%}
</details>

## Conclusion

Currently I'm thinking of replacting MD5 with other hashing algorithms that is more secure, such as Bcrypt. Still working on it.

It was exciting making this comment feature. Hope you also make your own comment box!

## Reference

- [Building a Jekyll Site – Part 3 of 3: Creating a Firebase-Backed Commenting System]( https://css-tricks.com/building-a-jekyll-site-part-3-of-3/){:target='_blank'} by Mike Neumegen.
- [Self-host comments in Jekyll, powered by Firebase real-time database](https://frankindev.com/2017/03/25/self-host-comments-in-jekyll-using-firebase-database/) {:target='_blank'} by Frank Lin (林宏).
- [DOMPurify README](https://github.com/cure53/DOMPurify){:target='_blank'}
- [XSS (mdm web docs)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/XSS){:target='_blank'}
- [Password Hashing and Storage Basics](https://markilott.medium.com/password-storage-basics-2aa9e1586f98){:target='_blank'} by Mark Ilott.
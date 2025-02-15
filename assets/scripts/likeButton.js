// Initialize Firebase (add your config)
//console.log("fireBase.js loaded"); // for debug
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js"; 

fetch('https://us-central1-like-button-88f77.cloudfunctions.net/getFirebaseConfig') 
  .then(response => response.json()) 
  .then(config => {
    // console.log("Firebase config fetched:"); // for debugging
    firebase.initializeApp(config);
    const db = firebase.firestore();
    // console.log("Firebase initialized, Firestore instance:", db); // for debugging
    
    // Get the post ID (replace with your Jekyll logic)
    const postData = document.getElementById('post-data');

    if (!postData) { // For debugging
      console.error("postData element not found!");
      return; // Stop execution if the element doesn't exist
    }

    const postId = postData.dataset.postId; // Get from data attribute
    //const postId = '{{ page.id }}'; // Example using a Jekyll front matter variable
    //console.log("Post ID:", postId); // For debug.
        
    // Get the like count element
    const likeCountElement = document.getElementById('like-count');
    // Get the like button element
    const likeButton = document.getElementById('like-button');
    // For Debug: check if the two elements are found.
    if (!likeCountElement) {
      console.error("likeCountElement not found!");
    } else {
      console.log("likeCountElement found.")
    }
    if (!likeButton) {
      console.error("likeButton not found!");
    } else {
      console.log("likeButton found.")
    }
  
    const postRef = db.collection('posts').doc(postId);

    // Get initial like count (important!)
    postRef.get().then((doc) => {
      if (doc.exists) {
      likeCountElement.textContent = doc.data().likeCount;
      } else {
      likeCountElement.textContent = 0; // Set to 0 if no likes yet
      }
      // console.log("Initial likeCount retrieved from doc.data"); // For debug
    }).catch((error) => {
        console.error("Error getting initial like count: ", error);
    });
    // Function to update the like count in the database
    function updateLikeCount(postId) {
      const db = firebase.firestore();
      const postRef = db.collection('posts').doc(postId);
      // console.log("postRef defined.");

      // Transaction to prevent race conditions (important!)
      db.runTransaction(async (transaction) => {
        const doc = await transaction.get(postRef);

        if (!doc.exists) {
          // If the document doesn't exist, create it with a likeCount of 1
          await transaction.set(postRef, { likeCount: 1 });
          return 1; // Return the new like count
        } else {
          const newLikeCount = doc.data().likeCount + 1;
          await transaction.update(postRef, { likeCount: newLikeCount });
          return newLikeCount; // Return the updated like count
        }
      })
      .then((newLikeCount) => {
        likeCountElement.textContent = newLikeCount; // Update the display
        likeButton.disabled = true; // Disable the button 
        // Store that the user has liked the post (e.g. in local storage)
        localStorage.setItem(`liked-${postId}`, 'true');

      })
      .catch((error) => {
        console.error("Error updating like count: ", error);
        // Handle errors (e.g., display a message to the user)
      });
    }
    // Function to check if the user has already liked the post
    function checkIfLiked(postId) {
      const hasLiked = localStorage.getItem(`liked-${postId}`);
      return hasLiked === 'true';
    }

    if (checkIfLiked(postId)) {
      // console.log("checkIfLiked is TRUE");
      likeButton.classList.add('is-active'); // Add 'is-active'class if already liked, s.t. button filled with red.
      likeButton.disabled = true; // Disable if already liked
      // console.log("is-active class added to likeButton.");
    }

    // Add the like button click listener
    likeButton.addEventListener('click', () => {
      // console.log("Button clicked"); // For Debug

      if (!likeButton.classList.contains('is-active')) {
        likeButton.classList.add('is-active'); // Add 'is-active' class immediately
        updateLikeCount(postId);
        // console.log("Post ID being Used", postId); // For Debug: verify postID is correct.
      } 
    // If you want to implement the unlike function, you must uncomment it and handle the unlike logic in your Firebase database
    // else {
    // likeButton.classList.remove('is-active'); // Remove 'is-active' class
    // }
          
    });
        
    // ... rest of your Firebase code
  })
  .catch(error => {
    console.error('Error fetching Firebase config:', error);
  });



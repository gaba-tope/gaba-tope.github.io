// Initialize Firebase (add your config)
const firebaseConfig = {
  apiKey: "AIzaSyB1VP4EcgeFbJkVMktFXa65NKT0svM_Zio",
  authDomain: "like-button-88f77.firebaseapp.com",
  projectId: "like-button-88f77",
  storageBucket: "like-button-88f77.firebasestorage.app",
  messagingSenderId: "317140125376",
  appId: "1:317140125376:web:52fde4ab2612b368740f25",
  measurementId: "G-WKJ3N84JF9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// On page load:
window.addEventListener('DOMContentLoaded', () => {
    
  // Function to update the like count in the database
  function updateLikeCount(postId) {
    const postRef = db.collection('posts').doc(postId);

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
  // Get the post ID (replace with your Jekyll logic)
  const postData = document.getElementById('post-data');
  const postId = postData.dataset.postId; // Get from data attribute
  //const postId = '{{ page.id }}'; // Example using a Jekyll front matter variable
  console.group("Initial postId on the page load:", postId); // For debug.
  
  // Get the like count element
  const likeCountElement = document.getElementById('like-count');

  // Get the like button element
  const likeButton = document.getElementById('like-button');

  if (checkIfLiked(postId)) {
      likeButton.classList.add('is-active'); // Add 'is-active'class if already liked, s.t. button filled with red.
      likeButton.disabled = true; // Disable if already liked
  } 

  // Get initial like count (important!)
  const postRef = db.collection('posts').doc(postId);
  postRef.get().then((doc) => {
      if (doc.exists) {
      likeCountElement.textContent = doc.data().likeCount;
      } else {
      likeCountElement.textContent = 0; // Set to 0 if no likes yet
      }
  }).catch((error) => {
      console.error("Error getting initial like count: ", error);
  });

  // Add the like button click listener
  likeButton.addEventListener('click', () => {
    if (!likeButton.classList.contains('is-active')) {
      likeButton.classList.add('is-active'); // Add 'is-active' class immediately
      updateLikeCount(postId);
      console.log("Button clicked"); // For Debug
      console.log("Post ID being Used", postId); // For Debug: verify postID is correct.
  } 
  // If you want to implement the unlike function, you must uncomment it and handle the unlike logic in your Firebase database
  // else {
  // likeButton.classList.remove('is-active'); // Remove 'is-active' class
  // }
        
        
        
    });

});

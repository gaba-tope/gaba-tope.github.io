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

// DOMContentLoaded wrapper - All DOM-related code goes here
window.addEventListener('DOMContentLoaded', () => {

    // 1. Get Post ID (from data attribute)
    const postData = document.getElementById('post-data');
    const postId = postData.dataset.postId;
    console.log("Post ID:", postId);

    // 2. Get elements (like button, count)
    const likeCountElement = document.getElementById('like-count');
    const likeButton = document.getElementById('like-button');

    // 3. Check if already liked (on page load)
    if (checkIfLiked(postId)) {
        likeButton.classList.add('is-active'); // Add 'is-active' class
        likeButton.disabled = true;
    }

    // 4. Get initial like count (on page load)
    const postRef = db.collection('posts').doc(postId);
    postRef.get().then((doc) => {
        if (doc.exists) {
            likeCountElement.textContent = doc.data().likeCount;
        } else {
            likeCountElement.textContent = 0;
        }
    }).catch((error) => {
        console.error("Error getting initial like count: ", error);
    });


    // 5. Like button click listener
    likeButton.addEventListener('click', () => {
        if (!likeButton.classList.contains('is-active')) {
            likeButton.classList.add('is-active'); // Add 'is-active' class immediately
            updateLikeCount(postId);
        } 
        // If you want to implement the unlike function, you must uncomment it and handle the unlike logic in your Firebase database
        // else {
        // likeButton.classList.remove('is-active'); // Remove 'is-active' class
        // }
    });

    // 6. Firebase update function
    function updateLikeCount(postId) {
        const postRef = db.collection('posts').doc(postId);

        db.runTransaction(async (transaction) => {
            const doc = await transaction.get(postRef);

            if (!doc.exists) {
                await transaction.set(postRef, { likeCount: 1 });
                return 1;
            } else {
                const newLikeCount = doc.data().likeCount + 1;
                await transaction.update(postRef, { likeCount: newLikeCount });
                return newLikeCount;
            }
        })
        .then((newLikeCount) => {
            likeCountElement.textContent = newLikeCount;
            likeButton.disabled = true; // Disable after successful like

        })
        .catch((error) => {
            console.error("Error updating like count: ", error);
            alert("Error updating like. Please try again.");
            likeButton.classList.remove('is-active'); // Remove 'is-active' class on error
            likeButton.disabled = false; // Re-enable the button
        });
    }

    // 7. checkIfLiked function
    function checkIfLiked(postId) {
        const hasLiked = localStorage.getItem(`liked-${postId}`);
        return hasLiked === 'true';
    }

}); // End of DOMContentLoaded
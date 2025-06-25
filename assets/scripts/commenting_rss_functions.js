// Configuration
const BLOG_CONFIG = {
    title: "Tope's Cytoplasm",
    baseUrl: "https://gaba-tope.github.io",
    description: "Latest comments on Tope's Cytoplasm",
    //adminEmail: "topaize3460@gmail.com" // For notifications
};

// Webhook URLs for notifications (optional)
const WEBHOOK_CONFIG = {
    discord: null, // "YOUR_DISCORD_WEBHOOK_URL"
    slack: null,   // "YOUR_SLACK_WEBHOOK_URL"
    email: null    // "YOUR_EMAIL_SERVICE_WEBHOOK"
};


// Generate RSS XML from comments array
function generateRSSXML(comments, siteInfo = BLOG_CONFIG) {
    const escapeXML = (str) => {
        if (!str) return '';
        return str.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const rssItems = comments.map(comment => {
        const pubDate = comment.timestamp ? comment.timestamp.toDate().toUTCString() : new Date().toUTCString();
        const isSecretText = comment.isSecret ? ' (Secret Comment)' : '';
        const postTitle = comment.postId || 'Unknown Post';
        const isAdminComment = comment.passwordHash === ADMIN_PASSWORD_HASH;
        const authorName = isAdminComment ? `👑 ${comment.name}` : comment.name;
        
        return `
        <item>
            <title>${escapeXML(authorName)} commented on "${escapeXML(postTitle)}"${isSecretText}</title>
            <description>${escapeXML(comment.isSecret ? '(Secret comment - content hidden)' : comment.message)}</description>
            <link>${siteInfo.baseUrl}${comment.postId}#comment-${comment.id}</link>
            <guid>${comment.id}</guid>
            <pubDate>${pubDate}</pubDate>
            <author>${escapeXML(authorName)}</author>
        </item>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
        <title>${escapeXML(siteInfo.title)} - Comments</title>
        <description>${escapeXML(siteInfo.description)}</description>
        <link>${siteInfo.baseUrl}</link>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <generator>Blog Comment System</generator>
        <language>en</language>
        <ttl>60</ttl>
        ${rssItems}
    </channel>
</rss>`;
}


// Generate RSS feed and save to browser storage or trigger download
async function generateCommentRSSFeed(db, postId = null) {
    try {
        let query = db.collection("comments");
        
        // If postId is provided, filter by specific post, otherwise get all comments
        if (postId) {
            query = query.where("postId", "==", postId);
        }
        
        const querySnapshot = await query
            .orderBy("timestamp", "desc")
            .limit(50)
            .get();

        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({
                id: doc.id,
                ...doc.data()
            });
        });

        const rssXML = generateRSSXML(comments);
        return rssXML;
        
    } catch (error) {
        console.error("Error generating RSS feed:", error);
        throw error;
    }
}


// Download RSS feed as file
function downloadRSSFeed(rssXML, filename = 'comments-feed.xml') {
    const blob = new Blob([rssXML], { type: 'application/rss+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Send notification when new comment is added
 */
// async function sendCommentNotification(comment, commentId) {
//     const isSecretText = comment.isSecret ? ' (Secret Comment)' : '';
//     const isAdminComment = comment.passwordHash === ADMIN_PASSWORD_HASH;
//     const authorName = isAdminComment ? `👑 ${comment.name}` : comment.name;
    
//     const notificationData = {
//         title: `New Comment${isSecretText}`,
//         author: authorName,
//         content: comment.isSecret ? '(Secret comment - content hidden)' : comment.message,
//         postId: comment.postId,
//         timestamp: comment.timestamp ? comment.timestamp.toDate().toISOString() : new Date().toISOString(),
//         commentUrl: `${BLOG_CONFIG.baseUrl}${comment.postId}#comment-${commentId}`,
//         isSecret: comment.isSecret,
//         isAdmin: isAdminComment
//     };

//     // Browser notification (if permission granted)
//     if ("Notification" in window && Notification.permission === "granted") {
//         new Notification(notificationData.title, {
//             body: `${notificationData.author}: ${notificationData.content.substring(0, 100)}${notificationData.content.length > 100 ? '...' : ''}`,
//             icon: '/favicon.ico', // Update with your site's icon
//             tag: commentId
//         });
//     }

//     // Send webhook notifications
//     try {
//         if (WEBHOOK_CONFIG.discord) {
//             await fetch(WEBHOOK_CONFIG.discord, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     embeds: [{
//                         title: notificationData.title,
//                         description: notificationData.content,
//                         color: comment.isSecret ? 0xff0000 : (isAdminComment ? 0x4169E1 : 0x00ff00),
//                         fields: [
//                             { name: 'Author', value: notificationData.author, inline: true },
//                             { name: 'Post', value: notificationData.postId, inline: true },
//                             { name: 'Link', value: `[View Comment](${notificationData.commentUrl})`, inline: false }
//                         ],
//                         timestamp: notificationData.timestamp
//                     }]
//                 })
//             });
//         }

//         if (WEBHOOK_CONFIG.slack) {
//             await fetch(WEBHOOK_CONFIG.slack, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     text: `New comment from ${notificationData.author}${isSecretText}`,
//                     attachments: [{
//                         color: comment.isSecret ? 'danger' : (isAdminComment ? '#4169E1' : 'good'),
//                         fields: [
//                             { title: 'Content', value: notificationData.content, short: false },
//                             { title: 'Post', value: notificationData.postId, short: true },
//                             { title: 'Link', value: notificationData.commentUrl, short: true }
//                         ],
//                         ts: Math.floor(new Date(notificationData.timestamp).getTime() / 1000)
//                     }]
//                 })
//             });
//         }

//         console.log('Webhook notifications sent successfully');
//     } catch (error) {
//         console.error('Error sending webhook notifications:', error);
//     }
// }

/**
 * Request browser notification permission
 */
// function requestNotificationPermission() {
//     if ("Notification" in window && Notification.permission === "default") {
//         Notification.requestPermission().then(permission => {
//             if (permission === "granted") {
//                 console.log("Notification permission granted");
//             }
//         });
//     }
// }

// /**
//  * Setup real-time comment listener for notifications
//  */
// function setupCommentNotifications(db, postId) {
//     return db.collection("comments")
//         .where("postId", "==", postId)
//         .orderBy("timestamp", "desc")
//         .limit(1)
//         .onSnapshot((snapshot) => {
//             snapshot.docChanges().forEach((change) => {
//                 if (change.type === "added") {
//                     const comment = change.doc.data();
//                     const commentId = change.doc.id;
                    
//                     // Only send notification if this is a new comment (not from initial load)
//                     if (comment.timestamp && 
//                         Date.now() - comment.timestamp.toMillis() < 5000) { // Within last 5 seconds
//                         sendCommentNotification(comment, commentId);
//                     }
//                 }
//             });
//         });
// }

/**
 * Add RSS generation button to page
 */
function addRSSButton(db, postId) {
    const rssButton = document.createElement('button');
    rssButton.innerHTML = '📡 Download RSS Feed';
    rssButton.style.cssText = `
        margin: 10px 0;
        padding: 8px 12px;
        border: 1px solid #4169E1;
        border-radius: 8px;
        background-color: #F1F8FF;
        color: #4169E1;
        cursor: pointer;
        font-weight: bold;
        transition: 0.3s;
    `;
    
    rssButton.addEventListener('mouseover', () => {
        rssButton.style.backgroundColor = '#4169E1';
        rssButton.style.color = 'white';
    });
    
    rssButton.addEventListener('mouseout', () => {
        rssButton.style.backgroundColor = '#F1F8FF';
        rssButton.style.color = '#4169E1';
    });
    
    rssButton.addEventListener('click', async () => {
        try {
            rssButton.disabled = true;
            rssButton.innerHTML = '⏳ Generating RSS...';
            
            const rssXML = await generateCommentRSSFeed(db, postId);
            downloadRSSFeed(rssXML, `comments-${postId.replace(/\//g, '-')}.xml`);
            
            rssButton.innerHTML = '✅ RSS Downloaded!';
            setTimeout(() => {
                rssButton.innerHTML = '📡 Download RSS Feed';
                rssButton.disabled = false;
            }, 2000);
        } catch (error) {
            alert('Error generating RSS feed: ' + error.message);
            rssButton.innerHTML = '📡 Download RSS Feed';
            rssButton.disabled = false;
        }
    });
    
    // Insert button before the comments container
    const commentsContainer = document.getElementById("comments-container");
    commentsContainer.parentNode.insertBefore(rssButton, commentsContainer);
}

// Export functions for use in commenting.js
window.RSSFunctions = {
    generateCommentRSSFeed,
    downloadRSSFeed,
    //sendCommentNotification,
    //requestNotificationPermission,
    //setupCommentNotifications,
    addRSSButton,
    BLOG_CONFIG,
    WEBHOOK_CONFIG
};
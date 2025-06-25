// Make sure you DEPLOY function after changing this script.
// firebase-function module v3 used
//const functions = require('firebase-functions');
const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const cors = require('cors')({
  origin: [
    'http://localhost:4000',
    'https://gaba-tope.github.io'
  ],
}); 
//const cors = require('cors')({ origin: 'http://localhost:4000' }); // Replace with your Jekyll site's origin
const RSS = require('rss');
const { Storage } = require('@google-cloud/storage');

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp();
}

// Cloud Function: Fetch Firebase Config
exports.getFirebaseConfig = onRequest({
  memory: '256MiB',
  cpu: 1,
  timeoutSeconds: 60,
}, (req, res) => {
  const configFilePath = path.join(__dirname, 'firebase-config.json'); 

  try {
    cors(req, res, () => {
        const configData = fs.readFileSync(configFilePath, 'utf8');
        res.json(JSON.parse(configData));
      });
    //const configData = fs.readFileSync(configFilePath, 'utf8');
    //res.json(JSON.parse(configData)); 
  } catch (error) {
    console.error('Error reading config file:', error);
    res.status(500).send('Error reading configuration');
  }
});

// Cloud Function: Generate Comment RSS
const bucketName = 'like-button-88f77.appspot.com';
const db = admin.firestore();
const storage = new Storage();

// 댓글이 추가될 때마다 RSS 피드 생성
const { onDocumentCreated } = require('firebase-functions/v2/firestore');

exports.generateCommentRSS =  onDocumentCreated({
  document: 'comments/{commentId}',
  memory: '256MiB',
  cpu: 1,
  timeoutSeconds: 60,
}, async (event) => {
  //const bucketName = 'like-button-88f77.appspot.com';
  try {
    const newComment = { 
      id: event.params.commentId, 
      ...event.data.data() 
    };

    // Firebase Storage 기본 버킷 사용 (자동으로 올바른 버킷명 가져옴)
    const bucket = admin.storage().bucket();
    const bucketName = bucket.name;
    console.log('Using bucket:', bucketName);

    // 전체 최신 댓글 20개 가져오기 (모든 포스트 통합)
    const recentCommentsSnapshot = await db.collection('comments')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();

    // RSS 피드 생성
    const feed = new RSS({
      title: '블로그 댓글 알림',
      description: '새로운 댓글이 달렸을 때 알림을 받아보세요',
      feed_url: `https://storage.googleapis.com/${bucketName}/public/rss/comments.xml`,
      site_url: 'https://gaba-tope.github.io/',
      language: 'ko-kr',
      copyright: "2024 Tope's Cytoplasm",
      ttl: 120 // RSS 캐시 시간 (분)
    });

    // 댓글들을 RSS 아이템으로 추가
    const comments = [];
    recentCommentsSnapshot.forEach(doc => {
      comments.push({ id: doc.id, ...doc.data() });
    });

    comments.forEach(comment => {
      // 비밀댓글 처리
      const isSecret = comment.isSecret || false;
      const title = isSecret 
        ? `🔒 [비밀댓글] ${comment.name}님이 댓글을 남겼습니다`
        : `💬 ${comment.name}님의 댓글`;
        
      const description = isSecret 
        ? '비밀댓글이 작성되었습니다. 내용은 작성자와 관리자만 볼 수 있습니다.'
        : comment.message;

      const postUrl = comment.postId 
        ? `https://gaba-tope.github.io${comment.postId}#comment-${comment.id}`
        : 'https://gaba-tope.github.io/';

      feed.item({
        title: title,
        description: description,
        url: postUrl,
        guid: `comment-${comment.id}`,
        date: comment.timestamp ? comment.timestamp.toDate() : new Date(),
        categories: ['댓글', isSecret ? '비밀댓글' : '일반댓글'],
        author: comment.name
      });
    });

    // Generate XML
    const xml = feed.xml({ indent: true });

    // 버킷이 존재하는지 확인
    const [bucketExists] = await bucket.exists();
    if (!bucketExists) {
      console.error('Storage bucket does not exist. Please create Firebase Storage first.');
      throw new Error('Storage bucket not found');
    }

    // Save RSS XML to Cloud Storage
     const file = bucket.file('public/rss/comments.xml');
    
    await file.save(xml, {
      metadata: {
        contentType: 'application/rss+xml; charset=utf-8',
        cacheControl: 'public, max-age=300' // 5분 캐시
      }
    });

    // Make the file public
    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucketName}/public/rss/comments.xml`;
    console.log(`RSS feed updated:`, publicUrl);
    
    return null;
  } catch (error){
    console.error('RSS 생성 실패:', error);
    // Error Specifics
    if (error.code === 404) {
      console.error('Bucket not found. Please check if Firebase Storage is properly initialized.');
    }
    
    throw new Error('RSS feed generation failed: ' + error.message);
  }
});
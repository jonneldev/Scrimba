// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://karaoke-app-78710-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInVideoIdDB = ref(database, "songs");

// DOM elements
const inputURL = document.getElementById("inputURL")
const addSongBtn = document.getElementById("add-song-btn")

// add-song.js - Extract the room number from the URL
const urlParams = new URLSearchParams(window.location.search);
const roomNo = urlParams.get('roomNo');
if (roomNo) {
    document.getElementById("occupied-room").textContent = roomNo;
}

function getVideoId() {
    const url = inputURL.value;

    // Define parts of the regex separately
    const youtubeBase = /youtube\.com\//;
    const shortLink = /youtu\.be\//;
    const customPath = /[^/]+\/.+\//;            // For paths like 'channel/abcd/video/'
    const embedPath = /(?:v|embed)\//;           // Matches '/v/' or '/embed/'
    const queryParam = /[?&]v=/;                 // Matches '?v=' or '&v=' in the URL
    const videoIdPattern = /([^"&?\/\s]{11})/;   // Matches the 11-character video ID

    // Combine all patterns into one using `|` (OR) operator
    const fullPattern = new RegExp(
        `(?:${youtubeBase.source}(?:${customPath.source}|${embedPath.source}|.*${queryParam.source})|${shortLink.source})${videoIdPattern.source}`
    );

    const match = url.match(fullPattern);
    return match ? match[1] : null;  // Returns the video ID or null if not found
}



function addVideoId() {
    
    const videoId = getVideoId()
    if(videoId !== null) {
        console.log("Video ID added: " + videoId)
        push(referenceInVideoIdDB, videoId)
    } else {
        console.log("video ID invalid")
    }
}


addSongBtn.addEventListener("click", addVideoId)
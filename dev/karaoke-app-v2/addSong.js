import { initializeApp } from "firebase/app";
import { getDatabase, 
         ref, 
         onValue, 
         child,
         push
        } from "firebase/database";

import Swal from 'sweetalert2';

const firebaseConfig = {
    databaseURL: "https://karaoke-app-v2-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInRoomDB = ref(database, "rooms");

// DOM elements
const currentPage = document.getElementById("add-song-page");
const inputURL = document.getElementById("inputURL");
const addSongBtn = document.getElementById("add-song-btn");
const occupiedRoom = document.getElementById("occupied-room");

occupiedRoom.textContent = JSON.parse(localStorage.getItem("roomNo"));

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

function addSongToRoom(videoId) {
    const roomNo = JSON.parse(localStorage.getItem("roomNo"));

    if (!roomNo) {
        return Promise.resolve(false); 
    }

    return new Promise((resolve) => {
        onValue(referenceInRoomDB, (snapshot) => {
            if (!snapshot.exists()) return resolve(false);

            const roomsData = snapshot.val();
            const roomKey = Object.keys(roomsData).find(
                (key) => roomsData[key].roomNo === roomNo
            );

            // Reference to add the new song ID as a key in the songs object
            const songRef = child(referenceInRoomDB, `${roomKey}/songs/`);

            // Add the song ID directly as a key in songs
            push(songRef, videoId)
                .then(() => {
                    resolve(true); // Song added successfully
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'Song added successfully!',
                        width: "300px",
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'my-popup',
                            title: 'my-title',
                            text: 'text'
                        }
                    });
                    inputURL.value = ""
                })
                .catch(() => {
                    resolve(false); // Error adding song
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to add the song. Please try again.',
                        width: "300px",
                        confirmButtonText: 'OK',
                        customClass: {
                            popup: 'my-popup',
                            title: 'my-title',
                            text: 'text'
                        }
                    });
                });
        }, {
            onlyOnce: true // Fetch data once, then stop listening
        });
    });
}


addSongBtn.addEventListener("click", function() {
    const videoId = getVideoId();
    if (videoId) {
        addSongToRoom(videoId);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Invalid URL!',
            text: 'Please enter a valid YouTube URL.',
            confirmButtonText: 'OK',
            customClass: {
                popup: 'my-popup',
                title: 'my-title',
                text: 'text'
            }
        });
    }
});

const backBtn = document.getElementById("back-btn")
backBtn.addEventListener("click", () => {
    currentPage.classList.add('slide-in');
            setTimeout(() => {
                window.location.href = '/joinRoom.html';  
            }, 300); 
})
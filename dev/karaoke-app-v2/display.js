import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import Swal from 'sweetalert2';

// Firebase configuration
const firebaseConfig = {
    databaseURL: "https://karaoke-app-v2-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInRoomDB = ref(database, "rooms");

// Load the IFrame Player API code asynchronously
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let videoIds = [];
let currentIndex = 0;
let player; // Define player globally to access it in other functions

// Fetch video IDs and initialize the player when ready
function getVideoIds() {
    return new Promise((resolve, reject) => {
        const roomNo = JSON.parse(localStorage.getItem("roomNo"));
        
        onValue(referenceInRoomDB, (snapshot) => {
            const roomsData = snapshot.val();
            videoIds = []; // Clear any existing IDs

            for (const key in roomsData) {
                if (roomsData[key].roomNo === roomNo) {
                    videoIds = Object.values(roomsData[key].songs); // Extract video IDs as array
                    break;
                }
            }

            console.log("Fetched video IDs:", videoIds);
            if (videoIds.length > 0) {
                resolve(videoIds); // Resolve if videoIds has values
            } else {
                reject("No videos found for this room.");
            }
        }, (error) => {
            reject(error); // Reject on Firebase error
        });
    });
}

// Define the YouTube IFrame Player initialization function globally
function onYouTubeIframeAPIReady() {
    // Only initialize if videoIds has been populated
    if (videoIds.length === 0) {
        console.error("No video IDs available to load.");
        return; // Prevents initialization if videoIds is empty
    }

    player = new YT.Player('player', {
        videoId: videoIds[currentIndex],
        playerVars: { 'playsinline': 1 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'controls': 1, // Show player controls
            'showinfo': 0, // Optional: Do not show video title
            'rel': 0, // Optional: Do not show related videos at the end
            'vq': 'highres',
            'fs': 1
        }
    });
}

// Wait for `videoIds` to be populated before attempting to initialize the player
getVideoIds()
    .then(() => {
        console.log("Video IDs ready:", videoIds);

        // Check if YT API has loaded, otherwise, wait until it is
        if (window.YT && window.YT.Player) {
            onYouTubeIframeAPIReady();
        } else {
            // Poll for the YT API to be ready
            window.addEventListener("load", function checkYTReady() {
                if (window.YT && window.YT.Player) {
                    onYouTubeIframeAPIReady();
                    window.removeEventListener("load", checkYTReady);
                }
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching video IDs:", error);
    });

// The API will call this function when the video player is ready
function onPlayerReady(event) {
    console.log("Player is ready, playing first video.");
    event.target.playVideo();
}

// Handle video state changes
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        currentIndex = (currentIndex + 1) % videoIds.length; // Move to the next video
        player.loadVideoById(videoIds[currentIndex]);
    }
}

// Stop video function
function stopVideo() {
    if (player) {
        player.stopVideo();
    }
}

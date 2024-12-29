// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://karaoke-app-78710-default-rtdb.asia-southeast1.firebasedatabase.app",

};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const roomsRef = ref(database, "rooms");

// DOM elements
const roomNoInput = document.getElementById("room-no");
const roomPasswordInput = document.getElementById("room-password");
const joinRoomBtn = document.getElementById("join-room-btn");
const currentPage = document.getElementById("join-room-page");
const roomErrorSpan = document.getElementById("room-input-error");
const passwordErrorSpan = document.getElementById("password-input-error");


// Main function to handle room joining
async function handleJoinRoom() {
    clearErrorMessages();

    const roomNo = roomNoInput.value.trim();
    const password = roomPasswordInput.value.trim();

    if (!validateInputs(roomNo, password)) return;

    const isMatch = await checkRoomAndPassword(roomNo, password);

    if (isMatch) {
        await displaySuccessMessage(roomNo); // Wait for "OK" to be clicked
        window.location.href = `add-song.html?roomNo=${roomNo}`;
        navigateToAddSongPage();
    } else {
        displayErrorMessage("Password does not match!");
    }

    clearInputs();
}

// Validate input fields and display errors if empty
function validateInputs(roomNo, password) {
    let isValid = true;

    if (!roomNo) {
        roomErrorSpan.textContent = "Please input room no";
        isValid = false;
    }
    if (!password) {
        passwordErrorSpan.textContent = "Please input room password";
        isValid = false;
    }

    return isValid;
}

// Reset error messages for room and password fields
function clearErrorMessages() {
    roomErrorSpan.textContent = "";
    passwordErrorSpan.textContent = "";
}

// Clear the input fields after joining or error
function clearInputs() {
    roomNoInput.value = "";
    roomPasswordInput.value = "";
}

// Check if the room and password match any entry in the database
function checkRoomAndPassword(roomNo, password) {
    return new Promise((resolve) => {
        onValue(roomsRef, (snapshot) => {
            if (!snapshot.exists()) return resolve(false);

            const roomsData = snapshot.val();
            const isMatch = Object.values(roomsData).some(
                (room) => room.room === roomNo && room.password === password
            );
            
            resolve(isMatch);
        });
    });
}

// Display success message and start transition to the song page
function displaySuccessMessage(roomNo) {
    return Swal.fire({
        title: `Room ${roomNo}`,
        text: "Enjoy your stay!",
        icon: "success",
        confirmButtonText: 'OK'
    });
}

// Display error message when password or room is incorrect
function displayErrorMessage(message) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
    });
}

// Navigate to the song-adding page after successful join
function navigateToAddSongPage() {
    currentPage.classList.add('slide-out');
    setTimeout(() => {
        window.location.href = 'http://127.0.0.1:5500/dev/karaoke-app/add-song.html';  
    }, 500); 
}

// Event listener for the join room button
joinRoomBtn.addEventListener("click", handleJoinRoom);

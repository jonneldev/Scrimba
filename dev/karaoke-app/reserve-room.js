// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://karaoke-app-78710-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInRoomDB = ref(database, "rooms");

// DOM elements
const roomNoInput = document.getElementById("room-no");
const roomPasswordInput = document.getElementById("room-password");
const reservedRoomBtn = document.getElementById("reserved-room-btn");
const currentPage = document.getElementById("reservation-page");
const roomSpan = document.getElementById("room-input-error");
const passwordSpan = document.getElementById("password-input-error");

// Validate inputs
async function checkInput() {
    const roomNoInputValue = roomNoInput.value.trim();
    const roomPasswordInputValue = roomPasswordInput.value.trim();
    
    resetErrorMessages();

    // Check for empty inputs
    if (roomNoInputValue === "") {
        roomSpan.textContent = "Please input room no";
    }
    if (roomPasswordInputValue === "") {
        passwordSpan.textContent = "Please input room password";
    }
    if (roomNoInputValue === "" || roomPasswordInputValue === "") {
        return false;
    }

    // Check if the room exists
    const roomExists = await checkIfRoomExists(roomNoInputValue);
    return !roomExists; // Return true if room does not exist
}

// Reset error messages
function resetErrorMessages() {
    roomSpan.textContent = "";
    passwordSpan.textContent = "";
}

// Clear input fields
function clearInput() {
    roomNoInput.value = "";
    roomPasswordInput.value = "";
}

// Check if the room already exists in the database
function checkIfRoomExists(targetRoom) {
    return new Promise((resolve) => {
        onValue(referenceInRoomDB, (snapshot) => {
            let roomExists = false;
            if (snapshot.exists()) {
                const roomsData = snapshot.val();
                roomExists = Object.values(roomsData).some(room => room.room === targetRoom);
            }
            // Show alert if room exists
            if (roomExists) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Room already reserved by another guest!",
                });
                roomSpan.textContent = "Room already reserved by another guest";
            }
            resolve(roomExists);
        });
    });
}

// Create a new room object
function addRoom(room, password, songs = []) {
    return { room, password, songs};
}

// Handle reservation and page transition
async function goToDisplayPage() {
    if (await checkInput()) {
        const newRoom = addRoom(roomNoInput.value, roomPasswordInput.value, ["H_t0h4IIt2Q"]);
        push(referenceInRoomDB, newRoom);

        Swal.fire({
            title: `Room ${roomNoInput.value} Reserved!`,
            text: "Enjoy your stay!",
            icon: "success",
            confirmButtonText: 'OK'
        }).then(() => {
            currentPage.classList.add('slide-out');
            setTimeout(() => {
                window.location.href = 'http://127.0.0.1:5500/dev/karaoke-app/display.html';  
            }, 500); 
        });
    }
    clearInput();
}

// Event listener for the reservation button
reservedRoomBtn.addEventListener("click", goToDisplayPage);

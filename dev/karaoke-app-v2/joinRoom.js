import { initializeApp } from "firebase/app";
import { getDatabase, 
         ref, 
         onValue 
        } from "firebase/database";

import Swal from 'sweetalert2'

const firebaseConfig = {
    databaseURL: "https://karaoke-app-v2-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInRoomDB = ref(database, "rooms");

const roomNoInput = document.getElementById("room-no");
const roomPasswordInput = document.getElementById("room-password");
const joinRoomBtn = document.getElementById("join-room-btn");
const currentPage = document.getElementById("join-room-page");
const roomErrorSpan = document.getElementById("room-input-error");
const passwordErrorSpan = document.getElementById("password-input-error");

async function handleJoinRoom() {
    clearErrorMessages();

    const roomNo = roomNoInput.value.trim();
    const password = roomPasswordInput.value.trim();

    if (!validateInputs(roomNo, password)) return;

    const isMatch = await checkRoomAndPassword(roomNo, password);

    if (isMatch) {
        await displaySuccessMessage(roomNo); 
        localStorage.setItem("roomNo", JSON.stringify(roomNo))
        
        navigateToAddSongPage();
    } else {
        displayErrorMessage("Password does not match!");
    }

    clearInputs();
}


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

function clearErrorMessages() {
    roomErrorSpan.textContent = "";
    passwordErrorSpan.textContent = "";
}

function clearInputs() {
    roomNoInput.value = "";
    roomPasswordInput.value = "";
}

function checkRoomAndPassword(roomNo, password) {
    return new Promise((resolve) => {
        onValue(referenceInRoomDB, (snapshot) => {
            if (!snapshot.exists()) return resolve(false);

            const roomsData = snapshot.val();
            const isMatch = Object.values(roomsData).some(
                (room) => room.roomNo === roomNo && room.password === password
            );
            
            resolve(isMatch);
        });
    });
}


function displaySuccessMessage(roomNo) {
    return Swal.fire({
        title: `Room ${roomNo}`,
        text: "Enjoy your stay!",
        icon: "success",
        confirmButtonText: 'OK'
    });
}

function displayErrorMessage(message) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: message,
    });
}

function navigateToAddSongPage() {
    currentPage.classList.add('slide-out');
    setTimeout(() => {
        window.location.href = 'addSong.html';  
    }, 500); 
}

joinRoomBtn.addEventListener("click", handleJoinRoom);

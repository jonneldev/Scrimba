import { initializeApp } from "firebase/app";
import { getDatabase, 
         ref, 
         push, 
         onValue 
        } from "firebase/database";

import Swal from 'sweetalert2'

const firebaseConfig = {
    databaseURL: "https://karaoke-app-v2-default-rtdb.asia-southeast1.firebasedatabase.app"
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


function checkIfRoomExists(targetRoom) {
    return new Promise((resolve) => {
        onValue(referenceInRoomDB, (snapshot) => {
            let roomExists = false;
            if (snapshot.exists()) {
                const roomsData = snapshot.val();
                roomExists = Object.values(roomsData).some(room => room.roomNo === targetRoom);
            }
   
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


async function validateInput() {

    const roomNo = roomNoInput.value; 
    const password = roomPasswordInput.value;  

    resetErrorMessages()

    if (roomNo === "") {
        roomSpan.textContent = "Please input room no";
    }
    if (password === "") {
        passwordSpan.textContent = "Please input room password";
    }
    if (roomNo === "" || password === "") {
        return false;
    }

    const roomExists = await checkIfRoomExists(roomNo);
    return !roomExists; 
}


async function reservedRoom() {

    const roomNo = roomNoInput.value; 
    const password = roomPasswordInput.value;  

    const roomData = {
        roomNo: roomNo,
        password: password,
        songs: ["H_t0h4IIt2Q"]
    };

    if(await validateInput()) {
        push(referenceInRoomDB, roomData)

        localStorage.setItem("roomNo", JSON.stringify(roomNo))

        Swal.fire({
            title: `Room ${roomNo} Reserved!`,
            text: "Enjoy your stay!",
            icon: "success",
            confirmButtonText: 'OK'
        }).then(() => {
            currentPage.classList.add('slide-out');
            setTimeout(() => {
                window.location.href = '/display.html';  
            }, 500); 
        });
    }
    clearInput();
}

function clearInput() {
    roomNoInput.value = "";
    roomPasswordInput.value = "";
}

function resetErrorMessages() {
    roomSpan.textContent = "";
    passwordSpan.textContent = "";
}


reservedRoomBtn.addEventListener("click", reservedRoom)



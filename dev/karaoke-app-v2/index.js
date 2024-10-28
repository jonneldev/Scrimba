// Get references to DOM elements
const reserveRoomBtn = document.getElementById('reserve-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');

const currentPage = document.getElementById("main-page")

function goToReservationPage() {
    currentPage.classList.add('slide-out');  
    setTimeout(() => {
        window.location.href = '/reserveRoom.html';  
    }, 500); 
}

function goJoinPage() {
    currentPage.classList.add('slide-out');  
    setTimeout(() => {
        window.location.href = '/joinRoom.html';  
    }, 500); 
}

reserveRoomBtn.addEventListener("click", goToReservationPage)
joinRoomBtn.addEventListener("click", goJoinPage)


const characters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9","~","`","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","[","}","]",",","|",":",";","<",">",".","?",
"/"];

const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"
]

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

const symbols = ["~","`","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","[","}","]",",","|",":",";","<",">",".","?",
"/"]

const passwordLength = document.getElementById("password-length");
const caseSensitive = document.getElementById("case-sensitive");
const withNumbers = document.getElementById("with-numbers");
const withSymbols = document.getElementById("with-symbols");

const generateButton = document.getElementById("generate-button")
const passwordOptionOne = document.getElementById("password-option-one")
const passwordOptionTwo = document.getElementById("password-option-two")

let passwordChoice = []
 
function getPasswordOption() {

    passwordChoice = []

    if (caseSensitive.checked) {
        passwordChoice.push(...letters)
    }

    if (withNumbers.checked) {
        passwordChoice.push(...numbers)
    }

    if (withSymbols.checked) {
        passwordChoice.push(...symbols)
    }

}



function generatePassword() {

    if (passwordLength.value === "") {
        console.log("empty")
    }

    getPasswordOption();

    let randomPasswordOne = []
    let randomPasswordTwo = []

    for (let i = 0; i < passwordLength.value; i++) {
        randomPasswordOne += passwordChoice[Math.floor(Math.random() * passwordChoice.length)]
        randomPasswordTwo += passwordChoice[Math.floor(Math.random() * passwordChoice.length)]
    }

    passwordOptionOne.textContent = randomPasswordOne;
    passwordOptionTwo.textContent = randomPasswordTwo;
}

generateButton.addEventListener("click", generatePassword)



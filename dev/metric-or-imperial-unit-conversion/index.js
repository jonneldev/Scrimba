
const meter = 3.281 //feet
const liter = 0.264 //gallon
const kilogram = 2.204 //pound


const inputNum = document.getElementById("input-num")
const convertBtn = document.getElementById("convert-btn")
const lengthConversion = document.getElementById("length-conversion")
const volumeConversion = document.getElementById("volume-conversion")
const massConversion = document.getElementById("mass-conversion")


function convert() {
    let inputNumValue = inputNum.value
    
    function metersToFeet() {
    return (inputNumValue * meter).toFixed(3)
    }

    function feetToMeter() {
        return (inputNumValue / meter).toFixed(3)
    }

    function literToGallons() {
        return (inputNumValue * liter).toFixed(3)
    }

    function gallonsToLiter() {
        return (inputNumValue / liter).toFixed(3)
    }

    function kilosToPounds() {
        return (inputNumValue * kilogram).toFixed(3)
    }

    function poundsToKilos() {
        return (inputNumValue / kilogram).toFixed(3)
    }
    
    console.log(feetToMeter())
    
    lengthConversion.textContent = `
        ${inputNumValue} meters = ${metersToFeet()} feet |
        ${inputNumValue} feet = ${feetToMeter()} meters 
    `
    
    volumeConversion.textContent = `
        ${inputNumValue} liters = ${literToGallons()} gallons |
        ${inputNumValue} gallons = ${gallonsToLiter()} liters 
    `
    
    massConversion.textContent = `
        ${inputNumValue} kilos = ${kilosToPounds()} pounds |
        ${inputNumValue} pounds = ${poundsToKilos()} kilos 
    `
}

convertBtn.addEventListener("click", convert)
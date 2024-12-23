import menuArray from "./data.js";

const menuContainer = document.getElementById('menu-container')
const completeOrderBtn = document.getElementById('complete-order-btn')
const orderContainer = document.getElementById("order-container")
const orderSection = document.getElementById("order-section")

menuArray.forEach(menu => {
    menuContainer.innerHTML += `

    <div class="menu-items">
        <span class="menu-emoji">${menu.emoji}</span>
        <div class="menu-details">
            <span class="menu-name">${menu.name}</span>
            <span class="menu-ingredients">${menu.ingredients}</span>
            <span class="menu-price">${menu.price}</span>
        </div>
        <button 
            data-order="${menu.name}" 
            data-price="${menu.price}"
            class="add-menu-btn">
            +
         </button>
    </div>
    `
})


document.addEventListener('click', function(e) {

    orderSection.style.display = 'block'

    if (e.target.dataset.order) {

        const order = e.target.dataset.order
        const price = e.target.dataset.price
        orderContainer.innerHTML += `
        
        <div class="order-item">
            <span class="menu-name">${order}</span>
            <button class="remove-btn">remove</button>
            <span class="menu-price order-price">$ ${price}</span>
        </div>
        `
    }

    if (e.target.classList.contains('remove-btn')) {
        e.target.parentElement.remove()
    }

    if (orderContainer.children.length === 0) {
        orderSection.style.display = 'none';
    }


    const totalOrderPrice = document.getElementById("total-order-price")
    const orderPrice  = document.querySelectorAll('.order-price')
    
    let total = 0;

    orderPrice.forEach(price => {
        total += parseFloat(price.textContent.replace('$ ', ''))
    })

    totalOrderPrice.textContent = `$ ${total}`

})

completeOrderBtn.addEventListener('click', function() {
    // Toggle the 'active' class to show modal and overlay
    document.getElementById('modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');

    // Optional: Hide modal and overlay when clicked outside
    document.getElementById('overlay').addEventListener('click', function() {
        document.getElementById('modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    });

    document.getElementById('close-modal-btn').addEventListener('click', function() {
        document.getElementById('modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    });
});

const formData = document.getElementById('payment-form')
const payBtn = document.getElementById('pay-btn')

formData.addEventListener('submit', function(e) {
    e.preventDefault()
    const { name, cardNumber, cvv } = formData
    if (name.value && cardNumber.value && cvv.value) {
        console.log(`
            Name: ${name.value} 
            Card number: ${cardNumber.value} 
            CVV: ${cvv.value}
        `)

        document.getElementById('modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        orderSection.style.display = 'none';

        const appContainer = document.getElementById('app-container')
        appContainer.appendChild(document.createElement('h1')).textContent = `Thanks, ${name.value}! Your order is on its way!`
    }
})



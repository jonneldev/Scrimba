// Character sets for password generation
const CHARS = {
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
    numbers: '0123456789'.split(''),
    symbols: '~`!@#$%^&*()_-+={}[]|:;<>,.?/'.split('')
}

// DOM elements
const elements = {
    passwordLength: document.getElementById('password-length'),
    caseSensitive: document.getElementById('case-sensitive'), 
    withNumbers: document.getElementById('with-numbers'),
    withSymbols: document.getElementById('with-symbols'),
    generateButton: document.getElementById('generate-button'),
    passwordOptionOne: document.getElementById('password-option-one'),
    passwordOptionTwo: document.getElementById('password-option-two'),
    errorContainer: document.getElementById('error-container')
}

// Show error message
function showError(message) {
    elements.errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    elements.passwordOptionOne.classList.add('error');
    elements.passwordOptionTwo.classList.add('error');
    
    // Remove error after 3 seconds
    setTimeout(() => {
        elements.errorContainer.innerHTML = '';
        elements.passwordOptionOne.classList.remove('error');
        elements.passwordOptionTwo.classList.remove('error');
    }, 3000);
}

// Get selected character sets based on user options
function getSelectedChars() {
    const selectedChars = []
    
    if (elements.caseSensitive.checked) {
        selectedChars.push(...CHARS.letters)
    }

    if (elements.withNumbers.checked) {
        selectedChars.push(...CHARS.numbers) 
    }

    if (elements.withSymbols.checked) {
        selectedChars.push(...CHARS.symbols)
    }

    return selectedChars
}

// Generate a random password of specified length
function generateRandomPassword(length, chars) {
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
}

// Copy password to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show copied feedback
        const originalText = event.target.textContent;
        event.target.textContent = 'Copied!';
        setTimeout(() => {
            event.target.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Main password generation handler
function handleGeneratePasswords() {
    // Clear any existing errors
    elements.errorContainer.innerHTML = '';
    elements.passwordOptionOne.classList.remove('error');
    elements.passwordOptionTwo.classList.remove('error');

    // Validate password length
    const length = parseInt(elements.passwordLength.value);
    if (!length) {
        showError('Please enter a password length');
        return;
    }
    if (length < 8 || length > 15) {
        showError('Password length must be between 8 and 15 characters');
        return;
    }

    // Validate character options
    const selectedChars = getSelectedChars();
    if (selectedChars.length === 0) {
        showError('Please select at least one character type');
        return;
    }

    // Generate passwords
    const passwordOne = generateRandomPassword(length, selectedChars);
    const passwordTwo = generateRandomPassword(length, selectedChars);

    elements.passwordOptionOne.textContent = passwordOne;
    elements.passwordOptionTwo.textContent = passwordTwo;
}

// Add click handlers for password boxes
elements.passwordOptionOne.addEventListener('click', (e) => copyToClipboard(e.target.textContent));
elements.passwordOptionTwo.addEventListener('click', (e) => copyToClipboard(e.target.textContent));

// Event listener for generate button
elements.generateButton.addEventListener('click', handleGeneratePasswords);

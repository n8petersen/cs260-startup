function needDatabase() {
    const userName = document.querySelector('#username')?.value;
    const password = document.querySelector('#password')?.value;
    const password_confirm = document.querySelector('#password-confirm')?.value;

    if (password !== password_confirm) {
        alert("Passwords don't match.");
    }
    
    console.log(userName);
    console.log(password);
    console.log(password_confirm);
    event.preventDefault(); // Don't refresh page
}
async function loginUser() {
    loginOrCreate(`/api/auth/login`);
}

async function createUser() {
    const password = document.querySelector('#password')?.value;
    const password_confirm = document.querySelector('#password-confirm')?.value;

    if (password !== password_confirm) {
        alert("Passwords don't match.");
        event.preventDefault();
    }
    loginOrCreate(`/api/auth/create`);
}

async function loginOrCreate(endpoint) {
    const userName = document.querySelector('#username')?.value;
    const password = document.querySelector('#password')?.value;

    if (!userName) {
        alert("No username provided.");
        event.preventDefault();
    }



    else {
        const response = await fetch(endpoint, {
            method: 'post',
            body: JSON.stringify({ email: userName, password: password }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        event.preventDefault();
        console.log("received");
        const body = await response.json();

        if (response?.status === 200) {
            localStorage.setItem('userName', userName);
            window.location.href = 'lists.html';
        } else {
            // const modalEl = document.querySelector('#msgModal');
            // modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
            // const msgModal = new bootstrap.Modal(modalEl, {});
            // msgModal.show();
            console.log("error");
        }
    }


}
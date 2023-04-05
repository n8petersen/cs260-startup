(async () => {
    let authenticated = false;
    const username = localStorage.getItem('username');
    if (username) {
        const nameEl = document.querySelector('#username');
        nameEl.value = username;
        const user = await getUser(nameEl.value);
        authenticated = user?.authenticated;
    }
})();

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
    const username = document.querySelector('#username')?.value;
    const password = document.querySelector('#password')?.value;
    const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ email: username, password: password }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });

    const body = await response.json();
    console.log(body);

    if (response?.status === 200) {
        localStorage.setItem('username', username);
        window.location.href = 'lists.html';
    } else {
        const modalEl = document.querySelector('#msgModal');
        modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
        const msgModal = new bootstrap.Modal(modalEl, {});
        msgModal.show();
    }
}


function logout() {
    fetch(`/api/auth/logout`, {
        method: 'delete',
    }).then(() => (window.location.href = '/'));
    localStorage.removeItem("username");
}


async function getUser(email) {
    let tasks = [];
    // See if we have a user with the given email.
    const response = await fetch(`/api/user/${email}`);
    if (response.status === 200) {
        return response.json();
    }

    return null;
}





// hit login button on "Enter" keypress
var input = document.getElementById('password');
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        // alert("test");
        document.getElementById("loginButton").click();
    }
});
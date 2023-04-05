(async () => {
    let authenticated = false;
    const username = localStorage.getItem('username');
    if (username) {
        const user = await getUser(username);
        authenticated = user?.authenticated;
    }
    if (!authenticated) {
        window.location.replace('../index.html');
    }
})();


async function getUser(email) {
    let tasks = [];
    // See if we have a user with the given email.
    const response = await fetch(`/api/user/${email}`);
    if (response.status === 200) {
        return response.json();
    }

    return null;
}

function logout() {
    fetch(`/api/auth/logout`, {
        method: 'delete',
    }).then(() => (window.location.href = '/'));
}
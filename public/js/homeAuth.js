(async () => {
    let authenticated = false;
    const username = localStorage.getItem('username');
    if (username) {
        const user = await getUser(username);
        authenticated = user?.authenticated;
    }
    if (authenticated) {
        window.location.replace('../html/lists.html');
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

// Not sure if this is even needed, since authenticated users get redirected away from Home page.
function logout() {
    fetch(`/api/auth/logout`, {
        method: 'delete',
    }).then(() => (window.location.href = '/'));
    localStorage.removeItem("username");
}
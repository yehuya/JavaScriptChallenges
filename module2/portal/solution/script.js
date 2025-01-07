const form = document.getElementById("login");
const logout = document.getElementById("logout");

const getCookies = (name) => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0].trim() === name) {
            return cookie[1];
        }
    }
}

const isLoggedIn = () => {
    if(getCookies("loggedIn") === "true") {
        document.body.classList.add("loggedIn");
    } else {
        document.body.classList.remove("loggedIn");
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.cookie = `loggedIn=true; path=/module2/portal/solution; Max-Age=60`;
    isLoggedIn();
});

logout.addEventListener("click", () => {
    document.cookie = `loggedIn=; path=/module2/portal/solution; Max-Age=0`;
    isLoggedIn();
});

isLoggedIn();

// Implement object like document.cookie
const couple = {
    _value: "",
    get name() {
        return this._value;
    },
    set name(value) {
        this._value = this._value ? `${this._value}+${value}` : value;
    },
}

couple.name = "A";
couple.name = "B";
console.log(couple.name); // Expected output: "A+B"
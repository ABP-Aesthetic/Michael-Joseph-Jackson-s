window.addEventListener("DOMContentLoaded", function () {

    const savedLevel = localStorage.getItem("siteLevel");

    if (!savedLevel) {
        showLevelChoice();
    }

    function showLevelChoice() {
        const overlay = document.createElement("div");
        overlay.id = "level-overlay";

        overlay.innerHTML = `
            <div id="level-card">
                <h2>Choose your experience</h2>

                <button onclick="selectLevel('simple')">
                    1⃣ Simple
                </button>

                <button onclick="selectLevel('complete')">
                    2⃣ Complete
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    window.selectLevel = function (level) {
        localStorage.setItem("siteLevel", level);

        const overlay = document.getElementById("level-overlay");

        if (overlay) {
            overlay.remove();
        }
    };

});
function applySiteLevel() {

    const level = localStorage.getItem("siteLevel") || "simple";

    const simpleElements = document.querySelectorAll(".simple-version");
    const completeElements = document.querySelectorAll(".complete-version");

    if (level === "simple") {

        simpleElements.forEach(element => {
            element.style.display = "block";
        });

        completeElements.forEach(element => {
            element.style.display = "none";
        });

    } else {

        simpleElements.forEach(element => {
            element.style.display = "none";
        });

        completeElements.forEach(element => {
            element.style.display = "block";
        });
    }
}

window.addEventListener("DOMContentLoaded", applySiteLevel);
function highlightMainSection() {
    
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");

    if (!search) {
        return;
    }

    const title = document.querySelector(".page-content h1");

    if (title) {
    }
}

window.addEventListener("DOMContentLoaded", highlightMainSection);
function highlightMatchingSection() {

    const params = new URLSearchParams(window.location.search);
    const match = params.get("match");

    if (!match) {
        return;
    }

    const links = document.querySelectorAll("a");

    links.forEach(link => {

        if (link.getAttribute("href").includes(match)) {

    link.style.backgroundColor = "yellow";

    const currentHref = link.getAttribute("href");

    link.href =
        `${currentHref}?search=${encodeURIComponent(
            params.get("search")
        )}`;
}

    });
}

window.addEventListener("DOMContentLoaded", highlightMatchingSection);
function highlightSearchText() {

    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");

    if (!search) {
        return;
    }

    const content = document.querySelector(".page-content");

    if (!content) {
        return;
    }

    const walker = document.createTreeWalker(
        content,
        NodeFilter.SHOW_TEXT
    );

    const textNodes = [];
    let node;

    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

    const regex = new RegExp(escapedSearch, "gi");

    textNodes.forEach(textNode => {

        const text = textNode.nodeValue;

        if (!regex.test(text)) {
            regex.lastIndex = 0;
            return;
        }

        regex.lastIndex = 0;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {

            fragment.appendChild(
                document.createTextNode(
                    text.slice(lastIndex, match.index)
                )
            );

            const highlight = document.createElement("span");
            highlight.className = "search-highlight";
            highlight.textContent = match[0];

            fragment.appendChild(highlight);

            lastIndex = match.index + match[0].length;
        }

        fragment.appendChild(
            document.createTextNode(text.slice(lastIndex))
        );

        textNode.parentNode.replaceChild(fragment, textNode);
    });
}

window.addEventListener("DOMContentLoaded", highlightSearchText);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("show-register").addEventListener("click", function () {
        document.getElementById("register-form").style.display = "block";
    });
});
const forbiddenUsernames = [
    "michael jackson",
    "michael-jackson",
    "michael_jackson",
    "michael joseph jackson",
    "michael-joseph-jackson",
    "michael_joseph_jackson"
];
function isUsernameValid(username) {
    const cleanUsername = username.trim();

    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
        return false;
    }

    if (forbiddenUsernames.includes(cleanUsername.toLowerCase())) {
        return false;
    }

    return true;
}

document.addEventListener("DOMContentLoaded", function () {

    const registerButton = document.getElementById("register-button");

    registerButton.addEventListener("click", async function () {

        const username = document.getElementById("register-username").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value;

        if (!isUsernameValid(username)) {
            alert("Please choose a valid username.");
            return;
        }
const { data: existingProfile, error: usernameCheckError } =
    await supabaseClient
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

if (usernameCheckError) {
    alert("Could not check username availability.");
    return;
}

if (existingProfile) {
    alert("That username is already taken. Please choose another one.");
    return;
}
        
        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Account created! Please check your email to confirm your account.");
    });
    const showLogin = document.getElementById("show-login");
    const loginForm = document.getElementById("login-form");

    showLogin.addEventListener("click", function () {
        loginForm.style.display = "block";
    });
    const loginButton = document.getElementById("login-button");

    loginButton.addEventListener("click", async function () {

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Logged in successfully!");
                loginForm.style.display = "none";
        document.getElementById("show-login").style.display = "none";
document.getElementById("show-register").style.display = "none";
    });
    
});

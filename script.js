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

    const showLogin = document.getElementById("show-login");
    const showRegister = document.getElementById("show-register");

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    showLogin.addEventListener("click", function () {

        if (loginForm.style.display === "block") {
            loginForm.style.display = "none";
        } else {
            loginForm.style.display = "block";
            registerForm.style.display = "none";
        }

    });

    showRegister.addEventListener("click", function () {

        if (registerForm.style.display === "block") {
            registerForm.style.display = "none";
        } else {
            registerForm.style.display = "block";
            loginForm.style.display = "none";
        }

    });
    const createPostButton = document.getElementById("create-post-button");
const createPostForm = document.getElementById("create-post-form");

createPostButton.addEventListener("click", function () {
    if (createPostForm.style.display === "block") {
        createPostForm.style.display = "none";
    } else {
        createPostForm.style.display = "block";
    }
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

const user = data.user;

const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

if (profileError) {
    alert("Could not load your profile.");
    return;
}

        alert("Logged in successfully!");
                document.getElementById("login-form").style.display = "none";
        document.getElementById("show-login").style.display = "none";
document.getElementById("show-register").style.display = "none";
        const loggedInArea = document.getElementById("logged-in-area");
const loggedInMessage = document.getElementById("logged-in-message");

loggedInMessage.innerHTML = `
    <p>Hi, Moonwalker!! 💗✨</p>

    <p>I’m so glad you decided to join this community. I sincerely hope you find a little corner here where you can express and share ideas, thoughts, and feelings with other fans like you. 💖</p>

    <p>You’ve just joined us as <strong>${profile.username}</strong>.</p>
`;

loggedInArea.style.display = "block";
        document.getElementById("create-post-area").style.display = "block";
        
        const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", async function () {

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        alert(error.message);
        return;
    }

    loggedInArea.style.display = "none";
    document.getElementById("create-post-area").style.display = "none";
    document.getElementById("create-post-form").style.display = "none";
    document.getElementById("show-login").style.display = "inline-block";
    document.getElementById("show-register").style.display = "inline-block";
});
    });
    
});
document.addEventListener("DOMContentLoaded", function () {

    const dropZone = document.getElementById("drop-zone");
    const postMedia = document.getElementById("post-media");
    const selectedFiles = document.getElementById("selected-files");

window.filesList = [];
    
    function updateFileInput() {

        const dataTransfer = new DataTransfer();

        window.filesList.forEach(function (file) {
            dataTransfer.items.add(file);
        });

        postMedia.files = dataTransfer.files;

        selectedFiles.innerHTML = "";

        window.filesList.forEach(function (file, index) {

            const fileRow = document.createElement("div");

            const fileName = document.createElement("span");
            fileName.textContent = file.name;

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "✕";

            removeButton.addEventListener("click", function () {
                window.filesList.splice(index, 1);
                updateFileInput();
            });

            fileRow.appendChild(fileName);
            fileRow.appendChild(removeButton);

            selectedFiles.appendChild(fileRow);
        });
    }

    dropZone.addEventListener("click", function () {
        postMedia.click();
    });

    postMedia.addEventListener("change", function (event) {

    const newFiles = Array.from(event.target.files);

    newFiles.forEach(function (file) {
        window.filesList.push(file);
    });

    updateFileInput();
});

    dropZone.addEventListener("dragover", function (event) {
        event.preventDefault();
        dropZone.style.backgroundColor = "#eeeeee";
    });

    dropZone.addEventListener("dragleave", function () {
        dropZone.style.backgroundColor = "";
    });

    dropZone.addEventListener("drop", function (event) {

        event.preventDefault();
        dropZone.style.backgroundColor = "";

        for (const file of event.dataTransfer.files) {
            window.filesList.push(file);
        }

        updateFileInput();
    });

});
document.addEventListener("DOMContentLoaded", function () {

    const linkInput = document.getElementById("post-link");
    const addLinkButton = document.getElementById("add-link-button");
    const selectedLinks = document.getElementById("selected-links");

window.linksList = [];
    addLinkButton.addEventListener("click", function () {

        const link = linkInput.value.trim();

        if (!link) {
            return;
        }

        window.linksList.push(link);

        linkInput.value = "";

        selectedLinks.innerHTML = "";

        window.linksList.forEach(function (url, index) {

            const linkRow = document.createElement("div");

            const linkText = document.createElement("span");
            linkText.textContent = url;

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "✕";

            removeButton.addEventListener("click", function () {
                window.linksList.splice(index, 1);

                selectedLinks.innerHTML = "";

                window.linksList.forEach(function (url, newIndex) {

                    const newRow = document.createElement("div");

                    const newText = document.createElement("span");
                    newText.textContent = url;

                    const newRemoveButton = document.createElement("button");
                    newRemoveButton.type = "button";
                    newRemoveButton.textContent = "✕";

                    newRemoveButton.addEventListener("click", function () {
                        window.linksList.splice(newIndex, 1);
                        newRow.remove();
                    });

                    newRow.appendChild(newText);
                    newRow.appendChild(newRemoveButton);

                    selectedLinks.appendChild(newRow);
                });
            });

            linkRow.appendChild(linkText);
            linkRow.appendChild(removeButton);

            selectedLinks.appendChild(linkRow);
        });

    });

});

document.addEventListener("DOMContentLoaded", function () {

    const publishButton = document.getElementById("publish-post-button");
    const postContent = document.getElementById("post-content");

    publishButton.addEventListener("click", async function () {

        const content = postContent.value.trim();

        if (!content) {
            alert("Please write something before publishing.");
            return;
        }

        const { data: { user }, error: userError } =
            await supabaseClient.auth.getUser();

        if (userError || !user) {
            alert("You must be logged in to publish a post.");
            return;
        }

        const { data: profile, error: profileError } =
            await supabaseClient
                .from("profiles")
                .select("username")
                .eq("id", user.id)
                .single();

        if (profileError || !profile) {
            alert("Could not load your profile.");
            return;
        }

        const { data: post, error: postError } =
            await supabaseClient
                .from("posts")
                .insert({
                    user_id: user.id,
                    username: profile.username,
                    content: content
                })
                .select()
                .single();

        if (postError) {
            alert(postError.message);
            return;
        }

        for (const file of window.filesList) {

    const safeFileName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");

const filePath =
    user.id + "/" + crypto.randomUUID() + "-" + safeFileName;

    const { error: uploadError } =
        await supabaseClient.storage
            .from("post-media")
            .upload(filePath, file);

    if (uploadError) {
alert("Could not upload " + file.name + ": " + uploadError.message);        return;
    }

    const { error: mediaError } =
        await supabaseClient
            .from("post_media")
            .insert({
                post_id: post.id,
                file_path: filePath,
                file_type: file.type,
                original_name: file.name
            });

    if (mediaError) {
        alert("Could not save information for " + file.name + ".");
        return;
    }
}
        for (const url of window.linksList) {

    const { error: linkError } =
        await supabaseClient
            .from("post_links")
            .insert({
                post_id: post.id,
                url: url
            });

    if (linkError) {
        alert("Could not save link: " + linkError.message);
        return;
    }
}
       
        alert("Post published! 💗");
        postContent.value = "";
        window.filesList = [];
window.linksList = [];
document.getElementById("selected-files").innerHTML = "";
document.getElementById("selected-links").innerHTML = "";

    });

});

document.addEventListener("DOMContentLoaded", async function () {

    const postsContainer = document.getElementById("posts-container");

    const { data: posts, error } =
        await supabaseClient
            .from("posts")
            .select("*")
            .eq("deleted", false)
            .order("created_at", { ascending: false })
    .limit(20);

    if (error) {
        postsContainer.textContent = "Could not load posts.";
        return;
    }

    posts.forEach(function (post) {

        const postCard = document.createElement("article");

        const username = document.createElement("strong");
        username.textContent = post.username;

        const content = document.createElement("p");
        content.textContent = post.content;

        const date = document.createElement("small");
        date.textContent = new Date(post.created_at).toLocaleDateString();

        postCard.appendChild(username);
        postCard.appendChild(content);
        postCard.appendChild(date);

        postsContainer.appendChild(postCard);
    });

});

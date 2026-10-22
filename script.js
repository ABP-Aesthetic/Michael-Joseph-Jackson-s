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

    <p>I’m so glad you decided to join this community. I sincerely hope you find a little corner here where you can express and share ideas, thoughts and feelings with other fans like you. 💖</p>

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

// --- INICIO CARGA DE POSTS CON IMÁGENES Y LINKS ---
// --- INICIO CARGA DE POSTS (CUADRÍCULA Y MODAL) ---
document.addEventListener("DOMContentLoaded", async function () {
    const postsContainer = document.getElementById("posts-container");

    // 1. Crear la estructura de la ventana gigante (Modal) si no existe
    let postModal = document.getElementById("post-modal");
    if (!postModal) {
        postModal = document.createElement("div");
        postModal.id = "post-modal";
        postModal.innerHTML = `
            <div class="post-modal-content">
                <span class="close-modal" id="close-post-modal">&times;</span>
                <div id="modal-post-body"></div>
            </div>
        `;
        document.body.appendChild(postModal);
        
        document.getElementById("close-post-modal").addEventListener("click", () => postModal.style.display = "none");
        postModal.addEventListener("click", (e) => { if (e.target === postModal) postModal.style.display = "none"; });
    }

    const { data: posts, error } = await supabaseClient
        .from("posts").select("*").eq("deleted", false).order("created_at", { ascending: false }).limit(20);

    if (error) return postsContainer.textContent = "Error: " + error.message;

    const { data: { user } } = await supabaseClient.auth.getUser();
    postsContainer.innerHTML = "";

    for (const post of posts) {
        const postCard = document.createElement("article");
        postCard.className = "post-card";

        const { data: media } = await supabaseClient.from("post_media").select("*").eq("post_id", post.id);
        const { data: links } = await supabaseClient.from("post_links").select("*").eq("post_id", post.id);

        // --- DISEÑO DE LA MINIATURA (TARJETA PEQUEÑA) ---
        if (media && media.length > 0) {
            const { data: urlData } = supabaseClient.storage.from("post-media").getPublicUrl(media[0].file_path);
            
            const previewContainer = document.createElement("div");
            previewContainer.className = "media-preview";
            
            const img = document.createElement("img");
            img.src = urlData.publicUrl;
            previewContainer.appendChild(img);

            // Si hay más de 1 foto, ponemos el cartel de +X
            if (media.length > 1) {
                const badge = document.createElement("div");
                badge.className = "more-media-badge";
                badge.textContent = "+" + (media.length - 1);
                previewContainer.appendChild(badge);
            }
            postCard.appendChild(previewContainer);
        }

        const username = document.createElement("strong");
        username.textContent = post.username;
        username.style.marginBottom = "10px";
        
        const content = document.createElement("p");
        content.className = "post-text-preview";
        content.textContent = post.content;

        postCard.appendChild(username);
        postCard.appendChild(content);

        // --- ACCIÓN AL HACER CLIC: ABRIR EL POST COMPLETO ---
        postCard.addEventListener("click", () => {
            const modalBody = document.getElementById("modal-post-body");
            modalBody.innerHTML = `
                <h2 style="margin-top:0; color:#ff6b6b;">${post.username}</h2>
                <p id="modal-text-${post.id}" style="font-size:1.1em; line-height:1.6;">${post.content}</p>
                <div id="modal-media-container" style="display:flex; flex-direction:column; gap:15px; margin-top:20px;"></div>
                <div id="modal-links-container" style="margin-top:20px; display:flex; flex-direction:column; gap:10px;"></div>
                <div id="modal-actions" style="margin-top:25px; padding-top:20px; border-top:1px solid #ddd;"></div>
            `;

            // Cargar TODAS las imágenes en grande
            if (media) {
                const mediaContainer = modalBody.querySelector("#modal-media-container");
                media.forEach(m => {
                    const { data: uData } = supabaseClient.storage.from("post-media").getPublicUrl(m.file_path);
                    const fullImg = document.createElement("img");
                    fullImg.src = uData.publicUrl;
                    fullImg.style.width = "100%";
                    fullImg.style.borderRadius = "10px";
                    mediaContainer.appendChild(fullImg);
                });
            }

            // Cargar TODOS los enlaces
            if (links) {
                const linksContainer = modalBody.querySelector("#modal-links-container");
                links.forEach(l => {
                    const a = document.createElement("a");
                    a.href = l.url;
                    a.textContent = "🔗 " + l.url;
                    a.target = "_blank";
                    a.style.color = "#0066cc";
                    a.style.fontWeight = "bold";
                    a.style.wordBreak = "break-all";
                    linksContainer.appendChild(a);
                });
            }

            // Botones de edición si el post es tuyo
            if (user && user.id === post.user_id) {
                const actionsContainer = modalBody.querySelector("#modal-actions");
                
                // Editar Texto
                const editBtn = document.createElement("button");
                editBtn.textContent = "✏️ Edit Text";
                editBtn.style.marginRight = "10px";
                editBtn.onclick = () => {
                    const currentTextP = modalBody.querySelector(`#modal-text-${post.id}`);
                    if(!currentTextP) return;
                    
                    const textArea = document.createElement("textarea");
                    textArea.value = post.content;
                    textArea.style.width = "100%";
                    textArea.style.height = "120px";
                    
                    const saveBtn = document.createElement("button");
                    saveBtn.textContent = "✅ Save";
                    saveBtn.onclick = async () => {
                        const newText = textArea.value.trim();
                        if(!newText) return;
                        saveBtn.textContent = "Saving...";
                        const { error: updErr } = await supabaseClient.from("posts").update({ content: newText }).eq("id", post.id);
                        if(updErr) { alert("Error: " + updErr.message); saveBtn.textContent = "✅ Save"; return; }
                        
                        post.content = newText;
                        content.textContent = newText; // Actualiza la tarjeta pequeña
                        currentTextP.textContent = newText; // Actualiza el modal
                        textArea.replaceWith(currentTextP);
                        saveBtn.remove();
                    };
                    
                    currentTextP.replaceWith(textArea);
                    actionsContainer.appendChild(saveBtn);
                };
                
                // Eliminar Post
                const delBtn = document.createElement("button");
                delBtn.textContent = "🗑️ Delete Post";
                delBtn.onclick = async () => {
                    if(!confirm("Are you sure you want to delete this post?")) return;
                    await supabaseClient.from("posts").update({ deleted: true }).eq("id", post.id);
                    postCard.remove();
                    postModal.style.display = "none";
                };
                
                actionsContainer.appendChild(editBtn);
                actionsContainer.appendChild(delBtn);
            }
            
            postModal.style.display = "flex";
        });

        postsContainer.appendChild(postCard);
    }
});
// --- FIN NUEVA CARGA DE POSTS ---

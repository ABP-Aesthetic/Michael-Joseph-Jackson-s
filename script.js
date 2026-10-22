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

    if (publishButton) {
        publishButton.addEventListener("click", async function () {

            const content = postContent.value.trim();

            if (!content) {
                alert("Please write something before publishing.");
                return;
            }

            // Desactivar el botón para que no envíe publicaciones dobles/triples
            publishButton.disabled = true;
            publishButton.textContent = "Publishing...";

            try {
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

                // 1. Guardar Post
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

                if (postError) throw postError;

                // 2. Subir Archivos
                if (window.filesList && window.filesList.length > 0) {
                    for (const file of window.filesList) {
                        const safeFileName = file.name
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[^a-zA-Z0-9._-]/g, "_");

                        const filePath = user.id + "/" + crypto.randomUUID() + "-" + safeFileName;

                        const { error: uploadError } =
                            await supabaseClient.storage
                                .from("post-media")
                                .upload(filePath, file);

                        if (uploadError) throw uploadError;

                        const { error: mediaError } =
                            await supabaseClient
                                .from("post_media")
                                .insert({
                                    post_id: post.id,
                                    file_path: filePath,
                                    file_type: file.type,
                                    original_name: file.name
                                });

                        if (mediaError) throw mediaError;
                    }
                }

                // 3. Subir Enlaces
                if (window.linksList && window.linksList.length > 0) {
                    for (const url of window.linksList) {
                        const { error: linkError } =
                            await supabaseClient
                                .from("post_links")
                                .insert({
                                    post_id: post.id,
                                    url: url
                                });

                        if (linkError) throw linkError;
                    }
                }

                alert("Post published! 💗");

                // Limpiar campos
                postContent.value = "";
                window.filesList = [];
                window.linksList = [];
                
                const selectedFilesElem = document.getElementById("selected-files");
                const selectedLinksElem = document.getElementById("selected-links");
                if (selectedFilesElem) selectedFilesElem.innerHTML = "";
                if (selectedLinksElem) selectedLinksElem.innerHTML = "";

                // Recargar página limpia
                location.reload();

            } catch (err) {
                alert("Error publishing post: " + err.message);
            } finally {
                publishButton.disabled = false;
                publishButton.textContent = "Publish";
            }
        });
    }

});

// --- INICIO CARGA DE POSTS CON IMÁGENES Y LINKS ---
// --- INICIO CARGA DE POSTS (CUADRÍCULA Y MODAL) ---
document.addEventListener("DOMContentLoaded", async function () {
    const postsContainer = document.getElementById("posts-container");

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

        // MINIATURA DE LA TARJETA PEQUEÑA
        if (media && media.length > 0) {
            const { data: urlData } = supabaseClient.storage.from("post-media").getPublicUrl(media[0].file_path);
            const firstFile = media[0];
            
            const previewContainer = document.createElement("div");
            previewContainer.className = "media-preview";
            
            // Mostrar imagen, vídeo o icono de audio en la tarjeta exterior
            if (firstFile.file_type && firstFile.file_type.startsWith("video/")) {
                const video = document.createElement("video");
                video.src = urlData.publicUrl;
                video.muted = true;
                video.style.width = "100%";
                previewContainer.appendChild(video);
            } else if (firstFile.file_type && firstFile.file_type.startsWith("audio/")) {
                const audioBox = document.createElement("div");
                audioBox.style.cssText = "padding:20px; background:#f0f0f0; text-align:center; border-radius:8px;";
                audioBox.textContent = "🎵 Audio file";
                previewContainer.appendChild(audioBox);
            } else {
                const img = document.createElement("img");
                img.src = urlData.publicUrl;
                previewContainer.appendChild(img);
            }

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

        // ABRIR MODAL COMPLETO
        postCard.addEventListener("click", () => {
            const modalBody = document.getElementById("modal-post-body");
            modalBody.innerHTML = `
                <h2 style="margin-top:0; color:#ff6b6b;">${post.username}</h2>
                <p id="modal-text-${post.id}" style="font-size:1.1em; line-height:1.6;">${post.content}</p>
                <div id="modal-media-container" style="display:flex; flex-direction:column; gap:15px; margin-top:20px;"></div>
                <div id="modal-links-container" style="margin-top:20px; display:flex; flex-direction:column; gap:10px;"></div>
                <div id="modal-actions" style="margin-top:25px; padding-top:20px; border-top:1px solid #ddd;"></div>
            `;

            // VISUALIZACIÓN MULTIMEDIA EN EL MODAL
            if (media) {
                const mediaContainer = modalBody.querySelector("#modal-media-container");
                media.forEach(m => {
                    const { data: uData } = supabaseClient.storage.from("post-media").getPublicUrl(m.file_path);
                    const wrapper = document.createElement("div");
                    wrapper.setAttribute("data-media-id", m.id);
                    const fileType = m.file_type || "";

                    if (fileType.startsWith("image/")) {
                        // Imagen
                        const fullImg = document.createElement("img");
                        fullImg.src = uData.publicUrl;
                        fullImg.style.width = "100%";
                        fullImg.style.borderRadius = "10px";
                        wrapper.appendChild(fullImg);
                    } else if (fileType.startsWith("video/")) {
                        // Vídeo (mp4, webm, etc.)
                        const video = document.createElement("video");
                        video.src = uData.publicUrl;
                        video.controls = true;
                        video.style.width = "100%";
                        video.style.borderRadius = "10px";
                        wrapper.appendChild(video);
                    } else if (fileType.startsWith("audio/")) {
                        // Audio (mp3, m4a, wav, etc.)
                        const audio = document.createElement("audio");
                        audio.src = uData.publicUrl;
                        audio.controls = true;
                        audio.style.width = "100%";
                        wrapper.appendChild(audio);
                    } else {
                        // Otros archivos (documentos, HTML, etc.) -> Enlace para abrir/descargar
                        const fileLink = document.createElement("a");
                        fileLink.href = uData.publicUrl;
                        fileLink.target = "_blank";
                        fileLink.textContent = "📄 " + (m.original_name || "View/Download file");
                        fileLink.style.cssText = "display:inline-block; padding:10px; background:#eef; border-radius:5px; color:#0066cc; text-decoration:none;";
                        wrapper.appendChild(fileLink);
                    }

                    mediaContainer.appendChild(wrapper);
                });
            }

            // ENLACES EXTERNOS
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

            // BOTONES DE EDICIÓN
            if (user && user.id === post.user_id) {
                const actionsContainer = modalBody.querySelector("#modal-actions");
                
                const editBtn = document.createElement("button");
                editBtn.textContent = "✏️ Edit Post";
                editBtn.style.marginRight = "10px";

                editBtn.onclick = () => {
                    actionsContainer.innerHTML = "";

                    const currentTextP = modalBody.querySelector(`#modal-text-${post.id}`);
                    const mediaContainer = modalBody.querySelector("#modal-media-container");
                    const linksContainer = modalBody.querySelector("#modal-links-container");

                    let mediaToDelete = [];
                    let linksToDelete = [];
                    let editFilesList = [];
                    let editLinksList = [];

                    const textArea = document.createElement("textarea");
                    textArea.value = post.content;
                    textArea.style.width = "100%";
                    textArea.style.height = "100px";
                    textArea.style.marginBottom = "15px";
                    currentTextP.replaceWith(textArea);

                    if (media && media.length > 0) {
                        media.forEach(m => {
                            const wrapper = mediaContainer.querySelector(`[data-media-id="${m.id}"]`);
                            if (wrapper && !wrapper.querySelector(".edit-del-btn")) {
                                wrapper.style.position = "relative";
                                const delBtn = document.createElement("button");
                                delBtn.className = "edit-del-btn";
                                delBtn.textContent = "✕ Remove";
                                delBtn.style.cssText = "position:absolute; top:10px; right:10px; background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; z-index:10;";
                                
                                delBtn.onclick = () => {
                                    mediaToDelete.push(m);
                                    wrapper.style.opacity = "0.3";
                                    delBtn.disabled = true;
                                    delBtn.textContent = "Marked for deletion";
                                };
                                wrapper.appendChild(delBtn);
                            }
                        });
                    }

                    if (links && links.length > 0) {
                        linksContainer.querySelectorAll("a").forEach((aTag, idx) => {
                            const l = links[idx];
                            if (!l) return;
                            const delLinkBtn = document.createElement("button");
                            delLinkBtn.textContent = "✕";
                            delLinkBtn.style.cssText = "margin-left:10px; background:#ff4d4d; color:white; border:none; border-radius:3px; cursor:pointer;";
                            
                            delLinkBtn.onclick = () => {
                                linksToDelete.push(l.id);
                                aTag.style.textDecoration = "line-through";
                                aTag.style.color = "gray";
                                delLinkBtn.disabled = true;
                            };
                            aTag.after(delLinkBtn);
                        });
                    }

                    const dropZoneEdit = document.createElement("div");
                    dropZoneEdit.style.cssText = "border: 2px dashed #ccc; padding: 15px; text-align: center; border-radius: 8px; cursor: pointer; margin-top: 15px; background: #fafafa;";
                    dropZoneEdit.innerHTML = "<p style='margin:0;'>💾 Upload files or Drag & drop files here</p>";

                    const fileInputEdit = document.createElement("input");
                    fileInputEdit.type = "file";
                    fileInputEdit.multiple = true;
                    fileInputEdit.accept = "*/*";
                    fileInputEdit.style.display = "none";

                    const editFilesPreview = document.createElement("div");
                    editFilesPreview.style.marginTop = "10px";

                    const renderEditFiles = () => {
                        editFilesPreview.innerHTML = "";
                        editFilesList.forEach((file, index) => {
                            const row = document.createElement("div");
                            row.style.margin = "5px 0";
                            row.textContent = "📁 " + file.name + " ";
                            const removeBtn = document.createElement("button");
                            removeBtn.textContent = "✕";
                            removeBtn.style.cssText = "background:none; border:none; color:red; cursor:pointer; font-weight:bold;";
                            removeBtn.onclick = () => { editFilesList.splice(index, 1); renderEditFiles(); };
                            row.appendChild(removeBtn);
                            editFilesPreview.appendChild(row);
                        });
                    };

                    dropZoneEdit.onclick = () => fileInputEdit.click();
                    fileInputEdit.onchange = (e) => {
                        editFilesList.push(...Array.from(e.target.files));
                        renderEditFiles();
                    };

                    dropZoneEdit.ondragover = (e) => { e.preventDefault(); dropZoneEdit.style.background = "#eee"; };
                    dropZoneEdit.ondragleave = () => { dropZoneEdit.style.background = "#fafafa"; };
                    dropZoneEdit.ondrop = (e) => {
                        e.preventDefault();
                        dropZoneEdit.style.background = "#fafafa";
                        editFilesList.push(...Array.from(e.dataTransfer.files));
                        renderEditFiles();
                    };

                    const linkSection = document.createElement("div");
                    linkSection.style.marginTop = "15px";
                    linkSection.innerHTML = `
                        <div style="display:flex; gap:10px;">
                            <input type="url" id="edit-link-input" placeholder="Paste a link..." style="flex:1; padding:8px;">
                            <button type="button" id="edit-add-link-btn">🔗 Add link</button>
                        </div>
                        <div id="edit-links-preview" style="margin-top:10px;"></div>
                    `;

                    actionsContainer.appendChild(document.createElement("hr"));
                    actionsContainer.appendChild(dropZoneEdit);
                    actionsContainer.appendChild(fileInputEdit);
                    actionsContainer.appendChild(editFilesPreview);
                    actionsContainer.appendChild(linkSection);

                    const linkInput = linkSection.querySelector("#edit-link-input");
                    const addLinkBtn = linkSection.querySelector("#edit-add-link-btn");
                    const linksPreview = linkSection.querySelector("#edit-links-preview");

                    const renderEditLinks = () => {
                        linksPreview.innerHTML = "";
                        editLinksList.forEach((url, index) => {
                            const row = document.createElement("div");
                            row.style.margin = "5px 0";
                            row.textContent = "🔗 " + url + " ";
                            const removeBtn = document.createElement("button");
                            removeBtn.textContent = "✕";
                            removeBtn.style.cssText = "background:none; border:none; color:red; cursor:pointer; font-weight:bold;";
                            removeBtn.onclick = () => { editLinksList.splice(index, 1); renderEditLinks(); };
                            row.appendChild(removeBtn);
                            linksPreview.appendChild(row);
                        });
                    };

                    addLinkBtn.onclick = () => {
                        const val = linkInput.value.trim();
                        if (val) {
                            editLinksList.push(val);
                            linkInput.value = "";
                            renderEditLinks();
                        }
                    };

                    const saveAllBtn = document.createElement("button");
                    saveAllBtn.textContent = "✅ Save Changes";
                    saveAllBtn.style.cssText = "margin-top: 20px; padding: 10px 20px; background-color: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;";

                    saveAllBtn.onclick = async () => {
                        const newText = textArea.value.trim();
                        if (!newText) return alert("Post text cannot be empty.");

                        saveAllBtn.disabled = true;
                        saveAllBtn.textContent = "Saving...";

                        try {
                            await supabaseClient.from("posts").update({ content: newText }).eq("id", post.id);

                            for (const m of mediaToDelete) {
                                await supabaseClient.from("post_media").delete().eq("id", m.id);
                                await supabaseClient.storage.from("post-media").remove([m.file_path]);
                            }

                            for (const linkId of linksToDelete) {
                                await supabaseClient.from("post_links").delete().eq("id", linkId);
                            }

                            for (const file of editFilesList) {
                                const safeName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "_");
                                const filePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;

                                const { error: uploadError } = await supabaseClient.storage.from("post-media").upload(filePath, file);
                                if (uploadError) throw new Error("Storage error: " + uploadError.message);

                                await supabaseClient.from("post_media").insert({
                                    post_id: post.id,
                                    file_path: filePath,
                                    file_type: file.type,
                                    original_name: file.name
                                });
                            }

                            for (const url of editLinksList) {
                                await supabaseClient.from("post_links").insert({
                                    post_id: post.id,
                                    url: url
                                });
                            }

                            alert("Post updated successfully! ✨");
                            location.reload();

                        } catch (err) {
                            alert("Error updating post: " + err.message);
                            saveAllBtn.disabled = false;
                            saveAllBtn.textContent = "✅ Save Changes";
                        }
                    };

                    actionsContainer.appendChild(saveAllBtn);
                };

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
// --- FIN CARGA DE POSTS ---

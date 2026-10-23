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

    <p>You’ve just joined us as <a href="profile.html?user=${encodeURIComponent(profile.username)}" style="color: #ff6b6b; font-weight: bold; text-decoration: none;">${profile.username}</a>.</p>
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
                const checkNoAi = document.getElementById("check-no-ai")?.checked ?? true;
                const checkYouthFriendly = document.getElementById("check-youth-friendly")?.checked ?? true;

                const { data: post, error: postError } =
                    await supabaseClient
                        .from("posts")
                        .insert({
                            user_id: user.id,
                            username: profile.username,
                            content: content,
                            no_ai: checkNoAi,
                            youth_friendly: checkYouthFriendly
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
// --- INICIO CARGA DE POSTS (SISTEMA COMPLETO CON EDICIÓN DE LINKS Y ADJUNTOS EN COMENTARIOS) ---
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
        // Obtener el nivel actual seleccionado por el usuario ("simple" o "complete")
        const currentLevel = localStorage.getItem("siteLevel") || "simple";

        // Si el post tiene marcado NO a la IA o NO a apto para jóvenes, y el usuario está en nivel "simple", nos saltamos este post
        if (currentLevel === "simple" && (post.no_ai === false || post.youth_friendly === false)) {
            continue;
        }
        const postCard = document.createElement("article");
        postCard.className = "post-card";
        postCard.style.position = "relative";

        const { data: media } = await supabaseClient.from("post_media").select("*").eq("post_id", post.id);
        const { data: links } = await supabaseClient.from("post_links").select("*").eq("post_id", post.id);

        const postDate = new Date(post.created_at).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        if (media && media.length > 0) {
            const { data: urlData } = supabaseClient.storage.from("post-media").getPublicUrl(media[0].file_path);
            const firstFile = media[0];
            const previewContainer = document.createElement("div");
            previewContainer.className = "media-preview";
            
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

        const username = document.createElement("a");
username.textContent = post.username;
username.href = `profile.html?user=${encodeURIComponent(post.username)}`;
username.style.cssText = "color: #333; text-decoration: none; font-weight: bold; cursor: pointer;";
username.onclick = (e) => e.stopPropagation(); // Evita que abra el modal del post

        const dateSpan = document.createElement("span");
        dateSpan.style.cssText = "font-size:0.8em; color:#888; margin-bottom:8px; display:block;";
        dateSpan.textContent = postDate;
        
        const content = document.createElement("p");
        content.className = "post-text-preview";
        content.textContent = post.content;

        postCard.appendChild(username);
        postCard.appendChild(dateSpan);
        postCard.appendChild(content);
// Crear contenedor de avisos/burbujas (badges)
        const warningsContainer = document.createElement("div");
        warningsContainer.style.cssText = "display: flex; gap: 5px; margin-top: 5px; flex-wrap: wrap;";

        if (post.no_ai === false) {
            const aiBadge = document.createElement("span");
            aiBadge.textContent = "⚠️ AI / Edit";
            aiBadge.style.cssText = "background: #fff3cd; color: #856404; font-size: 0.75em; padding: 2px 6px; border-radius: 12px; font-weight: bold;";
            warningsContainer.appendChild(aiBadge);
        }

        if (post.youth_friendly === false) {
            const youthBadge = document.createElement("span");
            youthBadge.textContent = "🔞 Not for young Moonwalkers";
            youthBadge.style.cssText = "background: #f8d7da; color: #721c24; font-size: 0.75em; padding: 2px 6px; border-radius: 12px; font-weight: bold;";
            warningsContainer.appendChild(youthBadge);
        }

        postCard.appendChild(warningsContainer);
        
        const menuBtn = document.createElement("button");
        menuBtn.textContent = "⋮";
        menuBtn.style.cssText = "position:absolute; top:10px; right:10px; background:rgba(255,255,255,0.8); border:none; font-size:1.4em; cursor:pointer; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; z-index:5;";
        
        const dropMenu = document.createElement("div");
        dropMenu.style.cssText = "display:none; position:absolute; top:45px; right:10px; background:white; border:1px solid #ccc; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.1); z-index:10; padding:5px 0;";
        dropMenu.innerHTML = `
            <button class="menu-opt-like" style="display:block; width:100%; text-align:left; background:none; border:none; padding:8px 15px; cursor:pointer;">👍 Like</button>
            <button class="menu-opt-dislike" style="display:block; width:100%; text-align:left; background:none; border:none; padding:8px 15px; cursor:pointer;">👎 Dislike</button>
            <button class="menu-opt-comment" style="display:block; width:100%; text-align:left; background:none; border:none; padding:8px 15px; cursor:pointer;">💬 Comment</button>
        `;

        menuBtn.onclick = (e) => {
            e.stopPropagation();
            dropMenu.style.display = dropMenu.style.display === "none" ? "block" : "none";
        };

        document.addEventListener("click", () => dropMenu.style.display = "none");

        dropMenu.querySelector(".menu-opt-like").onclick = (e) => { e.stopPropagation(); togglePostReaction(post.id, 'like'); };
        dropMenu.querySelector(".menu-opt-dislike").onclick = (e) => { e.stopPropagation(); togglePostReaction(post.id, 'dislike'); };
        dropMenu.querySelector(".menu-opt-comment").onclick = (e) => { e.stopPropagation(); openPostModal(post, media, links, postDate, true); };

        postCard.appendChild(menuBtn);
        postCard.appendChild(dropMenu);

        postCard.addEventListener("click", () => openPostModal(post, media, links, postDate, false));
        postsContainer.appendChild(postCard);
    }

    async function togglePostReaction(postId, type) {
        if (!user) return alert("Please log in to react.");
        const { data: existing } = await supabaseClient.from("post_reactions").select("*").eq("post_id", postId).eq("user_id", user.id).single();
        if (existing) {
            if (existing.type === type) {
                await supabaseClient.from("post_reactions").delete().eq("id", existing.id);
            } else {
                await supabaseClient.from("post_reactions").update({ type }).eq("id", existing.id);
            }
        } else {
            await supabaseClient.from("post_reactions").insert({ post_id: postId, user_id: user.id, type });
        }
        location.reload();
    }

    async function openPostModal(post, media, links, postDate, focusComment = false) {
        const modalBody = document.getElementById("modal-post-body");
        modalBody.innerHTML = `
            <h2 style="margin-top:0; color:#ff6b6b; margin-bottom:5px;">${post.username}</h2>
            <small style="color:#888; display:block; margin-bottom:15px;">📅 ${postDate}</small>
            <p id="modal-text-${post.id}" style="font-size:1.1em; line-height:1.6;">${post.content}</p>
            <div id="modal-media-container" style="display:flex; flex-direction:column; gap:15px; margin-top:20px;"></div>
            <div id="modal-links-container" style="margin-top:20px; display:flex; flex-direction:column; gap:10px;"></div>
            
            <div id="post-reactions-bar" style="display:flex; gap:20px; align-items:center; margin-top:20px; padding:10px 0; border-top:1px solid #eee; border-bottom:1px solid #eee;">
                <button id="post-like-btn" style="background:none; border:none; cursor:pointer; font-size:1.2em;">👍 <span id="post-like-count">0</span></button>
                <button id="post-dislike-btn" style="background:none; border:none; cursor:pointer; font-size:1.2em;">👎 <span id="post-dislike-count">0</span></button>
            </div>

            <div id="modal-actions" style="margin-top:15px; padding-top:10px;"></div>

            <div id="comments-section" style="margin-top:25px;">
                <h3>Comments</h3>
                <div id="comments-list" style="display:flex; flex-direction:column; gap:15px; margin-bottom:20px;"></div>
                
                <div id="add-comment-box" style="background:#f9f9f9; padding:15px; border-radius:8px;">
                    <textarea id="comment-text" placeholder="Write a comment..." style="width:100%; height:60px; padding:8px; box-sizing:border-box;"></textarea>
                    
                    <div style="display:flex; gap:10px; margin-top:10px; align-items:center;">
                        <input type="file" id="comment-files" multiple accept="*/*" style="display:none;">
                        <button type="button" id="comment-file-btn">📁 Add Media</button>
                        <input type="url" id="comment-link-input" placeholder="Paste link..." style="flex:1; padding:5px;">
                        <button type="button" id="comment-add-link-btn">🔗 Link</button>
                    </div>
                    <div id="comment-files-preview" style="font-size:0.85em; margin-top:5px;"></div>
                    <div id="comment-links-preview" style="font-size:0.85em; margin-top:5px;"></div>
                    
                    <button id="submit-comment-btn" style="margin-top:10px; padding:8px 15px; background:#ff6b6b; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">Comment</button>
                </div>
            </div>
        `;

        const { data: reactions } = await supabaseClient.from("post_reactions").select("*").eq("post_id", post.id);
        const likes = reactions ? reactions.filter(r => r.type === 'like') : [];
        const dislikes = reactions ? reactions.filter(r => r.type === 'dislike') : [];

        const likeBtn = modalBody.querySelector("#post-like-btn");
        const dislikeBtn = modalBody.querySelector("#post-dislike-btn");
        
        modalBody.querySelector("#post-like-count").textContent = likes.length;
        modalBody.querySelector("#post-dislike-count").textContent = dislikes.length;

        if (user) {
            const userReaction = reactions ? reactions.find(r => r.user_id === user.id) : null;
            if (userReaction?.type === 'like') likeBtn.innerHTML = `❤️ <span id="post-like-count">${likes.length}</span>`;
            if (userReaction?.type === 'dislike') dislikeBtn.innerHTML = `🖤 <span id="post-dislike-count">${dislikes.length}</span>`;
        }

        likeBtn.onclick = async () => { await togglePostReaction(post.id, 'like'); openPostModal(post, media, links, postDate); };
        dislikeBtn.onclick = async () => { await togglePostReaction(post.id, 'dislike'); openPostModal(post, media, links, postDate); };

        if (media) {
            const mediaContainer = modalBody.querySelector("#modal-media-container");
            media.forEach(m => {
                const { data: uData } = supabaseClient.storage.from("post-media").getPublicUrl(m.file_path);
                const wrapper = document.createElement("div");
                wrapper.setAttribute("data-media-id", m.id);
                const fileType = m.file_type || "";

                if (fileType.startsWith("image/")) {
                    const fullImg = document.createElement("img");
                    fullImg.src = uData.publicUrl;
                    fullImg.style.width = "100%";
                    fullImg.style.borderRadius = "10px";
                    wrapper.appendChild(fullImg);
                } else if (fileType.startsWith("video/")) {
                    const video = document.createElement("video");
                    video.src = uData.publicUrl;
                    video.controls = true;
                    video.style.width = "100%";
                    wrapper.appendChild(video);
                } else if (fileType.startsWith("audio/")) {
                    const audio = document.createElement("audio");
                    audio.src = uData.publicUrl;
                    audio.controls = true;
                    audio.style.width = "100%";
                    wrapper.appendChild(audio);
                } else {
                    const fileLink = document.createElement("a");
                    fileLink.href = uData.publicUrl;
                    fileLink.target = "_blank";
                    fileLink.textContent = "📄 " + (m.original_name || "View file");
                    wrapper.appendChild(fileLink);
                }
                mediaContainer.appendChild(wrapper);
            });
        }

        if (links) {
            const linksContainer = modalBody.querySelector("#modal-links-container");
            links.forEach(l => {
                const a = document.createElement("a");
                a.href = l.url;
                a.textContent = "🔗 " + l.url;
                a.target = "_blank";
                a.setAttribute("data-link-id", l.id);
                linksContainer.appendChild(a);
            });
        }

        // EDICIÓN DE POSTS COMPLETA (TEXTO, FOTOS Y LINKS)
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
                textArea.style.cssText = "width:100%; height:80px; margin-bottom:15px;";
                currentTextP.replaceWith(textArea);

                if (media && media.length > 0) {
                    media.forEach(m => {
                        const wrapper = mediaContainer.querySelector(`[data-media-id="${m.id}"]`);
                        if (wrapper && !wrapper.querySelector(".edit-del-btn")) {
                            wrapper.style.position = "relative";
                            const delBtn = document.createElement("button");
                            delBtn.className = "edit-del-btn";
                            delBtn.textContent = "✕ Remove";
                            delBtn.style.cssText = "position:absolute; top:10px; right:10px; background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;";
                            delBtn.onclick = () => {
                                mediaToDelete.push(m);
                                wrapper.style.opacity = "0.3";
                                delBtn.disabled = true;
                            };
                            wrapper.appendChild(delBtn);
                        }
                    });
                }

                // Permite eliminar links existentes en el post
                if (links && links.length > 0) {
                    linksContainer.querySelectorAll("a").forEach((aTag) => {
                        const lId = aTag.getAttribute("data-link-id");
                        if (!lId || aTag.querySelector(".del-link-btn")) return;
                        const delLinkBtn = document.createElement("button");
                        delLinkBtn.className = "del-link-btn";
                        delLinkBtn.textContent = "✕";
                        delLinkBtn.style.cssText = "margin-left:10px; background:#ff4d4d; color:white; border:none; border-radius:3px; cursor:pointer;";
                        delLinkBtn.onclick = () => {
                            linksToDelete.push(lId);
                            aTag.style.textDecoration = "line-through";
                            delLinkBtn.disabled = true;
                        };
                        aTag.after(delLinkBtn);
                    });
                }

                // Caja para añadir fotos nuevas en la edición del post
                const dropZoneEdit = document.createElement("div");
                dropZoneEdit.style.cssText = "border: 2px dashed #ccc; padding: 10px; text-align: center; border-radius: 8px; cursor: pointer; margin-top: 10px;";
                dropZoneEdit.innerHTML = "📁 Drag new files here or click";

                const fileInputEdit = document.createElement("input");
                fileInputEdit.type = "file";
                fileInputEdit.multiple = true;
                fileInputEdit.style.display = "none";
                const editFilesPreview = document.createElement("div");

                dropZoneEdit.onclick = () => fileInputEdit.click();
                fileInputEdit.onchange = (e) => {
                    editFilesList.push(...Array.from(e.target.files));
                    editFilesPreview.textContent = editFilesList.map(f => f.name).join(", ");
                };

                // Añadir links nuevos en la edición del post
                const newLinkBox = document.createElement("div");
                newLinkBox.style.cssText = "display:flex; gap:10px; margin-top:10px;";
                newLinkBox.innerHTML = `
                    <input type="url" class="new-post-link-in" placeholder="Add new link..." style="flex:1; padding:5px;">
                    <button type="button" class="add-new-post-link-btn">🔗 Add</button>
                `;
                const newLinksPreview = document.createElement("div");
                newLinksPreview.style.fontSize = "0.85em";

                newLinkBox.querySelector(".add-new-post-link-btn").onclick = () => {
                    const lVal = newLinkBox.querySelector(".new-post-link-in").value.trim();
                    if (lVal) {
                        editLinksList.push(lVal);
                        newLinkBox.querySelector(".new-post-link-in").value = "";
                        newLinksPreview.textContent = editLinksList.join(", ");
                    }
                };

                const saveAllBtn = document.createElement("button");
                saveAllBtn.textContent = "✅ Save Changes";
                saveAllBtn.style.cssText = "margin-top:15px; padding:8px 15px; background:#ff6b6b; color:white; border:none; border-radius:5px; cursor:pointer;";

                saveAllBtn.onclick = async () => {
                    const newText = textArea.value.trim();
                    if (!newText) return alert("Text cannot be empty.");
                    
                    await supabaseClient.from("posts").update({ content: newText }).eq("id", post.id);

                    for (const m of mediaToDelete) {
                        await supabaseClient.from("post_media").delete().eq("id", m.id);
                        await supabaseClient.storage.from("post-media").remove([m.file_path]);
                    }
                    for (const linkId of linksToDelete) {
                        await supabaseClient.from("post_links").delete().eq("id", linkId);
                    }
                    for (const file of editFilesList) {
                        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
                        const filePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;
                        await supabaseClient.storage.from("post-media").upload(filePath, file);
                        await supabaseClient.from("post_media").insert({
                            post_id: post.id, file_path: filePath, file_type: file.type, original_name: file.name
                        });
                    }
                    for (const url of editLinksList) {
                        await supabaseClient.from("post_links").insert({ post_id: post.id, url: url });
                    }

                    alert("Post updated! ✨");
                    location.reload();
                };

                actionsContainer.appendChild(dropZoneEdit);
                actionsContainer.appendChild(fileInputEdit);
                actionsContainer.appendChild(editFilesPreview);
                actionsContainer.appendChild(newLinkBox);
                actionsContainer.appendChild(newLinksPreview);
                actionsContainer.appendChild(saveAllBtn);
            };

            const delBtn = document.createElement("button");
            delBtn.textContent = "🗑️ Delete Post";
            delBtn.onclick = async () => {
                if(!confirm("Are you sure?")) return;
                await supabaseClient.from("posts").update({ deleted: true }).eq("id", post.id);
                location.reload();
            };

            actionsContainer.appendChild(editBtn);
            actionsContainer.appendChild(delBtn);
        }

        loadComments(post.id);

        let commentFiles = [];
        let commentLinks = [];

        const fileBtn = modalBody.querySelector("#comment-file-btn");
        const fileInput = modalBody.querySelector("#comment-files");
        const filesPreview = modalBody.querySelector("#comment-files-preview");
        
        fileBtn.onclick = () => fileInput.click();
        fileInput.onchange = (e) => {
            commentFiles.push(...Array.from(e.target.files));
            filesPreview.textContent = commentFiles.map(f => "📁 " + f.name).join(", ");
        };

        const linkInput = modalBody.querySelector("#comment-link-input");
        const addLinkBtn = modalBody.querySelector("#comment-add-link-btn");
        const linksPreview = modalBody.querySelector("#comment-links-preview");

        addLinkBtn.onclick = () => {
            const val = linkInput.value.trim();
            if (val) {
                commentLinks.push(val);
                linkInput.value = "";
                linksPreview.textContent = commentLinks.map(l => "🔗 " + l).join(", ");
            }
        };

        modalBody.querySelector("#submit-comment-btn").onclick = async () => {
            if (!user) return alert("Log in to comment.");
            const text = modalBody.querySelector("#comment-text").value.trim();
            if (!text) return alert("Write something.");

            const { data: newComment, error: cErr } = await supabaseClient.from("post_comments").insert({
                post_id: post.id,
                user_id: user.id,
                username: user.user_metadata?.username || user.email.split('@')[0],
                content: text
            }).select().single();

            if (cErr) return alert("Error: " + cErr.message);

            for (const file of commentFiles) {
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
                const filePath = `comments/${user.id}/${crypto.randomUUID()}-${safeName}`;
                await supabaseClient.storage.from("post-media").upload(filePath, file);
                await supabaseClient.from("comment_media").insert({
                    comment_id: newComment.id, file_path: filePath, file_type: file.type, original_name: file.name
                });
            }

            for (const url of commentLinks) {
                await supabaseClient.from("comment_links").insert({ comment_id: newComment.id, url: url });
            }

            loadComments(post.id);
            modalBody.querySelector("#comment-text").value = "";
            commentFiles = [];
            commentLinks = [];
            filesPreview.textContent = "";
            linksPreview.textContent = "";
        };

        postModal.style.display = "flex";
        if (focusComment) modalBody.querySelector("#comment-text").focus();
    }

    async function loadComments(postId) {
        const list = document.getElementById("comments-list");
        list.innerHTML = "Loading comments...";

        const { data: comments } = await supabaseClient
            .from("post_comments").select("*").eq("post_id", postId).order("created_at", { ascending: true });

        list.innerHTML = "";
        if (!comments || comments.length === 0) {
            list.innerHTML = "<p style='color:#888;'>No comments yet.</p>";
            return;
        }

        const mainComments = comments.filter(c => !c.parent_comment_id);
        for (const c of mainComments) {
            const commentEl = await renderCommentTree(c, comments);
            list.appendChild(commentEl);
        }
    }

    // RENDERIZAR Y EDITAR COMENTARIOS / RESPUESTAS (INCLUYENDO SUS ARCHIVOS Y LINKS)
    async function renderCommentTree(comment, allComments) {
        const container = document.createElement("div");
        container.style.cssText = "background:#fff; border:1px solid #eee; padding:12px; border-radius:8px;";

        const head = document.createElement("div");
        head.style.cssText = "display:flex; justify-content:space-between; font-size:0.9em;";
        head.innerHTML = `<strong>${comment.username}</strong> <small style='color:#888;'>${new Date(comment.created_at).toLocaleDateString()}</small>`;
        
        const body = document.createElement("p");
        body.style.cssText = "margin:8px 0;";
        body.textContent = comment.content;

        container.appendChild(head);
        container.appendChild(body);

        const mediaBox = document.createElement("div");
        mediaBox.className = "comment-media-box";
        container.appendChild(mediaBox);

        const linksBox = document.createElement("div");
        linksBox.className = "comment-links-box";
        container.appendChild(linksBox);

        async function refreshCommentAttachments() {
            mediaBox.innerHTML = "";
            linksBox.innerHTML = "";

            const { data: cMedia } = await supabaseClient.from("comment_media").select("*").eq("comment_id", comment.id);
            if (cMedia && cMedia.length > 0) {
                cMedia.forEach(m => {
                    const { data: uData } = supabaseClient.storage.from("post-media").getPublicUrl(m.file_path);
                    const itemWrap = document.createElement("div");
                    itemWrap.setAttribute("data-cmedia-id", m.id);

                    if (m.file_type?.startsWith("image/")) {
                        const img = document.createElement("img");
                        img.src = uData.publicUrl;
                        img.style.cssText = "max-width:200px; border-radius:5px; display:block;";
                        itemWrap.appendChild(img);
                    } else if (m.file_type?.startsWith("video/")) {
                        const vid = document.createElement("video");
                        vid.src = uData.publicUrl;
                        vid.controls = true;
                        vid.style.cssText = "max-width:250px; display:block;";
                        itemWrap.appendChild(vid);
                    } else if (m.file_type?.startsWith("audio/")) {
                        const aud = document.createElement("audio");
                        aud.src = uData.publicUrl;
                        aud.controls = true;
                        itemWrap.appendChild(aud);
                    }
                    mediaBox.appendChild(itemWrap);
                });
            }

            const { data: cLinks } = await supabaseClient.from("comment_links").select("*").eq("comment_id", comment.id);
            if (cLinks && cLinks.length > 0) {
                cLinks.forEach(l => {
                    const aWrap = document.createElement("div");
                    aWrap.setAttribute("data-clink-id", l.id);
                    const a = document.createElement("a");
                    a.href = l.url;
                    a.target = "_blank";
                    a.textContent = "🔗 " + l.url;
                    a.style.cssText = "font-size:0.85em; color:#0066cc;";
                    aWrap.appendChild(a);
                    linksBox.appendChild(aWrap);
                });
            }
        }

        await refreshCommentAttachments();

        // REACCIONES EN COMENTARIO
        const { data: cReactions } = await supabaseClient.from("comment_reactions").select("*").eq("comment_id", comment.id);
        const cLikes = cReactions ? cReactions.filter(r => r.type === 'like').length : 0;
        const cDislikes = cReactions ? cReactions.filter(r => r.type === 'dislike').length : 0;

        const reactBar = document.createElement("div");
        reactBar.style.cssText = "display:flex; gap:15px; font-size:0.85em; margin-top:8px; color:#555; align-items:center;";
        
        let userCReaction = user && cReactions ? cReactions.find(r => r.user_id === user.id)?.type : null;
        
        const likeBtn = document.createElement("span");
        likeBtn.style.cursor = "pointer";
        likeBtn.innerHTML = `${userCReaction === 'like' ? '❤️' : '🤍'} ${cLikes}`;
        likeBtn.onclick = async () => {
            if (!user) return alert("Log in.");
            if (userCReaction === 'like') {
                await supabaseClient.from("comment_reactions").delete().eq("comment_id", comment.id).eq("user_id", user.id);
            } else {
                await supabaseClient.from("comment_reactions").upsert({ comment_id: comment.id, user_id: user.id, type: 'like' });
            }
            loadComments(comment.post_id);
        };

        const dislikeBtn = document.createElement("span");
        dislikeBtn.style.cursor = "pointer";
        dislikeBtn.innerHTML = `${userCReaction === 'dislike' ? '🖤' : '🤍'} ${cDislikes}`;
        dislikeBtn.onclick = async () => {
            if (!user) return alert("Log in.");
            if (userCReaction === 'dislike') {
                await supabaseClient.from("comment_reactions").delete().eq("comment_id", comment.id).eq("user_id", user.id);
            } else {
                await supabaseClient.from("comment_reactions").upsert({ comment_id: comment.id, user_id: user.id, type: 'dislike' });
            }
            loadComments(comment.post_id);
        };

        const replyBtn = document.createElement("span");
        replyBtn.textContent = "💬 Reply";
        replyBtn.style.cursor = "pointer";

        reactBar.appendChild(likeBtn);
        reactBar.appendChild(dislikeBtn);
        reactBar.appendChild(replyBtn);

        // EDICIÓN AVANZADA DE COMENTARIO (TEXTO + BORRAR/AÑADIR MULTIMEDIA Y LINKS)
        if (user && user.id === comment.user_id) {
            const editCBtn = document.createElement("span");
            editCBtn.textContent = "✏️ Edit";
            editCBtn.style.cssText = "cursor:pointer; color:#0066cc;";
            
            editCBtn.onclick = async () => {
                const editBox = document.createElement("div");
                editBox.style.cssText = "margin-top:8px; background:#f0f0f0; padding:10px; border-radius:5px;";
                
                let cMediaDel = [];
                let cLinksDel = [];
                let newCFiles = [];
                let newCLinks = [];

                // Botones para borrar fotos existentes del comentario
                const { data: currentCMedia } = await supabaseClient.from("comment_media").select("*").eq("comment_id", comment.id);
                if (currentCMedia) {
                    currentCMedia.forEach(m => {
                        const targetWrap = mediaBox.querySelector(`[data-cmedia-id="${m.id}"]`);
                        if (targetWrap && !targetWrap.querySelector(".del-cmedia-btn")) {
                            const btn = document.createElement("button");
                            btn.className = "del-cmedia-btn";
                            btn.textContent = "✕ Delete file";
                            btn.style.cssText = "background:red; color:white; border:none; padding:2px 5px; cursor:pointer;";
                            btn.onclick = () => {
                                cMediaDel.push(m);
                                targetWrap.style.opacity = "0.3";
                                btn.disabled = true;
                            };
                            targetWrap.appendChild(btn);
                        }
                    });
                }

                // Botones para borrar links existentes del comentario
                const { data: currentCLinks } = await supabaseClient.from("comment_links").select("*").eq("comment_id", comment.id);
                if (currentCLinks) {
                    currentCLinks.forEach(l => {
                        const targetWrap = linksBox.querySelector(`[data-clink-id="${l.id}"]`);
                        if (targetWrap && !targetWrap.querySelector(".del-clink-btn")) {
                            const btn = document.createElement("button");
                            btn.className = "del-clink-btn";
                            btn.textContent = "✕";
                            btn.style.cssText = "margin-left:5px; background:red; color:white; border:none; cursor:pointer;";
                            btn.onclick = () => {
                                cLinksDel.push(l.id);
                                targetWrap.style.textDecoration = "line-through";
                                btn.disabled = true;
                            };
                            targetWrap.appendChild(btn);
                        }
                    });
                }

                editBox.innerHTML = `
                    <input type="text" class="edit-c-input" value="${comment.content}" style="width:100%; padding:5px; box-sizing:border-box;">
                    <div style="display:flex; gap:10px; margin-top:8px; align-items:center;">
                        <input type="file" class="edit-c-file-in" multiple style="display:none;">
                        <button type="button" class="edit-c-file-btn">📁 Add Media</button>
                        <input type="url" class="edit-c-link-in" placeholder="Add link..." style="flex:1; padding:4px;">
                        <button type="button" class="edit-c-link-btn">🔗 Link</button>
                    </div>
                    <div class="edit-c-files-prev" style="font-size:0.8em; margin-top:4px;"></div>
                    <div class="edit-c-links-prev" style="font-size:0.8em; margin-top:4px;"></div>
                    <button class="save-c-btn" style="margin-top:8px; padding:5px 10px; background:#ff6b6b; color:white; border:none; cursor:pointer;">Save</button>
                `;

                const cFileIn = editBox.querySelector(".edit-c-file-in");
                const cFileBtn = editBox.querySelector(".edit-c-file-btn");
                const cFilesPrev = editBox.querySelector(".edit-c-files-prev");

                cFileBtn.onclick = () => cFileIn.click();
                cFileIn.onchange = (e) => {
                    newCFiles.push(...Array.from(e.target.files));
                    cFilesPrev.textContent = newCFiles.map(f => f.name).join(", ");
                };

                const cLinkIn = editBox.querySelector(".edit-c-link-in");
                const cLinkBtn = editBox.querySelector(".edit-c-link-btn");
                const cLinksPrev = editBox.querySelector(".edit-c-links-prev");

                cLinkBtn.onclick = () => {
                    const val = cLinkIn.value.trim();
                    if (val) {
                        newCLinks.push(val);
                        cLinkIn.value = "";
                        cLinksPrev.textContent = newCLinks.join(", ");
                    }
                };

                body.replaceWith(editBox);

                editBox.querySelector(".save-c-btn").onclick = async () => {
                    const newCVal = editBox.querySelector(".edit-c-input").value.trim();
                    if (!newCVal) return;

                    await supabaseClient.from("post_comments").update({ content: newCVal }).eq("id", comment.id);

                    for (const m of cMediaDel) {
                        await supabaseClient.from("comment_media").delete().eq("id", m.id);
                        await supabaseClient.storage.from("post-media").remove([m.file_path]);
                    }

                    for (const lId of cLinksDel) {
                        await supabaseClient.from("comment_links").delete().eq("id", lId);
                    }

                    for (const file of newCFiles) {
                        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
                        const filePath = `comments/${user.id}/${crypto.randomUUID()}-${safeName}`;
                        await supabaseClient.storage.from("post-media").upload(filePath, file);
                        await supabaseClient.from("comment_media").insert({
                            comment_id: comment.id, file_path: filePath, file_type: file.type, original_name: file.name
                        });
                    }

                    for (const url of newCLinks) {
                        await supabaseClient.from("comment_links").insert({ comment_id: comment.id, url: url });
                    }

                    loadComments(comment.post_id);
                };
            };

            const delCBtn = document.createElement("span");
            delCBtn.textContent = "🗑️ Delete";
            delCBtn.style.cssText = "cursor:pointer; color:red;";
            delCBtn.onclick = async () => {
                if (!confirm("Delete comment?")) return;
                await supabaseClient.from("post_comments").delete().eq("id", comment.id);
                loadComments(comment.post_id);
            };

            reactBar.appendChild(editCBtn);
            reactBar.appendChild(delCBtn);
        }

        container.appendChild(reactBar);

        const replyBox = document.createElement("div");
        replyBox.style.cssText = "display:none; margin-top:10px; background:#f4f4f4; padding:10px; border-radius:5px;";
        replyBox.innerHTML = `
            <input type="text" class="reply-input" placeholder="Write a reply..." style="width:100%; padding:5px; box-sizing:border-box;">
            <div style="display:flex; gap:10px; margin-top:8px; align-items:center;">
                <input type="file" class="reply-files" multiple accept="*/*" style="display:none;">
                <button type="button" class="reply-file-btn">📁 Media</button>
                <input type="url" class="reply-link-input" placeholder="Paste link..." style="flex:1; padding:4px;">
            </div>
            <div class="reply-files-preview" style="font-size:0.8em; margin-top:4px;"></div>
            <button class="send-reply-btn" style="margin-top:8px; padding:5px 10px; background:#ff6b6b; color:white; border:none; border-radius:3px; cursor:pointer;">Send Reply</button>
        `;
        container.appendChild(replyBox);

        replyBtn.onclick = () => replyBox.style.display = replyBox.style.display === "none" ? "block" : "none";

        let rFiles = [];
        const rFileInput = replyBox.querySelector(".reply-files");
        const rFileBtn = replyBox.querySelector(".reply-file-btn");
        const rFilesPreview = replyBox.querySelector(".reply-files-preview");

        rFileBtn.onclick = () => rFileInput.click();
        rFileInput.onchange = (e) => {
            rFiles.push(...Array.from(e.target.files));
            rFilesPreview.textContent = rFiles.map(f => f.name).join(", ");
        };

        replyBox.querySelector(".send-reply-btn").onclick = async () => {
            if (!user) return alert("Log in.");
            const val = replyBox.querySelector(".reply-input").value.trim();
            const rLinkVal = replyBox.querySelector(".reply-link-input").value.trim();

            if (!val) return alert("Write a reply.");

            const { data: newReply } = await supabaseClient.from("post_comments").insert({
                post_id: comment.post_id,
                parent_comment_id: comment.id,
                user_id: user.id,
                username: user.user_metadata?.username || user.email.split('@')[0],
                content: val
            }).select().single();

            for (const file of rFiles) {
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
                const filePath = `comments/${user.id}/${crypto.randomUUID()}-${safeName}`;
                await supabaseClient.storage.from("post-media").upload(filePath, file);
                await supabaseClient.from("comment_media").insert({
                    comment_id: newReply.id, file_path: filePath, file_type: file.type, original_name: file.name
                });
            }

            if (rLinkVal) {
                await supabaseClient.from("comment_links").insert({ comment_id: newReply.id, url: rLinkVal });
            }

            loadComments(comment.post_id);
        };

        const replies = allComments.filter(c => c.parent_comment_id === comment.id);
        if (replies.length > 0) {
            const repliesContainer = document.createElement("div");
            repliesContainer.style.cssText = "margin-left:20px; border-left:2px solid #ddd; padding-left:10px; margin-top:10px; display:flex; flex-direction:column; gap:10px;";
            for (const r of replies) {
                const childEl = await renderCommentTree(r, allComments);
                repliesContainer.appendChild(childEl);
            }
            container.appendChild(repliesContainer);
        }

        return container;
    }
});
// --- FIN CARGA DE POSTS ---

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const targetUsername = urlParams.get("user");

    if (!targetUsername) {
        alert("No user specified.");
        window.location.href = "moonwalkers-space.html";
        return;
    }

    const { data: { user: currentUser } } = await supabaseClient.auth.getUser();

    // Obtener ID del perfil
    const { data: mainProfile } = await supabaseClient
        .from("profiles")
        .select("id, username")
        .eq("username", targetUsername)
        .maybeSingle();

    const targetUserId = mainProfile?.id;

    // Obtener datos de user_profiles
    let { data: profile } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("username", targetUsername)
        .maybeSingle();

    if (!profile) {
        const { data: newProf } = await supabaseClient
            .from("user_profiles")
            .insert({ user_id: targetUserId || currentUser?.id, username: targetUsername })
            .select()
            .maybeSingle();
        profile = newProf || { username: targetUsername, user_id: targetUserId };
    }

    // Renderizar Avatar o Inicial
    const avatarContainer = document.getElementById("avatar-container");
    if (profile?.avatar_url) {
        avatarContainer.innerHTML = `<img src="${profile.avatar_url}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover;">`;
    } else {
        const initial = targetUsername.charAt(0).toUpperCase();
        const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeead", "#d4a5a5", "#9b59b6"];
        const charCode = targetUsername.charCodeAt(0) || 0;
        const bg = colors[charCode % colors.length];

        avatarContainer.innerHTML = `
            <div style="width: 90px; height: 90px; border-radius: 50%; background: ${bg}; color: white; display: flex; align-items: center; justify-content: center; font-size: 2.2em; font-weight: bold;">
                ${initial}
            </div>
        `;
    }

    document.getElementById("profile-username").textContent = profile.username;
    document.getElementById("profile-status").textContent = profile.status ? `"${profile.status}"` : "";
    document.getElementById("profile-bio").textContent = profile.bio || "No bio yet.";
    document.getElementById("profile-email").textContent = profile.email ? `📧 ${profile.email}` : "";

    // Seguidores
    let followers = [];
    let following = [];
    if (profile.user_id) {
        const { data: fData } = await supabaseClient.from("user_follows").select("*").eq("following_id", profile.user_id);
        const { data: fgData } = await supabaseClient.from("user_follows").select("*").eq("follower_id", profile.user_id);
        followers = fData || [];
        following = fgData || [];
    }
    document.getElementById("profile-stats").textContent = `Followers: ${followers.length} | Following: ${following.length}`;

    const actionsContainer = document.getElementById("profile-actions");
    actionsContainer.innerHTML = "";

    const isOwner = currentUser && (currentUser.id === profile.user_id || currentUser.user_metadata?.username === targetUsername);

    if (isOwner) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️ Edit Profile";
        editBtn.style.cssText = "padding: 8px 15px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;";
        
        editBtn.onclick = () => {
            document.getElementById("edit-profile-form").style.display = "block";
            document.getElementById("edit-username").value = profile.username || "";
            document.getElementById("edit-status").value = profile.status || "";
            document.getElementById("edit-bio").value = profile.bio || "";
            document.getElementById("edit-email").value = profile.email || "";
        };
        actionsContainer.appendChild(editBtn);

    } else if (currentUser && profile.user_id) {
        const isFollowing = followers.some(f => f.follower_id === currentUser.id);
        const followBtn = document.createElement("button");
        followBtn.textContent = isFollowing ? "✓ Following" : "+ Follow";
        followBtn.style.cssText = `padding: 8px 15px; background: ${isFollowing ? '#ccc' : '#4ecdc4'}; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;`;

        followBtn.onclick = async () => {
            if (isFollowing) {
                await supabaseClient.from("user_follows").delete().eq("follower_id", currentUser.id).eq("following_id", profile.user_id);
            } else {
                await supabaseClient.from("user_follows").insert({ follower_id: currentUser.id, following_id: profile.user_id });
            }
            location.reload();
        };
        actionsContainer.appendChild(followBtn);
    }

    document.getElementById("cancel-edit-btn").onclick = () => {
        document.getElementById("edit-profile-form").style.display = "none";
    };

    // Guardar Perfil
    document.getElementById("save-profile-btn").onclick = async () => {
        const newUsername = document.getElementById("edit-username").value.trim();
        const newStatus = document.getElementById("edit-status").value.trim();
        const newBio = document.getElementById("edit-bio").value.trim();
        const newEmail = document.getElementById("edit-email").value.trim();
        const avatarFile = document.getElementById("edit-avatar-file")?.files[0];

        if (!newUsername) return alert("Username cannot be empty.");

        let avatarUrl = profile.avatar_url;

        if (avatarFile) {
            const safeName = avatarFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const filePath = `${currentUser.id}/${crypto.randomUUID()}-${safeName}`;
            
            const { error: uploadError } = await supabaseClient.storage
                .from("post-media")
                .upload(filePath, avatarFile);

            if (uploadError) {
                alert("Upload error: " + uploadError.message);
                return;
            }

            const { data: uData } = supabaseClient.storage.from("post-media").getPublicUrl(filePath);
            avatarUrl = uData.publicUrl;
        }

        await supabaseClient.from("profiles").update({ username: newUsername }).eq("id", currentUser.id);

        await supabaseClient.from("user_profiles").upsert({
            user_id: currentUser.id,
            username: newUsername,
            status: newStatus,
            bio: newBio,
            email: newEmail,
            avatar_url: avatarUrl
        });

        alert("Profile updated! ✨");
        window.location.href = `profile.html?user=${encodeURIComponent(newUsername)}`;
    };

    // Cargar posts de la persona
    const { data: posts } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("username", targetUsername)
        .eq("deleted", false)
        .order("created_at", { ascending: false });

    const postsContainer = document.getElementById("user-posts-container");
    postsContainer.innerHTML = "";

    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = "<p style='color:#888;'>This user has not published anything yet.</p>";
        return;
    }

    const currentLevel = localStorage.getItem("siteLevel") || "simple";

    for (const post of posts) {
        if (currentLevel === "simple" && (post.no_ai === false || post.youth_friendly === false)) {
            continue;
        }

        const postCard = document.createElement("article");
        postCard.className = "post-card";
        postCard.style.cssText = "background:#fff; border:1px solid #ddd; padding:15px; margin-bottom:15px; border-radius:8px; position:relative;";

        const { data: media } = await supabaseClient.from("post_media").select("*").eq("post_id", post.id);

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
                video.style.width = "100%";
                previewContainer.appendChild(video);
            } else if (firstFile.file_type && firstFile.file_type.startsWith("audio/")) {
                const audioBox = document.createElement("div");
                audioBox.style.cssText = "padding:15px; background:#f0f0f0; text-align:center; border-radius:8px;";
                audioBox.textContent = "🎵 Audio file";
                previewContainer.appendChild(audioBox);
            } else {
                const img = document.createElement("img");
                img.src = urlData.publicUrl;
                img.style.maxWidth = "100%";
                previewContainer.appendChild(img);
            }
            postCard.appendChild(previewContainer);
        }

        const username = document.createElement("strong");
        username.textContent = post.username;

        const dateSpan = document.createElement("span");
        dateSpan.style.cssText = "font-size:0.8em; color:#888; margin-bottom:8px; display:block;";
        dateSpan.textContent = postDate;
        
        const content = document.createElement("p");
        content.textContent = post.content;

        postCard.appendChild(username);
        postCard.appendChild(dateSpan);
        postCard.appendChild(content);

        postsContainer.appendChild(postCard);
    }
});

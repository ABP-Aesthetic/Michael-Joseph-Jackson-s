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

    // 1. Obtener ID del usuario desde la tabla profiles
    const { data: mainProfile } = await supabaseClient
        .from("profiles")
        .select("id, username")
        .eq("username", targetUsername)
        .maybeSingle();

    const targetUserId = mainProfile?.id;

    // 2. Obtener o crear datos en user_profiles
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
    } else if (!profile.user_id && targetUserId) {
        profile.user_id = targetUserId;
    }

    // Renderizar Avatar o Inicial Aleatoria
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

    // Contador de Seguidores / Seguidos
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

    // Mostrar botón Editar si eres el dueño, o botón Seguir si eres otro usuario
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

            // Conectar el botón de la foto de perfil igual que en los posts
            const avatarIn = document.getElementById("edit-avatar-file");
            const avatarBtn = document.getElementById("avatar-file-btn");
            const avatarPrev = document.getElementById("avatar-file-preview");
            window.selectedAvatarFile = null;

            avatarBtn.onclick = () => avatarIn.click();
            avatarIn.onchange = (e) => {
                if (e.target.files && e.target.files[0]) {
                    window.selectedAvatarFile = e.target.files[0];
                    avatarPrev.textContent = "📁 " + window.selectedAvatarFile.name;
                }
            };
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

    // Cancelar edición
    document.getElementById("cancel-edit-btn").onclick = () => {
        document.getElementById("edit-profile-form").style.display = "none";
    };

    // Guardar Cambios
    document.getElementById("save-profile-btn").onclick = async () => {
        const newUsername = document.getElementById("edit-username").value.trim();
        const newStatus = document.getElementById("edit-status").value.trim();
        const newBio = document.getElementById("edit-bio").value.trim();
        const newEmail = document.getElementById("edit-email").value.trim();
        if (!newUsername) return alert("Username cannot be empty.");

        let avatarUrl = profile.avatar_url;

        if (window.selectedAvatarFile) {
            const file = window.selectedAvatarFile;
            const safeName = file.name
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9._-]/g, "_");

            const filePath = user.id + "/" + crypto.randomUUID() + "-" + safeName;

            const { error: uploadErr } = await supabaseClient.storage
                .from("post-media")
                .upload(filePath, file);

            if (uploadErr) {
                alert("Error uploading avatar: " + uploadErr.message);
                return;
            }

            const { data: uData } = supabaseClient.storage.from("post-media").getPublicUrl(filePath);
            avatarUrl = uData.publicUrl;
        }

        // Actualizar en profiles
        await supabaseClient.from("profiles").update({ username: newUsername }).eq("id", currentUser.id);

        // Actualizar en user_profiles
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

    // Cargar publicaciones del usuario
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
    } else {
        for (const p of posts) {
            const card = document.createElement("article");
            card.style.cssText = "background:#fff; border:1px solid #ddd; padding:15px; margin-bottom:15px; border-radius:8px;";
            
            const postDate = new Date(p.created_at).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            card.innerHTML = `
                <small style='color:#888; display:block; margin-bottom:5px;'>📅 ${postDate}</small>
                <p style='margin:5px 0; font-size:1.05em;'>${p.content}</p>
            `;

            postsContainer.appendChild(card);
        }
    }
});

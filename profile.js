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

    // Cargar datos del perfil
    let { data: profile } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("username", targetUsername)
        .single();

    // Si no existe fila en user_profiles, la creamos al vuelo
    if (!profile) {
        const { data: newProf } = await supabaseClient
            .from("user_profiles")
            .insert({ username: targetUsername })
            .select()
            .single();
        profile = newProf || { username: targetUsername };
    }

    // Renderizar Avatar o Inicial Aleatoria
    const avatarContainer = document.getElementById("avatar-container");
    if (profile.avatar_url) {
        avatarContainer.innerHTML = `<img src="${profile.avatar_url}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover;">`;
    } else {
        const initial = targetUsername.charAt(0).toUpperCase();
        // Generar color aleatorio estable basado en el nombre
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

    // Cargar seguidores / seguidos
    const { data: followers } = await supabaseClient.from("user_follows").select("*").eq("following_id", profile.user_id);
    const { data: following } = await supabaseClient.from("user_follows").select("*").eq("follower_id", profile.user_id);
    document.getElementById("profile-stats").textContent = `Followers: ${followers?.length || 0} | Following: ${following?.length || 0}`;

    const actionsContainer = document.getElementById("profile-actions");

    // Si es el dueño del perfil: Botón Editar. Si es otro usuario: Botón Seguir
    if (currentUser && currentUser.id === profile.user_id) {
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️ Edit Profile";
        editBtn.style.cssText = "padding: 8px 15px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;";
        
        editBtn.onclick = () => {
            document.getElementById("edit-profile-form").style.display = "block";
            document.getElementById("edit-username").value = profile.username || "";
            document.getElementById("edit-status").value = profile.status || "";
            document.getElementById("edit-bio").value = profile.bio || "";
            document.getElementById("edit-email").value = profile.email || "";
        };

        actionsContainer.appendChild(editBtn);
    } else if (currentUser && profile.user_id) {
        const isFollowing = followers?.some(f => f.follower_id === currentUser.id);
        const followBtn = document.createElement("button");
        followBtn.textContent = isFollowing ? "✓ Following" : "+ Follow";
        followBtn.style.cssText = `padding: 8px 15px; background: ${isFollowing ? '#ccc' : '#4ecdc4'}; color: white; border: none; border-radius: 5px; cursor: pointer;`;

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

    // Guardar cambios
    document.getElementById("save-profile-btn").onclick = async () => {
        const newUsername = document.getElementById("edit-username").value.trim();
        const newStatus = document.getElementById("edit-status").value.trim();
        const newBio = document.getElementById("edit-bio").value.trim();
        const newEmail = document.getElementById("edit-email").value.trim();
        const avatarFile = document.getElementById("edit-avatar-file").files[0];

        if (!newUsername) return alert("Username cannot be empty.");

        let avatarUrl = profile.avatar_url;

        if (avatarFile) {
            const safeName = avatarFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
            const filePath = `avatars/${currentUser.id}/${crypto.randomUUID()}-${safeName}`;
            await supabaseClient.storage.from("post-media").upload(filePath, avatarFile);
            const { data: uData } = supabaseClient.storage.from("post-media").getPublicUrl(filePath);
            avatarUrl = uData.publicUrl;
        }

        await supabaseClient.from("user_profiles").upsert({
            user_id: currentUser.id,
            username: newUsername,
            status: newStatus,
            bio: newBio,
            email: newEmail,
            avatar_url: avatarUrl
        });

        alert("Profile updated!");
        window.location.href = `profile.html?user=${encodeURIComponent(newUsername)}`;
    };

    // Cargar posts de este usuario
    const { data: posts } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("username", targetUsername)
        .eq("deleted", false)
        .order("created_at", { ascending: false });

    const postsContainer = document.getElementById("user-posts-container");
    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = "<p style='color:#888;'>This user has not published anything yet.</p>";
    } else {
        posts.forEach(p => {
            const card = document.createElement("article");
            card.style.cssText = "background:#f9f9f9; border:1px solid #eee; padding:15px; margin-bottom:10px; border-radius:8px;";
            card.innerHTML = `<small style='color:#888;'>${new Date(p.created_at).toLocaleDateString()}</small><p style='margin:5px 0;'>${p.content}</p>`;
            postsContainer.appendChild(card);
        });
    }
});

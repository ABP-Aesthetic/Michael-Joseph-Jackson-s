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

function selectLevel(level) {
    localStorage.setItem("siteLevel", level);

    const overlay = document.getElementById("level-overlay");
    if (overlay) {
        overlay.remove();
    }
}

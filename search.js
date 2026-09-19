const searchPages = [
    {
        title: "🕴 About Michael",
        url: "about-michael.html"
    },
    {
        title: "❤️ Life & Interests",
        url: "life-and-interests.html"
    },
    {
        title: "🎥 Videos",
        url: "videos.html"
    },
    {
        title: "📀 Discography",
        url: "discography.html"
    },
    {
        title: "💗 Moonwalkers' Space",
        url: "moonwalkers-space.html"
    },
    {
        title: "📔 Biography",
        url: "biography.html"
    },
    {
        title: "🗓 Timeline",
        url: "timeline.html"
    },
    {
        title: "🎤 Career",
        url: "career.html"
    },
    {
        title: "✨ Personality",
        url: "personality.html"
    },
    {
        title: "💝 Legacy",
        url: "legacy.html"
    },
    {
        title: "📑 More Facts",
        url: "more-facts.html"
    }
];

const searchInput = document.getElementById("search");
console.log("SEARCH.JS FUNCIONA", searchInput);

if (searchInput) {

    const resultsContainer = document.createElement("div");
    resultsContainer.id = "search-results";

    searchInput.parentElement.appendChild(resultsContainer);

    searchInput.addEventListener("input", async function () {

        const query = searchInput.value.toLowerCase().trim();

        resultsContainer.innerHTML = "";

        if (!query) {
            return;
        }

        for (const page of searchPages) {

            try {
                const response = await fetch(page.url);
                const html = await response.text();

                const parser = new DOMParser();
                const documentPage = parser.parseFromString(html, "text/html");

                const content = documentPage.querySelector(".page-content");

                if (!content) {
                    continue;
                }

                const text = content.innerText.toLowerCase();

                if (text.includes(query)) {

                    const result = document.createElement("div");

                    result.innerHTML = `
                        <a href="${page.url}?search=${encodeURIComponent(query)}">
                            ${page.title}
                        </a>
                    `;

                    resultsContainer.appendChild(result);
                }

            } catch (error) {
                console.error("Error searching:", page.url, error);
            }
        }
    });
}

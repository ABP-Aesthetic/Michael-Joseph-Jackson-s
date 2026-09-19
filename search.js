console.log("SEARCH.JS NUEVO FUNCIONANDO");
const searchPages = [
    {
        title: "🕴 About Michael",
        url: "about-michael.html",
        parent: null
    },
    {
        title: "📔 Biography",
        url: "biography.html",
        parent: "🕴 About Michael"
    },
    {
        title: "🗓 Timeline",
        url: "timeline.html",
        parent: "🕴 About Michael"
    },
    {
        title: "🎤 Career",
        url: "career.html",
        parent: "🕴 About Michael"
    },
    {
        title: "✨ Personality",
        url: "personality.html",
        parent: "🕴 About Michael"
    },
    {
        title: "💝 Legacy",
        url: "legacy.html",
        parent: "🕴 About Michael"
    },
    {
        title: "📑 More Facts",
        url: "more-facts.html",
        parent: "🕴 About Michael"
    },
    {
        title: "❤️ Life & Interests",
        url: "life-and-interests.html",
        parent: null
    },
    {
        title: "🎥 Videos",
        url: "videos.html",
        parent: null
    },
    {
        title: "🖼 Images",
        url: "images.html",
        parent: null
    },
    {
        title: "📀 Discography",
        url: "discography.html",
        parent: null
    },
    {
        title: "💗 Moonwalkers' Space",
        url: "moonwalkers-space.html",
        parent: null
    }
];

const searchInput = document.getElementById("search");

if (searchInput) {

    const resultsContainer = document.createElement("div");
    resultsContainer.id = "search-results";

    searchInput.parentElement.appendChild(resultsContainer);

    let searchTimer;
    let searchNumber = 0;

    searchInput.addEventListener("input", function () {

        clearTimeout(searchTimer);

        const query = searchInput.value.trim();

        resultsContainer.innerHTML = "";

        if (!query) {
            return;
        }

        searchTimer = setTimeout(async function () {

            const currentSearch = ++searchNumber;
            const results = [];

            for (const page of searchPages) {

                try {

                    const response = await fetch(page.url);

                    if (!response.ok) {
                        continue;
                    }

                    const html = await response.text();

                    if (currentSearch !== searchNumber) {
                        return;
                    }

                    const parser = new DOMParser();
                    const pageDocument =
                        parser.parseFromString(html, "text/html");

                    const content =
                        pageDocument.querySelector(".page-content");

                    if (!content) {
                        continue;
                    }

                    const text = content.innerText || "";
                    console.log(page.title, text);

                    const lowerText = text.toLowerCase();
                    const lowerQuery = query.toLowerCase();

                    if (lowerText.includes(lowerQuery)) {

                        results.push({
                            title: page.title,
                            url: page.url,
                            parent: page.parent
                        });

                    }

                } catch (error) {

                    console.error(
                        "Error searching:",
                        page.url,
                        error
                    );

                }
            }

            if (currentSearch !== searchNumber) {
                return;
            }

            displayResults(results, query);

        }, 300);
    });
}


function displayResults(results, query) {

    const resultsContainer =
        document.getElementById("search-results");

    if (!resultsContainer) {
        return;
    }

    resultsContainer.innerHTML = "";

    const mainResults = results.filter(
        result => result.parent === null
    );

    for (const mainPage of mainResults) {

        const group = document.createElement("div");
        group.className = "search-group";

        const mainLink = document.createElement("a");

        mainLink.href =
            `${mainPage.url}?search=${encodeURIComponent(query)}`;

        mainLink.textContent = mainPage.title;

        group.appendChild(mainLink);

        const children = results.filter(
            result => result.parent === mainPage.title
        );

        if (children.length > 0) {

            const childList = document.createElement("div");
            childList.className = "search-children";

            for (const child of children) {

                const childLink = document.createElement("a");

                childLink.href =
                    `${child.url}?search=${encodeURIComponent(query)}`;

                childLink.textContent = child.title;

                childList.appendChild(childLink);
            }

            group.appendChild(childList);
        }

        resultsContainer.appendChild(group);
    }

    if (results.length === 0) {

        resultsContainer.innerHTML =
            `<p>No results found for "${query}".</p>`;
    }
}

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

                    const text = content.textContent || "";
                    console.log(page.title, text);

                    const lowerText = text.toLowerCase();
                    const lowerQuery = query.toLowerCase();

                    if (lowerText.includes(lowerQuery)) {
console.log("COINCIDENCIA:", page.title, query);
                        
                        results.push({
    title: page.title,
    url: page.url,
    parent: page.parent,
    matchPage: page.url
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

    const mainResults = [];

    for (const result of results) {

        let mainPage = result;

        if (result.parent !== null) {
            mainPage = searchPages.find(
                page => page.title === result.parent
            );
        }

        if (
            mainPage &&
            !mainResults.some(
                existing => existing.title === mainPage.title
            )
        ) {
            mainResults.push(mainPage);
        }
    }

    for (const mainPage of mainResults) {

        const mainLink = document.createElement("a");

        const matchingChild = results.find(
    result =>
        result.parent === mainPage.title
);

if (matchingChild) {
    mainLink.href =
        `${mainPage.url}?search=${encodeURIComponent(query)}&match=${encodeURIComponent(matchingChild.url)}`;
} else {
    mainLink.href =
        `${mainPage.url}?search=${encodeURIComponent(query)}`;
}

        mainLink.textContent = mainPage.title;
        mainLink.style.backgroundColor = "yellow";

        resultsContainer.appendChild(mainLink);
    }

    if (mainResults.length === 0) {

        resultsContainer.innerHTML =
            `<p>No results found for "${query}".</p>`;
    }
}

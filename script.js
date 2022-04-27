const form = document.querySelector("form");
const searchInput = document.querySelector("input");
const displaySection = document.querySelector("section");
const nav = document.querySelector("nav");
const button = document.querySelector("button");
const h3 = document.createElement("h3");

let submitCounter = 0;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    displaySection.innerHTML = "";

    getData(searchInput.value);
})

async function getData(input) {
    try {
        const config = {
            params: {
                origin: "*",
                format: 'json',
                action: 'query',
                prop: 'extracts',
                explaintext: true,
                exchars: 150,
                exintro: true,
                generator: 'search',
                gsrlimit: 20,
                gsrsearch: input,
            },
        }

        if (input.trim() !== "") {
            const req = await axios.get("https://en.wikipedia.org/w/api.php?", config);

            showData(req.data.query.pages);
            submitCounter++;

            if (submitCounter > 10) {
                button.disabled = true;
                displaySection.innerHTML = "<p>You've reached the limit today. Please refresh page or come back tomorrow.</p>";
            }
        } else {
            displayError("Please enter some data");
        }
    } catch (e) {
        displayError("Sorry, there's been an error :(");
    }
}

function showData(pages) {

    for (let data in pages) {
        const result = pages[data];

        let div = document.createElement("div");
        let link = document.createElement("a");
        let h2 = document.createElement("h2");
        let p = document.createElement("p");

        link.href = `https://en.wikipedia.org/?curid=${result.pageid}`;
        link.target = "_blank";

        h2.innerText = result.title;
        p.innerText = result.extract;

        link.appendChild(h2);
        link.appendChild(p);
        div.appendChild(link);
        displaySection.append(div);
    }
}

function displayError(error) {
    h3.innerText = error;
    h3.style.color = "red"
    nav.append(h3);
}

searchInput.addEventListener("input", () => {
    h3.innerHTML = "";
})
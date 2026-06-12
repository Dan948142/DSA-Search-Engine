const form = document.getElementById("search-form");
const input = document.getElementById("querry-input");
const resultsDiv = document.getElementById("results");
const spinner = document.getElementById("spinner");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = input.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = "";
  spinner.classList.remove("spinner-hidden");

  try {
    const res = await fetch("/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const { results } = await res.json();

    spinner.classList.add("spinner-hidden");

    if (results.length === 0) {
      resultsDiv.innerHTML = "<p>No matches found.</p>";
      return;
    }

    resultsDiv.innerHTML = results
      .map((r) => {
        return `
            <div class="question">
                <div class="card-header">
                    <img src="assets/logos/${r.platform}.png"
                        alt="${r.platform} logo"
                        class="platform-icon"/>
                    <a href="${r.url}" target="_blank">
                        [${r.platform}] ${r.title}
                    </a>
                </div>
            </div>
        `;
      })
      .join("");
  } catch (err) {
    spinner.classList.add("spinner-hidden");
    console.error(err);
    resultsDiv.innerHTML = `<p>Error: ${err.message}</p>`;
  }
});
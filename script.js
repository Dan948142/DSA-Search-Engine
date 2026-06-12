const form = document.getElementById("search-form");
const input = document.getElementById("query-input"); // This now matches the HTML!
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

    // FIXED: Changed "hidden" to "spinner-hidden"
    spinner.classList.add("spinner-hidden");

    if (results.length === 0) {
      resultsDiv.innerHTML = "<p>No matches found.</p>";
      return;
    }

    resultsDiv.innerHTML = results
      .map((r, i) => {
        // Gives a special glowing border to the #1 top match
        const featuredStyle = i === 0 
            ? "box-shadow: 0 0 20px rgba(56, 189, 248, 0.3); border-color: #38bdf8;" 
            : "";

        return `
            <div class="question" style="${featuredStyle}">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <img 
                        src="assets/logos/${r.platform}.png" 
                        alt="${r.platform} logo"
                        style="height: 24px; width: 24px; object-fit: contain;"
                    />
                    <span style="color: #94a3b8; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        ${r.platform}
                    </span>
                </div>
                <a href="${r.url}" target="_blank" class="card-title">
                    ${r.title}
                </a>
            </div>
        `;
      })
      .join("");
  } catch (err) {
    // FIXED: Changed "hidden" to "spinner-hidden"
    spinner.classList.add("spinner-hidden");
    console.error(err);
  }
});

import puppeteer from "puppeteer";
import fsPromises from "fs/promises";

// SAFETY: Helper function to pause execution and prevent IP bans
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapeLeetcodeProblems() {
  const browser = await puppeteer.launch({
    headless: false, // Change to "new" when moving to a backend server
    defaultViewport: null,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/114.0.5735.199 Safari/537.36"
  );

  await page.goto("https://leetcode.com/problemset/", {
    waitUntil: "domcontentloaded",
  });

  const problemSelector =
    "a.group.flex.flex-col.rounded-\\[8px\\].duration-300";

  let allProblems = [];
  let prevCount = 0;
  const TARGET = 1000;

  console.log("Scrolling LeetCode to fetch 1000 problem links...");

  while (allProblems.length < TARGET) {
    await page.evaluate((sel) => {
      const currProblemsOnPage = document.querySelectorAll(sel);

      if (currProblemsOnPage.length) {
        currProblemsOnPage[currProblemsOnPage.length - 1].scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, problemSelector);

    await delay(2000);

    try {
        await page.waitForFunction(
        (sel, prev) => document.querySelectorAll(sel).length > prev,
        { timeout: 5000 },
        problemSelector,
        prevCount
        );
    } catch(e) {
        console.log("No more problems loading or reached the bottom.");
        break; 
    }

    allProblems = await page.evaluate((sel) => {
      const nodes = Array.from(document.querySelectorAll(sel));

      return nodes.map((el) => ({
        title: el
          .querySelector(".ellipsis.line-clamp-1")
          ?.textContent.trim()
          .split(". ")[1],
        url: el.href,
      }));
    }, problemSelector);

    prevCount = allProblems.length;
    process.stdout.write(`\rFound ${allProblems.length} links...`);
  }
  
  console.log(`\nStarting to scrape ${Math.min(TARGET, allProblems.length)} LeetCode descriptions...`);

  const problemsWithDescriptions = [];
  const loopLimit = Math.min(allProblems.length, TARGET);

  for (let i = 0; i < loopLimit; i++) {
    const { title, url } = allProblems[i];
    const problemPage = await browser.newPage();

    try {
      await problemPage.goto(url);
      await delay(Math.floor(Math.random() * 1500) + 1500);

      let description = await problemPage.evaluate(() => {
        const descriptionDiv = document.querySelector(
          'div.elfjS[data-track-load="description_content"]'
        );
        
        if (!descriptionDiv) return "Description not found";

        const paragraphs = descriptionDiv.querySelectorAll("p");

        let collectedDescription = [];
        for (const p of paragraphs) {
          if (p.innerHTML.trim() === "&nbsp;") break;
          collectedDescription.push(p.innerText.trim());
        }

        return collectedDescription.filter((text) => text !== "").join(" ");
      });

      problemsWithDescriptions.push({ title, url, description });
      process.stdout.write("."); 
    } catch (err) {
      console.error(`\nError fetching description for ${title} (${url}):`, err.message);
    } finally {
      await problemPage.close();
    }
  }

  await fsPromises.mkdir("./problems", { recursive: true });

  // RESTORED: leetcode_problems.json
  await fsPromises.writeFile(
    "./problems/leetcode_problems.json",
    JSON.stringify(problemsWithDescriptions, null, 2)
  );

  await browser.close();
  console.log("\n✅ LeetCode Scrape Complete!");
}

async function scrapeCodeforcesProblems() {
  const browser = await puppeteer.launch({
    headless: false, // Change to "new" when moving to a backend server
    defaultViewport: null,
    args: ["--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/114.0.5735.199 Safari/537.36"
  );

  const problems = [];
  const TARGET = 1000;
  
  console.log("Starting Codeforces Scrape...");

  for (let i = 1; problems.length < TARGET; i++) {
    const url = `https://codeforces.com/problemset/page/${i}`;

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const problemSelector =
      "table.problems tr td:nth-of-type(2) > div:first-of-type > a";

    const links = await page.evaluate((sel) => {
      const anchors = document.querySelectorAll(sel);
      return Array.from(anchors).map((a) => a.href);
    }, problemSelector);

    for (let j = 0; j < links.length && problems.length < TARGET; j++) {
      const link = links[j];

      try {
        await page.goto(link, { waitUntil: "domcontentloaded" });
        await delay(Math.floor(Math.random() * 1500) + 1500);

        const { title, description } = await page.evaluate(() => {
          const titleEl = document.querySelector(".problem-statement .title");
          const descEl = document.querySelector(".problem-statement > div:nth-of-type(2)");
          
          const title = titleEl ? titleEl.textContent.split(". ")[1] : "Unknown";
          const description = descEl ? descEl.textContent : "No description found";

          return { title, description };
        });

        problems.push({
          title,
          url: link,
          description,
        });
        process.stdout.write("."); 
      } catch (err) {
        console.warn(`\n❌ Failed to scrape ${link}: ${err.message}`);
      }
    }
  }

  await fsPromises.mkdir("./problems", { recursive: true });

  // RESTORED: codeforces_problems.json
  await fsPromises.writeFile(
    "./problems/codeforces_problems.json",
    JSON.stringify(problems, null, 2)
  );

  await browser.close();
  console.log("\n✅ Codeforces Scrape Complete!");
}

async function runAll() {
  console.log("🧹 Wiping old problem files clean...");
  
  // Wipes the folder clean to guarantee no ghost files
  await fsPromises.rm("./problems", { recursive: true, force: true }).catch(() => {});
  
  await scrapeCodeforcesProblems();
  await scrapeLeetcodeProblems();
  console.log("🎉 All scraping finished successfully!");
}

runAll();

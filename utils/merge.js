import fs from 'fs';

try {
    const leetcodeData = fs.readFileSync('./problems/leetcode_problems.json', 'utf-8');
    const codeforcesData = fs.readFileSync('./problems/codeforces_problems.json', 'utf-8');

    const leetcode = JSON.parse(leetcodeData);
    const codeforces = JSON.parse(codeforcesData);

    const mergedProblems = [...leetcode, ...codeforces];

    fs.mkdirSync('./corpus', { recursive: true });

    fs.writeFileSync(
        './corpus/all_problems.json', 
        JSON.stringify(mergedProblems, null, 2)
    );

    console.log(`✅ Successfully merged ${mergedProblems.length} problems into corpus/all_problems.json!`);

} catch (error) {
    console.error("❌ Error merging files. Check if your scraped files exist and are valid:", error.message);
}

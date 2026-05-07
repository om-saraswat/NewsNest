const axios = require("axios");
const cheerio = require("cheerio");
const Story = require("../models/Story");

const HN_URL = "https://news.ycombinator.com";

/**
 * Scrape the Hacker News front page and upsert stories into the database.
 * Uses cheerio to parse the HTML and extracts title, URL, points, author,
 * and comment count for each story.
 */
const scrapeHackerNews = async () => {
  try {
    console.log("🔄 Scraping Hacker News...");
    const { data } = await axios.get(HN_URL);
    const $ = cheerio.load(data);

    const stories = [];

    $(".athing").each((_, element) => {
      const id = $(element).attr("id");
      const titleEl = $(element).find(".titleline > a").first();
      const title = titleEl.text();
      const url = titleEl.attr("href") || "";

      // The subtext row is the next sibling <tr>
      const subtext = $(element).next("tr").find(".subtext");
      const pointsText = subtext.find(".score").text(); // e.g. "305 points"
      const points = parseInt(pointsText) || 0;
      const author = subtext.find(".hnuser").text() || "Unknown";

      // Extract comment count from the last <a> in subtext
      const commentsLink = subtext.find("a").last().text(); // e.g. "128 comments"
      const commentsCount = parseInt(commentsLink) || 0;

      if (title && url) {
        stories.push({
          hnId: parseInt(id),
          title,
          url: url.startsWith("http") ? url : `${HN_URL}/${url}`,
          points,
          author,
          commentsCount,
          source: "Hacker News",
        });
      }
    });

    // Upsert stories (update if hnId exists, insert otherwise)
    let upserted = 0;
    for (const story of stories) {
      await Story.findOneAndUpdate({ hnId: story.hnId }, story, {
        upsert: true,
        returnDocument: "after",
      });
      upserted++;
    }

    console.log(`✅ Scraped & upserted ${upserted} stories from Hacker News`);
    return stories;
  } catch (error) {
    console.error("❌ Scraping error:", error.message);
    throw error;
  }
};

module.exports = { scrapeHackerNews };

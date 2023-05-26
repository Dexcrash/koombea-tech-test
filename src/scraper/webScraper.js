/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const cheerio = require('cheerio');
const { parentPort, workerData } = require('worker_threads');

async function scrapePage() {
  try {
    // Fetch the HTML content of the page
    const { url } = workerData;
    console.log('StartScraping...');
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Get the title of the web page
    const title = $('title').text();

    // Select all anchor tags and extract the links
    const links = [];
    $('a').each((index, element) => {
      const url = $(element).attr('href');
      const content = $(element).html();
      links.push({ url, name: content });
    });

    // Return the links and content
    parentPort.postMessage({
      title,
      links,
    });
  } catch (error) {
    console.error('Error scraping the page:', error);
    throw error;
  }
}

scrapePage();

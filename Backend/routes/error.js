const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const { data: html } = await axios.get('https://www.moneyworks4me.com/best-index/nse-stocks/top-nifty-50-companies-list/');
  const $ = cheerio.load(html);

  const top50 = [];

  $('tr.table-content').each((_, row) => {
    const cols = $(row).find('td');

    const companyName = $(cols[1]).find('a').text().trim();
    const lastPrice = parseFloat($(cols[2]).text().replace(/,/g, ''));
    const percentChangeText = $(cols[3]).text().trim();
    const percentChange = percentChangeText ? parseFloat(percentChangeText.replace('%', '')) : undefined;

    const highText = $(cols[5]).text().split('\n')[0].trim();
    const lowText = $(cols[6]).text().split('\n')[0].trim();

    // Infer symbol from company name or use slug if available
    const symbol = companyName?.split(' ')[0].toUpperCase();

    const stock = {
      symbol,
      lastPrice: isNaN(lastPrice) ? undefined : lastPrice,
      percentChange: isNaN(percentChange) ? undefined : percentChange,
      high: isNaN(parseFloat(highText)) ? undefined : parseFloat(highText),
      low: isNaN(parseFloat(lowText)) ? undefined : parseFloat(lowText),
    };

    // Filter out undefined fields
    top50.push(Object.fromEntries(Object.entries(stock).filter(([_, v]) => v !== undefined)));
  });

  console.log(top50);
})();

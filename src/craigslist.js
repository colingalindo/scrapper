const craigslist = require('node-craigslist');
const numeral = require('numeral');

let client = new craigslist.Client({
  city: 'Austin',
});

async function getCraigslist() {
  const items = await client.search('Ford E350');

  return items.map(item => {
    return {
      title: item.title,
      createdAt: new Date(item.date),
      price: numeral(item.price).format('$0,0.00'),
      link: item.url,
    };
  });
}

module.exports = getCraigslist;

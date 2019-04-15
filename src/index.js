const cron = require('node-cron');
const numeral = require('numeral');

const getCraigslist = require('./craigslist');
const getFacebook = require('./facebook');
const getLetgo = require('./letgo');

let lastResults = [];
let lastTime = 0;

async function getResults() {
  const craigslistItems = await getCraigslist();
  const facebookItems = await getFacebook();
  const letGoItems = await getLetgo();

  const allItems = [...craigslistItems, ...facebookItems, ...letGoItems];

  const filteredItems = allItems.filter(
    item =>
      item.title.match(/(E350)|(E 350)/) &&
      !item.title.match(/Mercedes/) &&
      numeral(item.price).value() <= 10000,
  );

  const sortedItems = filteredItems.sort((itemA, itemB) => {
    if (itemA.createdAt > itemB.createdAt) {
      return -1;
    }
    return 1;
  });

  return sortedItems;
}

const task = cron.schedule(
  '*/1 * * * *',
  async function() {
    const newResults = await getResults();
    if (JSON.stringify(newResults) !== JSON.stringify(lastResults)) {
      console.log(newResults.filter(result => result.createdAt > lastTime));
      lastTime = Date.now();
      lastResults = newResults;
    }
  },
  {
    scheduled: false,
  },
);

task.start();

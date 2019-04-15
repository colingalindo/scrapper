const Wreck = require('wreck');
const Hoek = require('hoek');
const numeral = require('numeral');

async function getLetgo() {
  const { payload } = await Wreck.get(
    'https://searchcar.letgo.com/listings?page=1&page_size=100&searchTerm=E350&sort=recent&quadkey=0231301203311&countryCode=US',
    {
      headers: {
        accept: 'application/json',
        referrer: 'https://us.letgo.com/',
        origin: 'https://us.letgo.com',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
      },
    },
  );

  const results = JSON.parse(payload);

  return results.map(item => {
    const link = `https://us.letgo.com/en/i/${item.name.replace(/ /g, '')}_${
      item.id
    }`;

    return {
      title: item.name,
      description: item.description,
      createdAt: new Date(item.createdAt),
      price: numeral(item.price).format('$0,0.00'),
      link,
    };
  });
}

module.exports = getLetgo;

const Wreck = require('wreck');
const Hoek = require('hoek');
const numeral = require('numeral');

async function getFacebook() {
  const { res, payload } = await Wreck.post(
    'https://www.facebook.com/api/graphql/',
    {
      headers: {
        accept: '*/*',
        cookie:
          'c_user=534663979; xs=42%3An63pfpfwYrVqpA%3A2%3A1552075946%3A16512%3A2148;',
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
      },
      payload:
        '__a=1&__dyn=7AgNe-4amfxd2u6aJGeFxqeCwDKEKEW6qrWo8ovxGdwIhE98nwgUaoepojyWUC3qii2aUuxa3K13z8S2SUS3C6pUkz8nwvoiwBx61zU8u1rG0HFU2Jx6q7ooyEOm8z8O1vxm2K7UaU6W78jG48-1yyUS4EhwIUa9u4-2y48OEO2e2bw8m7o5m7FFXAy85iawiK4oO68pwAwwxS8CUO5AbxS227Ua8y&__req=19&__be=1&__pc=PHASED%3Aufi_home_page_pkg&dpr=1&__rev=1000476892&fb_dtsg=AQHo1Xn_5E6C%3AAQFoVbLhKRjK&jazoest=22001&__spin_r=1000476892&__spin_b=trunk&__spin_t=1552075947&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=MarketplaceCategoryPageContainerQuery&variables=%7B%22count%22%3A20%2C%22cursor%22%3Anull%2C%22buyLocation%22%3A%7B%22latitude%22%3A30.2677%2C%22longitude%22%3A-97.7475%7D%2C%22marketplaceID%22%3Anull%2C%22categoryIDArray%22%3A%5B807311116002614%5D%2C%22radius%22%3A65000%2C%22priceRange%22%3A%5B0%2C214748364700%5D%2C%22stringVerticalFields%22%3A%5B%7B%22name%22%3A%22model%22%2C%22value%22%3A%22E350%22%7D%5D%2C%22numericVerticalFields%22%3A%5B%5D%2C%22numericVerticalFieldsBetween%22%3A%5B%5D%2C%22MARKETPLACE_FEED_ITEM_IMAGE_WIDTH%22%3A246%2C%22VERTICALS_LEAD_GEN_PHOTO_HEIGHT_WIDTH%22%3A40%2C%22viewerIsAnonymous%22%3Afalse%2C%22showRentalsMapView%22%3Afalse%7D&doc_id=2587171661355649',
    },
  );

  const results = JSON.parse(payload);
  const items = Hoek.reach(
    results,
    'data.viewer.marketplace_feed_stories.edges',
    [],
  );

  return items.map(item => {
    const info = Hoek.reach(item, 'node.for_sale_item', {});

    return {
      title: info.custom_title,
      description: info.custom_sub_titles.join('/n'),
      createdAt: new Date(info.creation_time * 1000),
      price: numeral(Hoek.reach(info, 'formatted_price.text', null)).format(
        '$0,0.00',
      ),
      link: info.share_uri,
    };
  });
}

module.exports = getFacebook;

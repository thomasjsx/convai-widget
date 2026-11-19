// The meeting kit: one tap per piece, grouped by meeting time.
var M = 'media/';
var GROUPS = [
  { id: '1pm', name: '1:00pm', pieces: [
    { title: 'Stitches', sub: 'A remix from a live event', type: 'images', thumb: M + 'stitches-live-poster.jpg',
      images: [M + 'stitches-about.jpg', M + 'stitches-picks.jpg', { video: M + 'stitches-live.mp4', poster: M + 'stitches-live-poster.jpg' }] },
    { title: 'adcd.nyc', sub: 'The voice portfolio', type: 'link', href: 'https://adcd.nyc', thumb: M + 'adcd-home.jpg', fallback: M + 'adcd-home.jpg' }
  ]},
  { id: '2pm', name: '2:00pm', pieces: [
    { title: 'Bing / Microsoft', type: 'images', thumb: M + 'bing-logos.jpg',
      images: [M + 'bing-1.jpg', M + 'bing-2.jpg', M + 'bing-3.jpg', { video: M + 'bing-concert.mp4', poster: M + 'bing-concert-poster.jpg' }] },
    { title: 'The Oct 30 take-home', type: 'link', href: 'https://adcd.nyc/bullish/convo-ai', thumb: M + 'takehome-thumb.jpg', fallback: M + 'takehome.jpg' }
  ]},
  { id: '3pm', name: '3:00pm', pieces: [
    { title: 'T-Mobile', type: 'images', thumb: M + 'sidekick-2.jpg',
      images: [M + 'sidekick-1.jpg', M + 'sidekick-2.jpg', M + 'sidekick-3.jpg', M + 'sidekick-4.jpg', M + 'sidekick-5.jpg'] },
    { title: 'Rolex', type: 'images', thumb: M + 'rolex-print-2.jpg',
      images: [M + 'rolex-print-2.jpg', M + 'rolex-print-1.jpg', M + 'rolex-print-3.jpg', M + 'rolex-fearless.jpg', M + 'rolex-heritage.jpg', M + 'rolex-ice.jpg', M + 'rolex-beneath.jpg',
        M + 'rolex-app-hero.jpg', M + 'rolex-app-1.png', M + 'rolex-app-2.png'] },
    { title: 'Stitches', sub: 'A remix from a live event', type: 'images', thumb: M + 'stitches-live-poster.jpg',
      images: [M + 'stitches-about.jpg', M + 'stitches-picks.jpg', { video: M + 'stitches-live.mp4', poster: M + 'stitches-live-poster.jpg' }] }
  ]},
  { id: 'backup', name: 'Backup', pieces: [
    { title: 'Economist Templates', type: 'link', href: 'https://adcd.nyc/bullish/economist-brand', thumb: M + 'econ-templates.jpg', fallback: M + 'econ-templates.jpg' },
    { title: 'Economist', type: 'images', thumb: M + 'econ-phone.jpg',
      images: [M + 'econ-ibm.jpg', M + 'econ-gates.jpg', M + 'econ-hcl.jpg', M + 'econ-workfront.jpg', M + 'econ-tiffany.jpg', M + 'econ-climateworks.jpg', M + 'econ-upamerica.jpg'] },
    { title: 'Horizon', sub: 'Before and after: 3 people to 14', type: 'images', thumb: M + 'horizon-team.jpg', images: [M + 'horizon-team.jpg'] }
  ]}
];

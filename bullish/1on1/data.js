// The meeting kit: one tap per piece, grouped by meeting time.
var M = 'media/';
var GROUPS = [
  { id: '1pm', name: '1:00pm', pieces: [
    { title: 'Stitches', sub: 'A remix from a live event', type: 'images', thumb: M + 'stitches-live-poster.jpg',
      images: [M + 'stitches-about.jpg', M + 'stitches-picks.jpg', { video: M + 'stitches-live.mp4', poster: M + 'stitches-live-poster.jpg' }] },
    { title: 'Conversational Portfolio', type: 'link', href: 'https://adcd.nyc/projects/portfolio', thumb: M + 'portfolio-orb.jpg', fallback: M + 'portfolio.jpg' }
  ]},
  { id: '2pm', name: '2:00pm', pieces: [
    { title: 'Bing / Microsoft', type: 'images', thumb: M + 'bing-logos.jpg',
      images: [M + 'bing-1.jpg', M + 'bing-2.jpg', M + 'bing-3.jpg', { video: M + 'bing-concert.mp4', poster: M + 'bing-concert-poster.jpg' }] },
    { title: 'Brand vs Utility', type: 'link', href: 'https://adcd.nyc/bullish/presentation', thumb: M + 'takehome-deck.jpg', fallback: M + 'takehome-deck.jpg' }
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
    { title: 'Economist', sub: 'Product work', type: 'images', thumb: M + 'econ-phone.jpg',
      images: [M + 'econ-product-about.jpg', M + 'econ-wireframes.jpg', M + 'econ-ibm.jpg'] },
    { title: 'Economist', sub: 'Client work', type: 'images', thumb: M + 'econ-tiffany.jpg',
      images: [M + 'econ-tiffany.jpg', M + 'econ-gates.jpg', M + 'econ-hcl.jpg', M + 'econ-workfront.jpg', M + 'econ-climateworks.jpg', M + 'econ-upamerica.jpg'] },
    { title: 'Horizon', sub: 'Before and after: 3 people to 14', type: 'images', thumb: M + 'horizon-team.jpg', images: [M + 'horizon-team.jpg'] }
  ]}
];

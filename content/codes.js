/**
 * ROBLOX CODE GUIDES
 * ---------------------------------------------------------------------------
 * Every object in this list becomes one page at /codes/<slug>/ and one card
 * on the homepage, the Roblox Codes page and in search.
 *
 * !! Everything below is DEMO CONTENT. The games are made-up placeholders and
 * !! the codes, rewards and dates are not real. Replace them with content you
 * !! have checked in-game before turning off `demoMode` in content/site.js.
 *
 * Fields
 *   slug       URL part, lowercase with dashes (must be unique)
 *   title      Game name
 *   genre      Category label shown on cards
 *   icon       Thumbnail artwork: sword | anchor | paw | wheel | pick | tower |
 *              star | cup | flag | bolt | code | shield
 *   hue        Thumbnail accent colour, 0-360 (blues are roughly 190-260)
 *   popular    Optional number. Lower = earlier in "Popular Roblox Games"
 *   summary    One sentence for cards and the meta description
 *   intro      Opening paragraph on the guide page
 *   published  First published (YYYY-MM-DD)
 *   updated    Last time the article changed (YYYY-MM-DD)
 *   checked    Last time the codes were tested in-game (YYYY-MM-DD)
 *   active     [{ code, reward }]
 *   expired    [{ code, reward }]
 *   redeem     Step-by-step instructions (array of strings)
 *   sources    Where players can look for new codes (array of strings)
 */
module.exports = [
  {
    slug: 'blade-harbor',
    title: 'Blade Harbor',
    genre: 'Fighting',
    icon: 'sword',
    hue: 222,
    popular: 1,
    summary: 'Sample guide showing how active and expired Blade Harbor codes are listed.',
    intro:
      'Blade Harbor is a placeholder duelling game used to preview this layout. A real guide would explain what the codes give you and how often the developer releases them.',
    published: '2026-11-02',
    updated: '2026-11-14',
    checked: '2026-11-14',
    active: [
      { code: 'DEMO-HARBOR-01', reward: 'Sample reward: 500 coins' },
      { code: 'DEMO-HARBOR-02', reward: 'Sample reward: 1 knife skin crate' },
      { code: 'DEMO-HARBOR-03', reward: 'Sample reward: 15 minutes of double XP' },
    ],
    expired: [
      { code: 'DEMO-OLDHARBOR-01', reward: 'Sample reward: 250 coins' },
      { code: 'DEMO-OLDHARBOR-02', reward: 'Sample reward: 1 emote' },
    ],
    redeem: [
      'Launch the game from its Roblox page.',
      'Open the main menu and look for a button labelled Codes (often a gift or ticket icon).',
      'Type or paste one code into the text box exactly as shown.',
      'Press Redeem and wait for the confirmation message.',
    ],
    sources: [
      'The description on the game’s official Roblox page.',
      'The developer’s Roblox group announcements.',
      'The developer’s official community server or social accounts, linked from the game page.',
    ],
  },
  {
    slug: 'pixel-pet-parade',
    title: 'Pixel Pet Parade',
    genre: 'Simulator',
    icon: 'paw',
    hue: 196,
    popular: 2,
    summary: 'Sample pet-collecting guide with demo codes for boosts and eggs.',
    intro:
      'Pixel Pet Parade is a placeholder pet simulator. This page shows how a guide looks when a game has several active codes and a longer list of expired ones.',
    published: '2026-10-21',
    updated: '2026-11-13',
    checked: '2026-11-13',
    active: [
      { code: 'DEMO-PARADE-EGG', reward: 'Sample reward: 1 starter egg' },
      { code: 'DEMO-PARADE-LUCK', reward: 'Sample reward: 10 minutes of luck boost' },
      { code: 'DEMO-PARADE-GEMS', reward: 'Sample reward: 300 gems' },
      { code: 'DEMO-PARADE-TREAT', reward: 'Sample reward: 5 pet treats' },
    ],
    expired: [
      { code: 'DEMO-PARADE-LAUNCH', reward: 'Sample reward: 100 gems' },
      { code: 'DEMO-PARADE-SUMMER', reward: 'Sample reward: 1 seasonal egg' },
      { code: 'DEMO-PARADE-10K', reward: 'Sample reward: 1 luck boost' },
    ],
    redeem: [
      'Join the game and finish the short tutorial if one appears.',
      'Tap the shop or settings icon at the side of the screen.',
      'Scroll to the code box and enter one code.',
      'Confirm, then check your inventory for the reward.',
    ],
    sources: [
      'The description on the game’s official Roblox page.',
      'Update notes posted in the developer’s Roblox group.',
      'In-game news boards, which some games use to announce codes.',
    ],
  },
  {
    slug: 'turbo-drift-legends',
    title: 'Turbo Drift Legends',
    genre: 'Racing',
    icon: 'wheel',
    hue: 208,
    popular: 3,
    summary: 'Sample racing guide with demo codes for cash and car wraps.',
    intro:
      'Turbo Drift Legends is a placeholder racing game. Use this page to preview how rewards and copy buttons appear on a typical code guide.',
    published: '2026-11-05',
    updated: '2026-11-12',
    checked: '2026-11-12',
    active: [
      { code: 'DEMO-DRIFT-CASH', reward: 'Sample reward: 2,000 cash' },
      { code: 'DEMO-DRIFT-WRAP', reward: 'Sample reward: 1 car wrap' },
    ],
    expired: [{ code: 'DEMO-DRIFT-BETA', reward: 'Sample reward: 500 cash' }],
    redeem: [
      'Open the game and head to the garage.',
      'Select the Codes tab in the garage menu.',
      'Enter a code and press Claim.',
    ],
    sources: [
      'The description on the game’s official Roblox page.',
      'The developer’s official social accounts, linked from the game page.',
    ],
  },
  {
    slug: 'mystic-mine-simulator',
    title: 'Mystic Mine Simulator',
    genre: 'Simulator',
    icon: 'pick',
    hue: 238,
    popular: 4,
    summary: 'Sample mining guide showing demo codes for ore boosts and backpacks.',
    intro:
      'Mystic Mine Simulator is a placeholder mining game. This sample shows a guide that currently has only one active code.',
    published: '2026-10-14',
    updated: '2026-11-10',
    checked: '2026-11-10',
    active: [{ code: 'DEMO-MINE-BOOST', reward: 'Sample reward: 20 minutes of ore boost' }],
    expired: [
      { code: 'DEMO-MINE-OPENING', reward: 'Sample reward: 1 small backpack' },
      { code: 'DEMO-MINE-GOLD', reward: 'Sample reward: 50 gold ore' },
    ],
    redeem: [
      'Start the game and wait for your save to load.',
      'Press the Codes button near the top of the screen.',
      'Enter the code and press Redeem.',
    ],
    sources: [
      'The description on the game’s official Roblox page.',
      'The developer’s Roblox group announcements.',
    ],
  },
  {
    slug: 'tower-siege-defenders',
    title: 'Tower Siege Defenders',
    genre: 'Tower Defense',
    icon: 'tower',
    hue: 214,
    popular: 5,
    summary: 'Sample tower defense guide with demo codes for gems and units.',
    intro:
      'Tower Siege Defenders is a placeholder tower defense game. Some real games in this genre only unlock codes after a certain level, which a full guide should mention.',
    published: '2026-11-08',
    updated: '2026-11-11',
    checked: '2026-11-11',
    active: [
      { code: 'DEMO-SIEGE-GEMS', reward: 'Sample reward: 150 gems' },
      { code: 'DEMO-SIEGE-UNIT', reward: 'Sample reward: 1 common unit' },
      { code: 'DEMO-SIEGE-XP', reward: 'Sample reward: 1 XP potion' },
    ],
    expired: [],
    redeem: [
      'Enter the lobby and open the menu.',
      'Choose Codes from the list of options.',
      'Type the code, then press Submit.',
      'Collect the reward from your mailbox or inventory.',
    ],
    sources: [
      'The description on the game’s official Roblox page.',
      'The developer’s official community server, linked from the game page.',
    ],
  },
  {
    slug: 'anime-dawn-arena',
    title: 'Anime Dawn Arena',
    genre: 'Fighting',
    icon: 'star',
    hue: 252,
    popular: 6,
    summary: 'Sample arena-fighter guide with demo codes for spins and rerolls.',
    intro:
      'Anime Dawn Arena is a placeholder arena fighter. This sample shows how spin and reroll rewards could be described.',
    published: '2026-10-28',
    updated: '2026-11-09',
    checked: '2026-11-09',
    active: [
      { code: 'DEMO-DAWN-SPINS', reward: 'Sample reward: 5 spins' },
      { code: 'DEMO-DAWN-REROLL', reward: 'Sample reward: 2 trait rerolls' },
    ],
    expired: [
      { code: 'DEMO-DAWN-RELEASE', reward: 'Sample reward: 3 spins' },
      { code: 'DEMO-DAWN-PATCH', reward: 'Sample reward: 1 trait reroll' },
    ],
    redeem: [
      'Load into the game and open the customisation menu.',
      'Find the code box at the bottom of the menu.',
      'Enter the code and confirm.',
    ],
    sources: [
      'The description on the game’s official Roblox page.',
      'The developer’s Roblox group announcements.',
    ],
  },
  {
    slug: 'cozy-cafe-empire',
    title: 'Cozy Café Empire',
    genre: 'Tycoon',
    icon: 'cup',
    hue: 190,
    summary: 'Sample tycoon guide with demo codes for cash and decorations.',
    intro:
      'Cozy Café Empire is a placeholder tycoon game. This sample includes a guide with no expired codes yet.',
    published: '2026-11-10',
    updated: '2026-11-10',
    checked: '2026-11-10',
    active: [
      { code: 'DEMO-CAFE-CASH', reward: 'Sample reward: 1,000 cash' },
      { code: 'DEMO-CAFE-DECOR', reward: 'Sample reward: 1 decoration' },
    ],
    expired: [],
    redeem: [
      'Open your café and tap the settings cog.',
      'Enter a code into the Promo Code field.',
      'Press Redeem.',
    ],
    sources: [
      'The description on the game’s official Roblox page.',
      'The developer’s official social accounts, linked from the game page.',
    ],
  },
  {
    slug: 'obby-rush-infinity',
    title: 'Obby Rush Infinity',
    genre: 'Obby',
    icon: 'flag',
    hue: 228,
    summary: 'Sample obby guide showing an empty active list and how it is handled.',
    intro:
      'Obby Rush Infinity is a placeholder obstacle course. This sample has no active codes, so you can see the message shown when a list is empty.',
    published: '2026-10-06',
    updated: '2026-11-07',
    checked: '2026-11-07',
    active: [],
    expired: [
      { code: 'DEMO-OBBY-SKIP', reward: 'Sample reward: 1 stage skip' },
      { code: 'DEMO-OBBY-TRAIL', reward: 'Sample reward: 1 trail' },
    ],
    redeem: [
      'Join the game and open the shop.',
      'Select the Codes tab.',
      'Enter a code and press Enter.',
    ],
    sources: [
      'The description on the game’s official Roblox page.',
      'The developer’s Roblox group announcements.',
    ],
  },
  {
    slug: 'skyforge-tycoon',
    title: 'Skyforge Tycoon',
    genre: 'Tycoon',
    icon: 'bolt',
    hue: 204,
    summary: 'Sample factory tycoon guide with demo codes for cash and boosts.',
    intro:
      'Skyforge Tycoon is a placeholder factory game used to fill out the grid so that sorting, search and Load More can be tested.',
    published: '2026-10-30',
    updated: '2026-11-06',
    checked: '2026-11-06',
    active: [
      { code: 'DEMO-FORGE-CASH', reward: 'Sample reward: 5,000 cash' },
      { code: 'DEMO-FORGE-SPEED', reward: 'Sample reward: 10 minutes of conveyor speed' },
    ],
    expired: [{ code: 'DEMO-FORGE-ALPHA', reward: 'Sample reward: 1,000 cash' }],
    redeem: [
      'Claim a plot and open the side menu.',
      'Choose Codes.',
      'Enter the code and press Redeem.',
    ],
    sources: [
      'The description on the game’s official Roblox page.',
      'The developer’s Roblox group announcements.',
    ],
  },
];

const px = (id: string, file: string, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${file}?auto=compress&cs=tinysrgb&w=${w}`;

/** Interior / ambience photography */
export const AMBIENCE = {
  grandHall: px("27626762", "png", 1600),
  marquee: px("1217324", "jpeg", 1600),
  bulbWindow: px("4551158", "jpeg", 1400),
  counter: px("11439363", "jpeg", 1400),
  kyotoNight: px("30473581", "jpeg", 1400),
  chandeliers: px("27626694", "png", 1400),
  moodyChairs: px("38062747", "jpeg", 1400),
  redLounge: px("9102597", "jpeg", 1400),
};

/** Coffee & beverage photography */
export const BREWS = {
  latteGlassBlack: px("33034292", "jpeg"),
  cappuccinoHands: px("15801080", "jpeg"),
  blackCup: px("19825169", "jpeg"),
  latteTopView: px("32228894", "jpeg"),
  cappuccinoBeans: px("5112652", "jpeg"),
  layeredGlass: px("27126844", "jpeg"),
  latteFloral: px("35097215", "jpeg"),
  dramaticShadow: px("14689202", "jpeg"),
  heartArt: px("15800361", "jpeg"),
  frothyTop: px("36772681", "jpeg"),
};

/** Kitchen, pastry & dessert photography */
export const KITCHEN = {
  bananaCaramel: px("28438607", "jpeg"),
  sugarNest: px("20943986", "jpeg"),
  fruitPlate: px("16695039", "jpeg"),
  strawberryMousse: px("14738384", "jpeg"),
  artisticPlate: px("28887735", "png"),
  dessertSauce: px("14944187", "jpeg"),
  berryLayers: px("28446159", "jpeg"),
  floralDessert: px("35093309", "jpeg"),
  chocolateMango: px("34520947", "jpeg"),
  sugarSculpture: px("20943984", "jpeg"),
  bakeryDisplay: px("40408087", "jpeg"),
  croissantBoard: px("13427851", "jpeg"),
  chocoCroissant: px("30632251", "jpeg"),
  breadFruitCoffee: px("13427852", "jpeg"),
  croissantFlour: px("7440422", "jpeg"),
  darkCake: px("30270646", "jpeg"),
  croissantChoco: px("8023959", "jpeg"),
  cacaoRolls: px("23314644", "jpeg"),
};

/** Bar & cold craft photography */
export const BAR = {
  berryPair: px("36630828", "jpeg"),
  barClose: px("16859959", "jpeg"),
  barCounter: px("33013700", "jpeg"),
  tokyoBar: px("33013697", "jpeg"),
  tokyoPour: px("33013695", "jpeg"),
  icedMarble: px("34076009", "jpeg"),
  fruitHighball: px("31738842", "jpeg"),
  summerCitrus: px("27489419", "jpeg"),
};

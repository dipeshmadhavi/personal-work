var _ = require("lodash");

let homes = [
  {
    h_id: "3",
    city: "Dallas",
    state: "TX",
    zip: "75201",
    price: "962500"
  },
  {
    h_id: "4",
    city: "Bevery Hills",
    state: "CA",
    zip: "90210",
    price: "319250"
  },
  {
    h_id: "5",
    city: "New York",
    state: "NY",
    zip: "00010",
    price: "162500"
  }
];

// homes.sort((a, b) => {
//   return parseInt(b.price) - parseInt(a.price);
// });
homes = _.orderBy(homes, ['price'], ['asc']);
// console.log(homes);
// _.reverse(homes);
console.log(homes);

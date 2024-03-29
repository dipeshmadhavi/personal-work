const chartData = {
  class: 'go.GraphLinksModel',
  linkFromPortIdProperty: 'fromPort',
  linkToPortIdProperty: 'toPort',
  nodeDataArray: [
    { category: 'Comment', loc: '360 -10', text: 'Kookie Brittle', key: -13 },
    { key: -1, category: 'Start', loc: '175 0', text: 'Start' },
    { key: 0, loc: '-5 75', text: 'Preheat oven to 375 F' },
    {
      key: 1,
      loc: '175 100',
      text:
        'In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt'
    },
    {
      key: 2,
      loc: '175 200',
      text: 'Gradually beat in 1 cup sugar and 2 cups sifted flour'
    },
    {
      key: 3,
      loc: '175 290',
      text: "Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"
    },
    { key: 4, loc: '175 380', text: 'Press evenly into ungreased 15x10x1 pan' },
    {
      key: 5,
      loc: '355 85',
      text: 'Finely chop 1/2 cup of your choice of nuts'
    },
    { key: 6, loc: '175 450', text: 'Sprinkle nuts on top' },
    { key: 7, loc: '175 515', text: 'Bake for 25 minutes and let cool' },
    { key: 8, loc: '175 585', text: 'Cut into rectangular grid' },
    { key: -2, category: 'End', loc: '175 660', text: 'Enjoy!' }
  ],
  linkDataArray: [
    { from: 1, to: 2, fromPort: 'B', toPort: 'T' },
    { from: 2, to: 3, fromPort: 'B', toPort: 'T' },
    { from: 3, to: 4, fromPort: 'B', toPort: 'T' },
    { from: 4, to: 6, fromPort: 'B', toPort: 'T' },
    { from: 6, to: 7, fromPort: 'B', toPort: 'T' },
    { from: 7, to: 8, fromPort: 'B', toPort: 'T' },
    { from: 8, to: -2, fromPort: 'B', toPort: 'T' },
    { from: -1, to: 0, fromPort: 'B', toPort: 'T' },
    { from: -1, to: 1, fromPort: 'B', toPort: 'T' },
    { from: -1, to: 5, fromPort: 'B', toPort: 'T' },
    { from: 5, to: 4, fromPort: 'B', toPort: 'T' },
    { from: 0, to: 4, fromPort: 'B', toPort: 'T' }
  ]
};

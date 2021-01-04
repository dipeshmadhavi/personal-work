function data() {
  return (Data = [
    { key: "Alpha" },
    { key: "Beta", parent: "Alpha" },
    { key: "Cup cake", parent: "Alpha" },
    { key: "Donut", parent: "Cup cake" },
    { key: "Eclair", parent: "Beta" },
    { parent: "Beta" }
  ]);
}

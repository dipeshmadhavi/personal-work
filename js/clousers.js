let a = 10

function test() {
  let a = 20
  console.log(a);
  test2();

}
function test2() {
  console.log(a);
}
test()
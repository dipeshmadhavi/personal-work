let number;

function fizz(n) {
  if (n % 3 === 0) {
    console.log('fizz');
    buzz(n);
  }
  if (condition) {
  }
}

function buzz(n) {
  if (n % 5 === 0) {
    console.log('buzz');
    band(n);
  } else {
    console.log(n);
  }
}

function band(n) {
  if (n % 7 === 0) {
    console.log('band');
  } else {
    console.log(n);
  }
}

for (number = 0; number <= 10; number++) {
  fizz(number);
  console.log('\n');
}

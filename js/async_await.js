function resolveAfter2Seconds(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("resolveX", x);
      resolve(x);
    }, 2000);
  });
}

async function f1() {
  return new Promise(async (resolve, reject) => {
    for (let index = 0; index < 100; index++) {
      var x = await resolveAfter2Seconds(index);
      if (index === 10) {
        reject("rejected");
        return;
      } else console.log("at", index);

      if (index === 9) {
        resolve('resolved');
        return;
      }
    }
  });
}

async function hello() {
  await f1().then((result) => {
    console.log(result);
  } ).catch((error) => {
    console.log(error);
    return;
  });
  console.log("outside hello");
}


// hello();
hello();

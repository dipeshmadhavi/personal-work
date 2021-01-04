function resolveAfter2Seconds(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function f1() {
  return new Promise(async (resolve, reject) => {
    for (let index = 0; index < 10; index++) {
      var x = await resolveAfter2Seconds(10);
      if (index === 3) {
        reject("rejected");
        return;
      } else console.log("at", index);
      if (index === 9) resolve("resolved");
    }
  });
}

async function hello() {
  await f1().catch((error) => {
    console.log(error);
    return;
  });
  console.log("outside hello");
}

hello();

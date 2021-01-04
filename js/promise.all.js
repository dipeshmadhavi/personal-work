const resources = [
  {
    name: 'jack',
    age: 24
  },
  {
    name: 'jane',
    age: 25
  },
  {
    name: 'jill',
    age: 26
  },
  {
    name: 'john',
    age: 27
  },
]

function print(rec) {
  setTimeout(() => {
    console.log(rec);
  }, 2000);
}

promiseall = async function (result) {
  await Promise.all(
    result.map(async (re) => {
      await print(re);
      console.log(re.name);

    })
  )
  console.log('done');

}

promiseall(resources)
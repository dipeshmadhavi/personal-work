const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

const accountName = 'epcfrmstorage';
const accountKey = 'gMiwF/bpJdHez1cqyrNK01Ruen6mxscfXThwIjS1s1T5yKpI2ROy69UEePsN/bZD8bzpPXQPeMqHuad15BC+iw=='

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobBaseURL = `https://${accountName}.blob.core.windows.net`
const blobServiceClient = new BlobServiceClient(blobBaseURL, sharedKeyCredential);

  
async function createContainer() { // test done
  try {
  // Create a container
  const containerName = `publictestupload`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const createContainerResponse = await containerClient.create({access: 'container'});
  console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId);
} catch (error) {
  console.error(error.message);
}
}

async function getContainers() { // test done
  try {
    const list = []
    let containers = blobServiceClient.listContainers();
    for await (const blob of containers) {
      list.push(blob);
      // console.log('\t', blob.name);
  }

  // const list = await Promise.all(promiseQueue)

  // let iter = blobServiceClient.listContainers();
  // let containerItem = await iter.next();
  console.log('containers list', list);
} catch (error) {
  console.error(error.message);
}
}

async function uploadBlob(data, name) { // test done with static data
  try {
  const containerName = "publictestupload";
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // const content = "Hello world!";
  // const blobName = "newblob" + new Date().getTime();
  const blockBlobClient = containerClient.getBlockBlobClient(name);
  const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
  console.log(`Upload block blob ${name} successfully`, uploadBlobResponse.requestId);
} catch (error) {
  console.error(error.message);
}
}

async function getBlobs() { // test done
  try {
  const containerName = "firstupload";
  const containerClient = blobServiceClient.getContainerClient(containerName);

  let i = 1;
  let blobData = containerClient.listBlobsFlat();
  for await (const blob of blobData) {
    console.log(`Blob ${i++}: ${blob.name}`);
  }

} catch (error) {
  console.error(error.message);
}
}

async function downloadBlob() { // test done
  try {
  const containerName = "firstupload";
  const blobName = 'chart.jpg'
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  // Get blob content from position 0 to the end
  // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
  const downloadBlockBlobResponse = await blobClient.download();
  const downloaded = (
    await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
  ).toString();
  console.log("Downloaded blob content:", downloaded);
  uploadBlob(downloaded, blobName)
} catch (error) {
  console.error(error.message);
}
}

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    try {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
    
      
  } catch (error) {
      reject
  }
  });
}

getContainers();
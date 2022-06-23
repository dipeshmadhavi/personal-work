const fs = require('fs');
const FileType = require('file-type');
const fetch = require('node-fetch'); 

(async () => {
	// const stream = fs.createReadStream('calc.txt');
  const response = await fetch('https://kmsmediasvcstorage.blob.core.windows.net/knowledge/922226.pdf');
  const fileType = await FileType.fromStream(response.body);
	console.log(fileType);
	
}
)();



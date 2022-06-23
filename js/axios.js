var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://api4.successfactors.com/odata/v2/Photo(photoType=1,userId=\'23066139\')/$value',
  'headers': {
    'Authorization': 'Basic bWVjb25uZWN0X2FwaUBNYWhpbmRyYTpNYWhpbmRyYUAxMjM='
  }
};
request(options, function (error, response) {
  if(error) {
    console.log(error);
  } else {
    console.log(response.body);
  }
});
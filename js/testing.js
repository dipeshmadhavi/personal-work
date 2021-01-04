function isPalindrome(inputString) {
  return (
    inputString.split('').reverse().join('').toLowerCase() ===
    inputString.toLowerCase()
  );
}
console.log(isPalindrome('Level'));

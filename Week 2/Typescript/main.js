// Example 1: Add Two Numbers a and b
function add(a, b) {
    return a + b;
}
// Example 2: message with a greeting
function greet(name) {
    return "Hello, " + name;
}
// Example 3: Calculate Factorial of a Number
function factorial(n) {
    if (n === 0 || n === 1)
        return 1;
    return n * factorial(n - 1);
}
console.log(factorial(5)); // Output: 120
// Example 4: Check if a String is a Palindrome
function isPalindrome(str) {
    var reversed = str.split('').reverse().join('');
    return str === reversed;
}
console.log(isPalindrome("madam")); // Output: true
// Example 5: Sum of an Array
function sumArray(arr) {
    return arr.reduce(function (sum, val) { return sum + val; }, 0);
}
console.log(sumArray([1, 2, 3, 4])); // Output: 10
// Example 6: Sort Numbers in Ascending Order
function sortNumbers(arr) {
    return arr.sort(function (a, b) { return a - b; });
}
console.log(sortNumbers([3, 1, 4, 2])); // Output: [1, 2, 3, 4]
function displayProduct(product) {
    console.log("Name: ".concat(product.name));
    console.log("Price: $".concat(product.price));
    console.log("In Stock: ".concat(product.inStock));
}
var product1 = {
    name: "Laptop",
    price: 599.99,
    inStock: true
};
displayProduct(product1);

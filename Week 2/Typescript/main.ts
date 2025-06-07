// Example 1: Add Two Numbers a and b
function add(a: number, b: number): number {
    return a + b;
}

// Example 2: message with a greeting
function greet(name: string): string {
    return "Hello, " + name;
}

// Example 3: Calculate Factorial of a Number
function factorial(n: number): number {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}
console.log(factorial(5)); // Output: 120

// Example 4: Check if a String is a Palindrome
function isPalindrome(str: string): boolean {
    const reversed: string = str.split('').reverse().join('');
    return str === reversed;
}
console.log(isPalindrome("madam")); // Output: true

// Example 5: Sum of an Array
function sumArray(arr: number[]): number {
    return arr.reduce((sum, val) => sum + val, 0);
}
console.log(sumArray([1, 2, 3, 4])); // Output: 10

// Example 6: Sort Numbers in Ascending Order
function sortNumbers(arr: number[]): number[] {
    return arr.sort((a, b) => a - b);
}
console.log(sortNumbers([3, 1, 4, 2])); // Output: [1, 2, 3, 4]

// Step 2: Interface Usage with TypeScript Structure
interface Product {
    name: string;
    price: number;
    inStock: boolean;
}

function displayProduct(product: Product): void {
    console.log(`Name: ${product.name}`);
    console.log(`Price: $${product.price}`);
    console.log(`In Stock: ${product.inStock}`);
}

const product1: Product = {
    name: "Laptop",
    price: 599.99,
    inStock: true
};

displayProduct(product1);

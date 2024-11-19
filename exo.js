// 1. ucfirst : Première lettre en majuscule
function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
console.log(ucfirst("hello world")); // Hello world

// 2. capitalize : Première lettre de chaque mot en majuscule
function capitalize(str) {
    return str.split(" ").map(word => ucfirst(word)).join(" ");
}
console.log(capitalize("hello world")); // Hello World

// 3. camelCase : Capitalize et coller les mots
function camelCase(str) {
    return capitalize(str).replace(/ /g, "");
}
console.log(camelCase("hello world")); // HelloWorld

// 4. snake_case : Joindre les mots par des underscores en minuscules
function snake_case(str) {
    return str.toLowerCase().replace(/ /g, "_");
}
console.log(snake_case("hello world")); // hello_world

// 5. leet : Cryptage des voyelles
function leet(str) {
    const leetMap = {
        "A": "4", "E": "3", "I": "1", "O": "0", "U": "_", "Y": "7",
        "a": "4", "e": "3", "i": "1", "o": "0", "u": "_", "y": "7"
    };
    return str.split("").map(char => leetMap[char] || char).join("");
}
console.log(leet("anaconda")); // 4n4c0nd4

// 6. verlan : Inverser chaque mot d'une phrase
function verlan(str) {
    return str.split(" ").map(word => word.split("").reverse().join("")).join(" ");
}
console.log(verlan("Hello world")); // olleH dlrow

// 7. yoda : Inverser la position des mots dans une phrase
function yoda(str) {
    return str.split(" ").reverse().join(" ");
}
console.log(yoda("Hello world")); // world Hello

// 8. type_check_v1 : Vérifier le type d'un argument
function type_check_v1(arg, type) {
    return typeof arg === type;
}
console.log(type_check_v1(1, "number")); // true
console.log(type_check_v1("hello", "string")); // true
console.log(type_check_v1([], "object")); // true
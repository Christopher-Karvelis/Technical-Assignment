import express from "express"

const router = express.Router()

function getWords(string) {
    let word = "";
    const words = [];
    var w = 0;
    for (let i = 0; i < string.length; i++) {
        let char = string.charAt(i);
        let asciiCode = char.charCodeAt(0);
        if(97 <= asciiCode &&  asciiCode <= 122) {
            word = word.concat(char);
        } else if (65 <= asciiCode && asciiCode <= 90) {
            let c = String.fromCharCode(asciiCode + 32);
            word = word.concat(c);
        } else if (asciiCode == 32) {     
            words[w] = word;
            console.log("hey -> " + word);
            word = "";
            w++;
        }
    }
    return words;
}
// function of endpointA
function areAnagrams(string1, string2) {
    const asciiCount = new Array(256).fill(0);

    if(string1.length != string2.length){
        return false;
    }
    // Convert both strings to lowercase as ASCII code for 'l' is different from 'L'
    string1 = string1.toLowerCase();
    string2 = string2.toLowerCase();
    // Iterate through strings adding 1 to the coresponding ASCI character for String1 while substracting 1 for String2 
    for (let i = 0; i < string1.length; i++) {
        asciiCount[string1.charAt(i).charCodeAt(0)]+= 1;
        asciiCount[string2.charAt(i).charCodeAt(0)]-= 1;
    }
    // See if we encountered the same characters
    for (let i = 0; i < asciiCount.length; i++) {
        if (asciiCount[i] != 0) { // Each ascii count should be zero if string1 is anagram of string2
            return false;
        }
    }
    return true;
}
// function of endpointB
function getAnagrams(word, sentence) {
    var anagrams = [];
    const uniqueAnagrams = new Set();   // Set with O(1) look up to check for unique anagrams in the sentence
    var words = getWords(sentence);    // Break the string in to an array of words
    var j = 0;
    for (let i = 0; i < words.length; i++) {
        if(areAnagrams(word, words[i])){
            if(!uniqueAnagrams.has(words[i])) {
                uniqueAnagrams.add(words[i]);
                anagrams[j] = words[i];
                j++;
            }
        }
    }
    return anagrams;
}
// function of endpointC
function getAnagramGroups(sentence) {
    var groupAnagrams = [];
    var words = getWords(sentence);        // Break the string in to an array of words
    var w = 0;
    for (let i = 0; i < words.length; i++) {
        const uniqueAnagrams = new Set();   // Set with O(1) look up to check for unique anagrams in the sentence
        const group = [];
        var g = 0;
        for (let j = i+1; j < words.length; j++) {
            if (areAnagrams(words[i], words[j])) {
                if (!uniqueAnagrams.has(words[j])) {
                    uniqueAnagrams.add(words[j]);
                    group[g] = words[j];
                    g++;
                }
            }
        }
        if (uniqueAnagrams.size != 0) {     // If we found anagrams of words[i] also include words[i] in the result if not already
            if (!uniqueAnagrams.has(firstWord)) {
                group[g] = words[i];
            }
            
            if(group.length > 1) {          // If we found anagrams of words[i] add the group to the final array of groups
                groupAnagrams[w] = group;
                w++;
            }
        }
    }
    return groupAnagrams;
}

// Default endpoint
router.get('/', function(req, res) {
    res.send("Welcome to anagrams!")
})

// Post endpoint A
router.post('/endpointA', function(req, res) {
    const { string1, string2 } = req.body;
    console.log(string1, string2);
    var outcome = areAnagrams(string1, string2);
    res.json({
        outcome : outcome
    })
})
// Post endpoint B
router.post('/endpointB', function(req, res) {
    const { word, sentence } = req.body;
    console.log(word, sentence);
    var outcome = getAnagrams(word, sentence);
    res.json({
        outcome : outcome
    })
})
// Post endpoint C
router.post('/endpointC', function(req, res) {
    const { sentence } = req.body;
    console.log(sentence);
    var outcome = getAnagramGroups(sentence);
    res.json({
        outcome : outcome
    })
})
// Export so it can be used in index.js
export default router
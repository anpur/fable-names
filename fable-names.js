"use strict"

var Analyzer = require('./analyzer.js');
var OptionsGenerator = require('./options-generator.js');
var Helpers = require('./helpers.js');

function FableNames (options) {    
    this.options = options 
        ? this.fixOptions(options) 
        : FableNames.generateOptions();

    this.failedAttempts = {
        count: 0,
        max: 300,
        forbiddenPattern: 0,
        wrongSize: 0,
        verifyRules: 0,
        checkWord: 0
    }

    this.onAttemptSucceeded = function () {
        this.failedAttempts.count = 0;
        this.failedAttempts.forbiddenPattern = 0;
        this.failedAttempts.wrongSize = 0;
        this.failedAttempts.verifyRules = 0;
        this.failedAttempts.checkWord = 0;
    }
}

FableNames.analyze = function (words, vowels) {
    var analyzer = new Analyzer(vowels);
    return analyzer.analyze(words);
};

FableNames.generateOptions = function (vowels, consonants) {
    do {
        try {
            var optionsGenerator = new OptionsGenerator(vowels, consonants);
            var options = optionsGenerator.get();
            new FableNames(options).get(50);
            
            return options;
        } catch (ex) {
            // generate other options if this can't produce words         
        }
    } while (true);
}

FableNames.prototype.fixOptions = function (options) {
    var result = {};
    
    result.minSize = options.minSize ? options.minSize : 2;
    result.maxSize = options.maxSize ? options.maxSize : result.minSize * 6;
    result.prefixProbability = options.prefixProbability ? options.prefixProbability : 0.5;
    result.postfixProbability = options.postfixProbability ? options.postfixProbability : 0.8;
    result.repeatingSyllables = options.repeatingSyllables ? options.repeatingSyllables : 0.2;
    result.repeatingLetters = options.repeatingLetters ? options.repeatingLetters : 0.2;
    result.twoVowels = options.twoVowels ? options.twoVowels : 0.3;
    result.twoConsonants = options.twoConsonants ? options.twoConsonants : 0.3;    
    result.capitalize = options.capitalize ? options.capitalize : true;

    result.vowels = options.vowels ? options.vowels.slice(0) : "eyuioa".split(""); 

    result.prefixes = options.prefixes ? options.prefixes : undefined;
    result.syllables = options.syllables ? options.syllables : undefined;    
    result.postfixes = options.postfixes ? options.postfixes : undefined; 

    result.verifyRules = options.verifyRules;
    result.forbiddenPattern = options.forbiddenPattern;
    
    return result;
}

function getRandomWeighted(weightedDict) {
    var random = Math.random();

    for (var key in weightedDict) {
        random -= weightedDict[key];
        if (random <= 0) return key;
    }

    return getRandomWeighted(weightedDict);        
}

FableNames.prototype.get = function (attempts) {
    this.failedAttempts.count ++;

    if (this.failedAttempts.count > (attempts != undefined ? attempts : this.failedAttempts.max)) 
        throw new Error("It is impossible to match given rules, here are resons why attempts failed:\r\n" + 
            "Can't fit proper size: " + this.failedAttempts.wrongSize + "\r\n" + 
            "Matches forbidden pattern: " + this.failedAttempts.forbiddenPattern + "\r\n" + 
            "Can't pass verification rule: " + this.failedAttempts.verifyRules + "\r\n" + 
            "Contains forbidden doubles, or two vowels/consonants: " + this.failedAttempts.checkWord + "\r\n" +
            "Min size: " + this.options.minSize + "\r\n" + 
            "Max size: " + this.options.maxSize + "\r\n");

    var result = "";
    
    // Add prefix
    if (Object.keys(this.options.prefixes).length > 0 && Math.random() < this.options.prefixProbability) 
        result = getRandomWeighted(this.options.prefixes);    

    // Add postfix
    var postfix = "";
    
    if (Object.keys(this.options.prefixes).length > 0 && Math.random() < this.options.postfixProbability) 
        postfix = getRandomWeighted(this.options.postfixes);        
    
    var targetLength = Math.floor(Math.random() * (this.options.maxSize - this.options.minSize + 1)) + this.options.minSize;
    var prevSyllable = result;
    var iterations = 0;

    do {
        iterations++;
        if (iterations > 200) throw new Error("It is hard to find matching syllables, either provide more syllables or increase options.maxLength, and options.twoVowels, options.twoConsonants probabilities");

        var newSyllable = getRandomWeighted(this.options.syllables);

        // new syllable is same as previos syllable
        if (newSyllable === prevSyllable && Math.random() < this.options.repeatingSyllables) 
            continue;
        
        result += newSyllable;
        prevSyllable = newSyllable;
    } while (result.length + postfix.length < targetLength);

    result += postfix;   

    if (!Helpers.checkWord(result, this.options.vowels, this.options.repeatingLetters, this.options.twoVowels, this.options.twoConsonants)) {
        this.failedAttempts.checkWord++;
        return this.get();
    }

    // wrong size
    if (result.length < this.options.minSize || result.length > this.options.maxSize) {
        this.failedAttempts.wrongSize++;
        return this.get();        
    } 

    // capitalize
    if (this.options.capitalize) {
        result = result.split("");
        result[0] = result[0].toUpperCase();
        result = result.join("");
    }

    // verification predicate
    if (this.options.verifyRules && !this.options.verifyRules(result, this.options)) {
        this.failedAttempts.verifyRules++;
        return this.get();
    }

    // forbidden pattern
    if (this.options.forbiddenPattern && result.match(this.options.forbiddenPattern)) {
        this.failedAttempts.forbiddenPattern++;
        return this.get();
    }

    this.onAttemptSucceeded();
    return result;
}

module.exports = FableNames;
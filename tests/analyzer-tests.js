"use strict"

var assert = require('chai').assert;
var Analyzer = require('../analyzer.js');
var FableNames = require('../fable-names.js');

var romanNames = ["AELIA", "AELIANA", "AELIANUS", "AELIUS", "AEMILIA", "AEMILIANA", "AEMILIANUS", "AEMILIUS", "AETIUS", "AGRIPPA", "AGRIPPINA", "AHENOBARBUS", "ALBA", "ALBANUS", "ALBINA", "ALBINUS", "ALBUS", "ANTONIA", "ANTONINA", "ANTONINUS", "ANTONIUS", "APPIUS", "AQUILA", "AQUILINA", "AQUILINUS", "ATILIUS", "AUGUSTA", "AUGUSTINA", "AUGUSTINUS", "AUGUSTUS", "AULUS", "AURELIA", "AURELIANA", "AURELIANUS", "AURELIUS", "AVILIUS", "AVITUS", "BALBINA", "BALBINUS", "BALBUS", "BLANDINA", "BLANDINUS", "BLANDUS", "BLASIUS", "BRUTUS", "CAECILIA", "CAECILIUS", "CAELIA", "CAELINA", "CAELINUS", "CAELIUS", "CAESAR", "CAIUS", "CAMILLA", "CAMILLUS", "CASSIA", "CASSIAN", "CASSIANUS", "CASSIUS", "CATO", "CELSUS", "CICERO", "CLAUDIA", "CLAUDIUS", "CLOELIA", "CLOELIUS", "CNAEUS", "CORNELIA", "CORNELIUS", "CRISPINUS", "CRISPUS", "CYPRIANUS", "DECIMA", "DECIMUS", "DIOCLETIANUS", "DOMITIA", "DOMITIANUS", "DOMITILLA", "DOMITIUS", "DRUSA", "DRUSILLA", "DRUSUS", "DUILIUS", "EGNATIUS", "ENNIUS", "FABIA", "FABIANA", "FABIANUS", "FABIOLA", "FABIUS", "FABRICIA", "FABRICIUS", "FAUSTA", "FAUSTINA", "FAUSTINUS", "FAUSTUS", "FELIX", "FESTUS", "FLAVIA", "FLAVIANA", "FLAVIANUS", "FLAVIUS", "FLORIANA", "FLORIANUS", "FLORUS", "FULVIA", "FULVIUS", "GAIUS", "GALLUS", "GERMANA", "GERMANUS", "GLAUCIA", "GNAEUS", "GORDIANUS", "GRATIANA", "GRATIANUS", "HADRIANA", "HADRIANUS", "HERMINIA", "HERMINIUS", "HILARIA", "HILARIUS", "HORATIA", "HORATIUS", "HORTENSIA", "HORTENSIUS", "IANUARIUS", "IOVIANUS", "IOVITA", "IULIA", "IULIANA", "IULIANUS", "IULIUS", "IUNIA", "IUNIUS", "IUVENALIS", "JANUARIUS", "JOVIAN", "JULIA", "JULIANA", "JULIUS", "JUNIA", "JUNIUS", "LAELIA", "LAELIUS", "LAURENTIA", "LAURENTINA", "LAURENTINUS", "LAURENTIUS", "LIVIA", "LIVIANA", "LIVIANUS", "LIVIUS", "LONGINA", "LONGINUS", "LUCANUS", "LUCIA", "LUCIANA", "LUCIANUS", "LUCILIA", "LUCILIUS", "LUCILLA", "LUCIUS", "LUCRETIA", "LUCRETIUS", "MANIUS", "MANLIUS", "MARCELLA", "MARCELLINA", "MARCELLINUS", "MARCELLUS", "MARCIA", "MARCIUS", "MARCUS", "MARIANA", "MARIANUS", "MARINA", "MARINUS", "MARIUS", "MARTIALIS", "MARTINA", "MARTINUS", "MAXENTIUS", "MAXIMA", "MAXIMIANUS", "MAXIMILIANA", "MAXIMILIANUS", "MAXIMINUS", "MAXIMUS", "NAEVIUS", "NERO", "NERVA", "NONA", "NONUS", "OCTAVIA", "OCTAVIANUS", "OCTAVIUS", "OTHO", "OVIDIUS", "PAULA", "PAULINA", "PAULINUS", "PAULUS", "PETRONIA", "PETRONIUS", "PLINIUS", "POMPEIUS", "POMPILIUS", "POMPONIA", "POMPONIUS", "PONTIUS", "PORCIA", "PORCIUS", "PRISCA", "PRISCILLA", "PRISCUS", "PUBLIUS", "QUINTILIANUS", "QUINTILLUS", "QUINTINA", "QUINTINUS", "QUINTUS", "REGULUS", "RUFINA", "RUFINUS", "RUFUS", "SABINA", "SABINUS", "SATURNINA", "SATURNINUS", "SCAEVOLA", "SECUNDINUS", "SECUNDUS", "SENECA", "SEPTIMA", "SEPTIMIUS", "SEPTIMUS", "SERGIUS", "SERVIUS", "SEVERIANUS", "SEVERINA", "SEVERINUS", "SEVERUS", "SEXTILIUS", "SEXTUS", "SILVANUS", "SPURIUS", "TACITA", "TACITUS", "TARQUINIUS", "TATIANA", "TATIANUS", "TATIUS", "TERENTIUS", "TERTIUS", "THRACIUS", "TIBERIUS", "TIBURTIUS", "TITIANA", "TITIANUS", "TITUS", "TRAIANUS", "TULLIA", "TULLIUS", "VALENS", "VALENTINA", "VALENTINIANUS", "VALENTINUS", "VALERIA", "VALERIANA", "VALERIANUS", "VALERIUS", "VARINIA", "VARINIUS", "VARIUS", "VERGILIUS", "VERGINIA", "VERGINIUS", "VESPASIANUS", "VIBIANA", "VIBIANUS", "VIBIUS", "VINICIUS", "VIRGINIA", "VITA", "VITUS"];

var checkWeightedResults = function (dict, expectedKeys) {
    var total = 0;
    var count = 0;
    for (var key in dict) {
        count++;
        total += dict[key];
        assert.equal(true, expectedKeys.indexOf(key) != -1, key + " is missing");
    }
    assert.equal(total, 1);
    assert.equal(expectedKeys.length, count);
}

describe('Analyzer.makeWeighted', function () {
    it('simple', function() {
        checkWeightedResults(Analyzer.makeWeighted({'a': 0, 'b': 50, 'c': 100}), ['a', 'b', 'c']);
    });
    it('empty', function() {
        assert.deepEqual({}, Analyzer.makeWeighted({}));
    });
    it('zero', function() {
        assert.deepEqual({'a': 0}, Analyzer.makeWeighted({'a': 0}));
    });
});


describe('Analyzer.analyze', function () {
    var analyzer = new Analyzer();


    it('count syllables', function() {
        var result = analyzer.analyze(["asdasba", "bazar", "cozar"]).syllables;
        checkWeightedResults(result, ["as", "das", "ba", "zar", "co"]);
        assert.isAbove(result.ba, result.as);
    });
    it('count prefixes', function() {  
        assert.deepEqual( { "ga": 0.6, "gaz": 0.4 }, analyzer.analyze(["gazebo", "gaz", "garda", "kinza"]).prefixes);

        var result = analyzer.analyze(["gazebo", "gaz", "garda", "kinza"]).prefixes;
        checkWeightedResults(result, ["ga", "gaz"]);
    });
    it('count postfixes', function() {
        var result = analyzer.analyze(["gratov", "simonova", "kuibeshev", "sova", "kritova", "satov"]).postfixes
        checkWeightedResults(result, ["atov", "ov", "ova", "tov", "va"]);
    });
    it('roman names', function() { 
        var romanOptions = analyzer.analyze(romanNames);
        assert.isTrue(Object.keys(romanOptions.syllables).length > 0);
        assert.isTrue(Object.keys(romanOptions.prefixes).length > 0);
        assert.isTrue(Object.keys(romanOptions.postfixes).length > 0);
        assert.isBelow(romanOptions.minSize, romanOptions.maxSize);

        assert.doesNotThrow(() => new FableNames(romanOptions).get(50));
    });
});

describe('Analyzer.getSyllables', function () {
    var analyzer = new Analyzer();

    var getSyllables = function (word) {
        var result = [];
        for (let syllable of Analyzer.getSyllables(word, analyzer.vowels)) 
            result.push(syllable);

        return result;        
    }

    it('empty', function() {  
        assert.deepEqual(getSyllables(""), []);
    });

    it('simple', function() {  
        assert.deepEqual(getSyllables("badu"), ["ba", "du"]);
        assert.deepEqual(getSyllables("duba"), ["du", "ba"]);
    });
    it('only vowels', function() {  
        assert.deepEqual(getSyllables("a"), ["a"]);
        assert.deepEqual(getSyllables("ae"), ["a", "e"]);
        assert.deepEqual(getSyllables("uae"), ["u", "a", "e"]);
    });
    it('only consonants', function() {  
        assert.deepEqual(getSyllables("p"), ["p"]);
        assert.deepEqual(getSyllables("dr"), ["dr"]);
        assert.deepEqual(getSyllables("str"), ["str"]);
    });
    it('real examples', function() {  
        assert.deepEqual(getSyllables("arguments"), ["ar", "gu", "ments"]);
        assert.deepEqual(getSyllables("substring"), ["sub", "string"]);
        assert.deepEqual(getSyllables("treated"), ["tre", "a", "ted"]);
        assert.deepEqual(getSyllables("original"), ["o", "ri", "gi", "nal"]);
        assert.deepEqual(getSyllables("extraction"), ["ex", "trac", "ti", "on"]);
        assert.deepEqual(getSyllables("dependencies"), ["de", "pen", "den", "ci", "es"]);
        assert.deepEqual(getSyllables("przepraszam"), ["przep", "ras", "zam"]);
    });
});




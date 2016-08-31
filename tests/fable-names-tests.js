var assert = require('chai').assert;
var FableNames = require('../fable-names.js');

var romanNames = ["AELIA", "AELIANA", "AELIANUS", "AELIUS", "AEMILIA", "AEMILIANA", "AEMILIANUS", "AEMILIUS", "AETIUS", "AGRIPPA", "AGRIPPINA", "AHENOBARBUS", "ALBA", "ALBANUS", "ALBINA", "ALBINUS", "ALBUS", "ANTONIA", "ANTONINA", "ANTONINUS", "ANTONIUS", "APPIUS", "AQUILA", "AQUILINA", "AQUILINUS", "ATILIUS", "AUGUSTA", "AUGUSTINA", "AUGUSTINUS", "AUGUSTUS", "AULUS", "AURELIA", "AURELIANA", "AURELIANUS", "AURELIUS", "AVILIUS", "AVITUS", "BALBINA", "BALBINUS", "BALBUS", "BLANDINA", "BLANDINUS", "BLANDUS", "BLASIUS", "BRUTUS", "CAECILIA", "CAECILIUS", "CAELIA", "CAELINA", "CAELINUS", "CAELIUS", "CAESAR", "CAIUS", "CAMILLA", "CAMILLUS", "CASSIA", "CASSIAN", "CASSIANUS", "CASSIUS", "CATO", "CELSUS", "CICERO", "CLAUDIA", "CLAUDIUS", "CLOELIA", "CLOELIUS", "CNAEUS", "CORNELIA", "CORNELIUS", "CRISPINUS", "CRISPUS", "CYPRIANUS", "DECIMA", "DECIMUS", "DIOCLETIANUS", "DOMITIA", "DOMITIANUS", "DOMITILLA", "DOMITIUS", "DRUSA", "DRUSILLA", "DRUSUS", "DUILIUS", "EGNATIUS", "ENNIUS", "FABIA", "FABIANA", "FABIANUS", "FABIOLA", "FABIUS", "FABRICIA", "FABRICIUS", "FAUSTA", "FAUSTINA", "FAUSTINUS", "FAUSTUS", "FELIX", "FESTUS", "FLAVIA", "FLAVIANA", "FLAVIANUS", "FLAVIUS", "FLORIANA", "FLORIANUS", "FLORUS", "FULVIA", "FULVIUS", "GAIUS", "GALLUS", "GERMANA", "GERMANUS", "GLAUCIA", "GNAEUS", "GORDIANUS", "GRATIANA", "GRATIANUS", "HADRIANA", "HADRIANUS", "HERMINIA", "HERMINIUS", "HILARIA", "HILARIUS", "HORATIA", "HORATIUS", "HORTENSIA", "HORTENSIUS", "IANUARIUS", "IOVIANUS", "IOVITA", "IULIA", "IULIANA", "IULIANUS", "IULIUS", "IUNIA", "IUNIUS", "IUVENALIS", "JANUARIUS", "JOVIAN", "JULIA", "JULIANA", "JULIUS", "JUNIA", "JUNIUS", "LAELIA", "LAELIUS", "LAURENTIA", "LAURENTINA", "LAURENTINUS", "LAURENTIUS", "LIVIA", "LIVIANA", "LIVIANUS", "LIVIUS", "LONGINA", "LONGINUS", "LUCANUS", "LUCIA", "LUCIANA", "LUCIANUS", "LUCILIA", "LUCILIUS", "LUCILLA", "LUCIUS", "LUCRETIA", "LUCRETIUS", "MANIUS", "MANLIUS", "MARCELLA", "MARCELLINA", "MARCELLINUS", "MARCELLUS", "MARCIA", "MARCIUS", "MARCUS", "MARIANA", "MARIANUS", "MARINA", "MARINUS", "MARIUS", "MARTIALIS", "MARTINA", "MARTINUS", "MAXENTIUS", "MAXIMA", "MAXIMIANUS", "MAXIMILIANA", "MAXIMILIANUS", "MAXIMINUS", "MAXIMUS", "NAEVIUS", "NERO", "NERVA", "NONA", "NONUS", "OCTAVIA", "OCTAVIANUS", "OCTAVIUS", "OTHO", "OVIDIUS", "PAULA", "PAULINA", "PAULINUS", "PAULUS", "PETRONIA", "PETRONIUS", "PLINIUS", "POMPEIUS", "POMPILIUS", "POMPONIA", "POMPONIUS", "PONTIUS", "PORCIA", "PORCIUS", "PRISCA", "PRISCILLA", "PRISCUS", "PUBLIUS", "QUINTILIANUS", "QUINTILLUS", "QUINTINA", "QUINTINUS", "QUINTUS", "REGULUS", "RUFINA", "RUFINUS", "RUFUS", "SABINA", "SABINUS", "SATURNINA", "SATURNINUS", "SCAEVOLA", "SECUNDINUS", "SECUNDUS", "SENECA", "SEPTIMA", "SEPTIMIUS", "SEPTIMUS", "SERGIUS", "SERVIUS", "SEVERIANUS", "SEVERINA", "SEVERINUS", "SEVERUS", "SEXTILIUS", "SEXTUS", "SILVANUS", "SPURIUS", "TACITA", "TACITUS", "TARQUINIUS", "TATIANA", "TATIANUS", "TATIUS", "TERENTIUS", "TERTIUS", "THRACIUS", "TIBERIUS", "TIBURTIUS", "TITIANA", "TITIANUS", "TITUS", "TRAIANUS", "TULLIA", "TULLIUS", "VALENS", "VALENTINA", "VALENTINIANUS", "VALENTINUS", "VALERIA", "VALERIANA", "VALERIANUS", "VALERIUS", "VARINIA", "VARINIUS", "VARIUS", "VERGILIUS", "VERGINIA", "VERGINIUS", "VESPASIANUS", "VIBIANA", "VIBIANUS", "VIBIUS", "VINICIUS", "VIRGINIA", "VITA", "VITUS"];

var russianNames = ["Авдей", "Авксентий", "Агафон", "Александр", "Алексей", "Альберт", "Альвиан", "Анатолий", "Андрей", "Антон", "Антонин", "Аристарх", "Аркадий", "Арсений", "Артём", "Артур", "Богдан", "Борис", "Вадим", "Валентин", "Валерий", "Валерьян", "Варлам", "Василий", "Венедикт", "Вениамин", "Виктор", "Виталий", "Владимир", "Владислав", "Владлен", "Всеволод", "Вячеслав", "Гавриил", "Геласий", "Геннадий", "Георгий", "Герасим", "Герман", "Глеб", "Гордей", "Григорий", "Даниил", "Демьян", "Денис", "Дмитрий", "Дорофей", "Евгений", "Евграф", "Евсей", "Егор", "Еремей", "Ермолай", "Ефим", "Иакинф", "Иван", "Игнатий", "Игорь", "Илья", "Иннокентий", "Ириней", "Исидор", "Иулиан", "Касьян", "Ким", "Кондрат", "Константин", "Кузьма", "Куприян", "Лаврентий", "Леонид", "Леонтий", "Лука", "Лукий", "Лукьян", "Макар", "Максим", "Мартын", "Матвей", "Мелентий", "Митрофан", "Михаил", "Мстислав", "Мэлор", "Никита", "Николай", "Олег", "Онисим", "Павел", "Пантелеймон", "Парфений", "Пётр", "Порфирий", "Прокопий", "Протасий", "Прохор", "Разумник", "Роман", "Ростислав", "Руслан", "Савва", "Святослав", "Семён", "Сергей", "Созон", "Спиридон", "Станислав", "Степан", "Тимофей", "Тихон", "Трифон", "Трофим", "Фаддей", "Фёдор", "Федосей", "Федот", "Филат", "Фома", "Фрол", "Харитон", "Христофор", "Эдуард", "Эраст", "Юлиан", "Юрий", "Юстин", "Яков", "Якун", "Ярослав"];


describe('FableNames.get', function () {
    it('with options', function() {
        var names = [];

        // analyze russian names
        var analyzer = new FableNames.Analyzer("ауоыиэяюёе");
        var russinaNameOptions = analyzer.analyze(russianNames);

        // forbid few patterns
        russinaNameOptions.forbiddenPattern = /^[ъьйы]|ю.*ю|я.*я|э.*э|[ауоыиэяюёе]ь|й[ауоыиэяюёе]|йь/i;

        // create only unique names
        russinaNameOptions.verifyRules = (word, options) => names.indexOf(word) === -1;

        var russianNameGenerator = new FableNames(russinaNameOptions);        

        for (var i = 0; i < 100; i++) {
            var name = russianNameGenerator.get();
            console.log(name);   
            names.push(name);
        }     
    });
});
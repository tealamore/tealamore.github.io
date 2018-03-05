// I know that technically I could make this into a verbose library that 
// handles tons of cases, but I honestly don't see the need when it's good 
// enough like this.
var invisible = 'invisible';
var infoBox = 'infoBox'

var expandoInfoBox = function (basicInfo, detailedInfo) {
    document.getElementById(basicInfo).classList.add(invisible)
    document.getElementById(detailedInfo).classList.remove(invisible)
}

var closeoInfoBox = function (basicInfo, detailedInfo) {
    document.getElementById(basicInfo).classList.remove(invisible)
    document.getElementById(detailedInfo).classList.add(invisible)
}

var expandoLink = function (detailedInfo) {
    if (document.getElementById(detailedInfo).classList.contains(invisible)) {
        document.getElementById(detailedInfo).classList.remove(invisible);
        document.getElementById(detailedInfo).classList.add(infoBox);
    } else {
        document.getElementById(detailedInfo).classList.add(invisible);
        document.getElementById(detailedInfo).classList.remove(infoBox);
    }
}
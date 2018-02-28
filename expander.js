// I know that technically I could make this into a verbose library that 
// handles tons of cases, but I honestly don't see the need when it's good 
// enough like this.

var expando = function (basicInfo, detailedInfo) {
    document.getElementById(basicInfo).classList.add('invisible')
    document.getElementById(detailedInfo).classList.remove('invisible')
}

var closeo = function (basicInfo, detailedInfo) {
    document.getElementById(basicInfo).classList.remove('invisible')
    document.getElementById(detailedInfo).classList.add('invisible')
}
let assetValue = document.getElementById("asset");
let costValue = document.getElementById("costPrize");
let soldValue = document.getElementById("soldPrize");
let indexValueEle = document.getElementById("indexValue");
let indexValueEle1 = document.getElementById("indexValue1");
let investedValueEle = document.getElementById("investedValue");
let alertYearEle = document.getElementById("alertYear");
let taxValueEle = document.getElementById("taxValue");
let incomeValue = document.getElementById("investment");
let purchaseDate = document.getElementById("dateFixer").value;
let SaleDate = document.getElementById("soldDate").value;
let saleYear = new Date(SaleDate.value).getFullYear();
let purchaseYear = new Date(purchaseDate.value).getFullYear();
let yearsList = ["2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"];
let indexList = [100,105,109,113,117,122,129,137,148,167,184,200,220,240,254,264,272,280,289,301,317,331,348,363];

function evalution(e){
    alert(e.target.value);
}

function handler1(e){
    let date1 = e.target.value;
    let stringDate1 = date1.toString();
    let year1 = stringDate1.slice(0,4);
    for (let i = 0; i < yearsList.length; i++){
        switch (year1){
            case yearsList[i]:
                indexValueEle1.style.display="block";
                indexValueEle1.textContent="CII (INDEX) :"+indexList[i-1].toString();
                break;
            case "":
                indexValueEle1.style.display="none";
                break;
        }
    }
}

function calculateYearDifference() {
    let date1 = document.getElementById("dateFixer").value;
    let date2 = document.getElementById("soldDate").value;
    let year1 = new Date(date1).getFullYear();
    let year2 = new Date(date2).getFullYear();
    let difference = Math.abs(year2 - year1); 
    let check = date1 && date2;
    if (check && (difference > 2)) { 
        alertYearEle.style.display="inline";
        taxValueEle.textContent = "Long Term Capital Gain Tax for "+difference.toString()+" Years";  
    } else if (check && (difference < 2)) {
        alertYearEle.style.display="inline";
        taxValueEle.textContent = "Short Term Capital Gain Tax for "+difference.toString()+" Year";
    }
    else {
        alert("Please Check Sale Date");
        alertYearEle.style.display="none";
        
    }
}


function handler(e) {
    let date = e.target.value;
    let stringDate = date.toString();
    let year = stringDate.slice(0,4);
    for (let i = 0; i < yearsList.length; i++){
        switch (year){
            case yearsList[i]:
                indexValueEle.style.display="block";
                indexValueEle.textContent ="CII (INDEX) :"+indexList[i-1].toString();
                break;
            case "":
                indexValueEle.style.display="none";
                alertYearEle.style.display = "none";
                break;
        }
    }
    calculateYearDifference();
}

function checker(e){
    if (e.target.value ==="no") {
        alert("Sorry You Can't Use this Calculator Income being not taxable in India, however if amounts & dates entered in all the fields this will show Gain and The Tax just for academic purpose");  
    }
}

function invested(e){
    if (e.target.value ==="yes"){
        investedValueEle.textContent= incomeValue.value;
        investedValueEle.style.display="inline";
    } else {
        investedValueEle.style.display="none";
        alert("Then You need to pay the tax fully");
    }
}

function submission() {
    let finalPrize =  soldValue.value - costValue.value;
    let highTax = 20/100;
    let lowTax = 10/100;
    let taxValue1 = parseInt(highTax*finalPrize);
    if (finalPrize > 100000){
        alert("You have to pay 20% tax");
        alert(" Your need pay tax upto "+ taxValue1.toString());

    }
    alert(finalPrize);
}

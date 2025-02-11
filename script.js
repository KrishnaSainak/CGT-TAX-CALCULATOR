let assetValue = document.getElementById("asset");
let costValue = document.getElementById("costPrize");
let soldValue = document.getElementById("soldPrize");
let indexValueEle = document.getElementById("indexValue");
let indexValueEle1 = document.getElementById("indexValue1");
let investedValueEle = document.getElementById("investedValue");
let alertYearEle = document.getElementById("alertYear");
let taxValueEle = document.getElementById("taxValue");
let incomeValue = document.getElementById("investment");
let stampDutyValueEle = document.getElementById("stampDutyValue");
let costConstructionEle = document.getElementById("costConstruction");
let costImprovementEle = document.getElementById("costImprovement");
let stampPVEle = document.getElementById("stampPV");

let yearsList = [
    "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010",
    "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020",
    "2021", "2022", "2023", "2024", "2025"
];

let indexList = [
    100, 105, 109, 113, 117, 122, 129, 137, 148, 167, 184, 200, 220, 240, 
    254, 264, 272, 280, 289, 301, 317, 331, 348, 363
];

function evalution(e) {
    alert(e.target.value);
}

function getStampValue(e) {
    let soldValueE = Number(e.target.value) || 0;
    let percent = 9 / 100;
    let finalV = Math.round(soldValueE * percent);

    stampPVEle.style.display = soldValueE === 0 ? "none" : "block";
    stampPVEle.textContent = `This is the stamp duty value you need to pay: ₹${finalV}`;
}

function handler1(e) {
    let year1 = e.target.value.slice(0, 4);

    for (let i = 0; i < yearsList.length; i++) {
        if (year1 === yearsList[i]) {
            indexValueEle1.style.display = "block";
            indexValueEle1.textContent = `CII (INDEX): ${indexList[i - 1]}`;
            return;
        }
    }

    indexValueEle1.style.display = "none";
}

function calculateYearDifference() {
    let date1 = document.getElementById("dateFixer").value;
    let date2 = document.getElementById("soldDate").value;

    if (!date1 || !date2) {
        alert("Please select both Purchase Date and Sale Date.");
        alertYearEle.style.display = "none";
        return;
    }

    let year1 = new Date(date1).getFullYear();
    let year2 = new Date(date2).getFullYear();

    if (isNaN(year1) || isNaN(year2)) {
        alert("Invalid date format. Please re-enter the dates.");
        return;
    }

    let difference = Math.abs(year2 - year1);
    alertYearEle.style.display = "inline";
    taxValueEle.textContent = difference > 2
        ? `Long Term Capital Gain Tax for ${difference} Years`
        : `Short Term Capital Gain Tax for ${difference} Year`;
}

function handler(e) {
    let year = e.target.value.slice(0, 4);

    for (let i = 0; i < yearsList.length; i++) {
        if (year === yearsList[i]) {
            indexValueEle.style.display = "block";
            indexValueEle.textContent = `CII (INDEX): ${indexList[i - 1]}`;
            break;
        }
    }

    calculateYearDifference();
}

function checker(e) {
    if (e.target.value === "no") {
        alert("Sorry, you can't use this calculator. Income is not taxable in India. However, if you enter all values, it will show gain and tax just for academic purposes.");
    }
}

function invested(e) {
    if (e.target.value === "yes") {
        investedValueEle.textContent = incomeValue.value;
        investedValueEle.style.display = "inline";
        alert("Then there is an exemption for the tax.");
    } else {
        investedValueEle.style.display = "none";
        alert("Then you need to pay the tax fully.");
    }
}

function submission(event) {
    event.preventDefault(); // Prevents form submission & page reload

    // Get input values
    let soldInt = parseInt(document.getElementById("soldPrize").value) || 0;
    let costInt = parseInt(document.getElementById("costPrize").value) || 0;
    let stampInt = parseInt(document.getElementById("stampDutyValue").value) || 0;
    let constInt = parseInt(document.getElementById("costConstruction").value) || 0;
    let impInt = parseInt(document.getElementById("costImprovement").value) || 0;
    let brokerFee = parseInt(document.getElementById("brokerValue").value) || 0;
    let investmentAmount = parseInt(document.getElementById("investment").value) || 0;
    let saleYearInput = document.getElementById("soldDate").value;

    // Format value in Indian Rupees
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    }

    if (!saleYearInput) {
        alert("Please enter the Sale Date!");
        return;
    }

    // Calculate Net Sale Consideration
    let netSale = soldInt - stampInt - brokerFee;
    let totalGain = netSale - costInt - constInt - impInt;
    
    if (totalGain <= 0) {
        alert("No taxable capital gain.");
        return;
    }

    // Apply 20% and 12.5% Tax Calculation
    let taxValue1 = Math.max(0, parseInt(0.20 * totalGain)); // 20% tax
    let taxValue2 = Math.max(0, parseInt(0.125 * totalGain)); // 12.5% tax

    // Determine tax rate based on sale date
    let saleDate = new Date(saleYearInput);
    let referenceDate = new Date("2024-07-23");
    let applicableTax = saleDate > referenceDate ? taxValue2 : taxValue1;
    let taxRate = saleDate > referenceDate ? "12.5%" : "20%";

    // Section 54 / 54F exemption logic
    let taxableAfterInvestment = Math.max(0, totalGain - investmentAmount);
    let taxAfter54 = saleDate > referenceDate ? taxableAfterInvestment * 0.125 : taxableAfterInvestment * 0.20;
    let exemptionMessage = investmentAmount >= totalGain ? 
        "Full Exemption under Sec 54/54F - No Tax Payable" : 
        `Partial Tax Payable after Sec 54/54F: ${formatCurrency(taxAfter54)}`;

    // Get modal body element
    let modalBody = document.getElementById("modalBody");

    // Display results in the modal
    modalBody.innerHTML = `
        <p><strong>Capital Gain:</strong> ${formatCurrency(totalGain)}</p>
        <p><strong>Tax at 20%:</strong> ${formatCurrency(taxValue1)}</p>
        <p><strong>Tax at 12.5% (If Sale is After 23rd July 2024):</strong> ${formatCurrency(taxValue2)}</p>
        <p><strong>Suggested Tax (Lowest Option):</strong> ${formatCurrency(applicableTax)} (${taxRate})</p>
        <p><strong>Section 54 / 54F Consideration: If you Invest in India the Tax will be "nill"OR If not you need pay the tax fully as mentioned here 👉 </strong> ${exemptionMessage}</p>
    `;

    // Show the modal
    let modal = new bootstrap.Modal(document.getElementById("resultModal"));
    modal.show();
}







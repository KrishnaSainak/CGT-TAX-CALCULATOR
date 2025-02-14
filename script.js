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
    let finalV = Math.round(soldValueE);

    stampPVEle.style.display = soldValueE === 0 ? "none" : "block";
    stampPVEle.textContent = `This is the stamp duty value: ₹${finalV} paying`;
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
    event.preventDefault(); // Prevent form submission & page reload

    // Get input values
    let soldInt = parseFloat(document.getElementById("soldPrize").value) || 0;
    let costInt = parseFloat(document.getElementById("costPrize").value) || 0;
    let stampInt = parseFloat(document.getElementById("stampDutyValue").value) || 0;
    let constInt = parseFloat(document.getElementById("costConstruction").value) || 0;
    let impInt = parseFloat(document.getElementById("costImprovement").value) || 0;
    let brokerFee = parseFloat(document.getElementById("brokerValue").value) || 0;
    let investmentAmount = parseFloat(document.getElementById("investment").value) || 0;
    let saleYearInput = document.getElementById("soldDate").value;
    let purchaseYearInput = document.getElementById("dateFixer").value;

    // Format value in Indian Rupees
    function formatCurrency(value) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    }

    if (!saleYearInput || !purchaseYearInput) {
        alert("Please enter both Sale Date and Purchase Date!");
        return;
    }

    // Convert dates to JavaScript Date objects
    let saleDate = new Date(saleYearInput);
    let purchaseDate = new Date(purchaseYearInput);

    // Determine if holding period is less than 2 years
    let holdingPeriod = (saleDate - purchaseDate) / (1000 * 60 * 60 * 24 * 365); // Convert milliseconds to years
    let isShortTerm = holdingPeriod < 2;

    // Use the maximum of soldInt and stampInt
    let mainSoldInt = Math.max(soldInt, stampInt);

    // Calculate Net Sale Consideration
    let netSale = mainSoldInt - brokerFee;
    let totalGain = netSale - costInt - constInt - impInt;

    if (totalGain <= 0) {
        alert("No taxable capital gain.");
        return;
    }

    // Apply tax calculations
    let taxValue1 = totalGain * 0.20; // 20% tax
    let taxValue2 = totalGain * 0.125; // 12.5% tax
    let shortTermTax = totalGain * 0.312; // 31.2% tax for short-term gain

    // Determine tax rate based on holding period and sale date
    let referenceDate = new Date("2024-07-23");
    let applicableTax, taxRate;

    if (isShortTerm) {
        applicableTax = shortTermTax;
        taxRate = "31.2% (Short-Term Tax)";
    } else {
        applicableTax = saleDate > referenceDate ? taxValue2 : taxValue1;
        taxRate = saleDate > referenceDate ? "12.5%" : "20%";
    }

    // Section 54 / 54F exemption logic
    let taxableAfterInvestment = Math.max(0, totalGain - investmentAmount);
    let taxAfter54 = isShortTerm ? taxableAfterInvestment * 0.312 : taxableAfterInvestment * (saleDate > referenceDate ? 0.125 : 0.20);
    let exemptionMessage = investmentAmount >= totalGain ?
        "Full Exemption under Sec 54/54F - No Tax Payable" :
        `Partial Tax Payable after Sec 54/54F: ${formatCurrency(taxAfter54)}`;

    // Get modal body element
    let modalBody = document.getElementById("modalBody");

    // Create table structure
    let tableHTML = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><strong>Main Sale Value</strong></td><td>${formatCurrency(mainSoldInt)}</td></tr>
                <tr><td>Broker Fee</td><td>${formatCurrency(brokerFee)}</td></tr>
                <tr><td><strong>Net Sale Consideration</strong></td><td>${formatCurrency(netSale)}</td></tr>
                <tr><td>Cost of Purchase</td><td>${formatCurrency(costInt)}</td></tr>
                <tr><td>Cost of Construction</td><td>${formatCurrency(constInt)}</td></tr>
                <tr><td>Cost of Improvement</td><td>${formatCurrency(impInt)}</td></tr>
                <tr><td><strong>Net Capital Gain</strong></td><td>${formatCurrency(totalGain)}</td></tr>`;

    // If it's long-term capital gain, display 20% and 12.5% tax
    if (!isShortTerm) {
        tableHTML += `
                <tr><td>Tax at 20%</td><td>${formatCurrency(taxValue1)}</td></tr>
                <tr><td>Tax at 12.5% (If Sale is After 23rd July 2024)</td><td>${formatCurrency(taxValue2)}</td></tr>`;
    } else {
        // If it's short-term capital gain, show 31.2% tax only
        tableHTML += `
                <tr><td><strong>Short-Term Tax (31.2%)</strong></td><td>${formatCurrency(shortTermTax)}</td></tr>`;
    }

    // Add final tax section
    tableHTML += `
                <tr><td><strong>Suggested Tax (Lowest Option)</strong></td><td>${formatCurrency(applicableTax)} (${taxRate})</td></tr>
                <tr><td>Investment in India for Sec 54/54F</td><td>${formatCurrency(investmentAmount)}</td></tr>
                <tr><td><strong>Final Tax Payable</strong></td><td>${exemptionMessage}</td></tr>
            </tbody>
        </table>`;

    // Insert table into modal
    modalBody.innerHTML = tableHTML;

    // Show the modal
    let modal = new bootstrap.Modal(document.getElementById("resultModal"));
    modal.show();
}








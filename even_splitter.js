// Max sales tax percentage in the US
const MAX_SALES_TAX_PERCENTAGE = 0.125;

// Split the total amount plus tip evenly by the number of diners
const splitTotalEvenly = () => {
    const billTotal = parseFloat(document.getElementById('split-total').value);
    const numDiners = parseInt(document.getElementById('num-diners').value);
    const tax = parseFloat(document.getElementById('tax').value);
    const tipPercentage = document.getElementById('tip').value;

    const subTotal = billTotal - tax;
    const taxPercentage = tax / subTotal;

    if (taxPercentage > MAX_SALES_TAX_PERCENTAGE) {
        window.alert('Invalid total and tax amounts');
        return;
    }

    let tipTotal = 0;
    let totalPlusTip = parseFloat(billTotal);
    if (tipPercentage === 'Custom') {
        const customTip = parseFloat(document.getElementById('custom-tip').value);
        tipTotal = customTip;
        totalPlusTip += parseFloat(customTip);
    } else {
        tipTotal = subTotal * parseFloat(tipPercentage);
        totalPlusTip += parseFloat(tipTotal);
    }

    const splitAmount = totalPlusTip / numDiners;
    
    const totals = document.createElement('div');
    
    totals.innerHTML = `
        <p>Tax: <span id="even-tip-amount">${formatCurrency(tipTotal)}</span> </p>
        <p>Bill Total:<span id="even-total-amount">${formatCurrency(totalPlusTip)}</span> </p>
        <p>Each Person:<span id="split-amount">${formatCurrency(splitAmount)}</span> </p> 
    `;

    const calculationsContainer = document.querySelector('.even-calculations');
    totals.classList.add('calculations');

    calculationsContainer.append(totals);
    calculationsContainer.style.display = 'flex';
};

// Format the given number into US currency
function formatCurrency(number) {
    const formattedNumber = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(number);

    return formattedNumber;
} 

window.addEventListener('DOMContentLoaded', () => {
    // Allow user to enter a custom tip
    const tipDropdown = document.getElementById('tip');
    tipDropdown.addEventListener('change', () => {
        const customTip = document.getElementById('custom-tip');
        if (tipDropdown.value === 'Custom') {
            customTip.style.display = 'flex';
            customTip.required = true;
        } else {
            customTip.style.display = 'none';
            customTip.required = false;
        }
    });
});
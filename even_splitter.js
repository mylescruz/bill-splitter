// Max sales tax percentage in the US
const MAX_SALES_TAX_PERCENTAGE = 0.125;

// Split the total amount plus tip evenly by the number of diners
const splitTotalEvenly = () => {
    const billTotal = parseFloat(document.getElementById('split-total').value);
    const numDiners = parseInt(document.getElementById('num-diners').value);
    const tax = parseFloat(document.getElementById('tax').value);
    let gratuity = document.getElementById('gratuity').value;
    if (gratuity === "") {
        gratuity = 0;
    } else {
        gratuity = parseFloat(gratuity);
    }
    const tipPercentage = document.getElementById('tip').value;

    const subTotal = billTotal - gratuity - tax;
    const taxPercentage = tax / subTotal;

    if (taxPercentage > MAX_SALES_TAX_PERCENTAGE) {
        window.alert('Invalid total and tax amounts');
        return;
    }

    let totalPlusTip = parseFloat(billTotal);
    if (tipPercentage === 'Custom') {
        const customTip = parseFloat(document.getElementById('custom-tip').value);
        totalPlusTip += parseFloat(customTip);
    } else {
        const tipAmount = subTotal * parseFloat(tipPercentage);
        totalPlusTip += parseFloat(tipAmount);
    }

    const splitAmount = totalPlusTip / numDiners;
    
    document.getElementById('even-total-amount').textContent = `${formatCurrency(totalPlusTip)}`;
    document.getElementById('split-amount').textContent = `${formatCurrency(splitAmount)}`;

    document.querySelector('.even-calculations').style.display = 'flex';
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
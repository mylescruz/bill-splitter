const splitTotalEvenly = () => {
    const billTotal = parseFloat(document.getElementById('split-total').value);
    const numPeople = parseInt(document.getElementById('num-people').value);
    const tax = parseFloat(document.getElementById('tax').value);
    const tipPercentage = document.getElementById('tip').value;

    let total = 0;

    if (tipPercentage === 'Custom') {
        const customTip = parseFloat(document.getElementById('custom-tip').value);
        total = parseFloat(billTotal) + parseFloat(customTip);
    } else {
        let subTotal = billTotal - tax;
        let tipAmount = subTotal * parseFloat(tipPercentage);
        
        total = parseFloat(billTotal) + parseFloat(tipAmount);
    }
    const splitAmount = total / numPeople;
    
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
    document.getElementById('split-amount').textContent = `$${splitAmount.toFixed(2)}`;

    document.querySelector('.even-calculations').style.display = 'flex';
};

window.addEventListener('DOMContentLoaded', () => {
    // Split total evenly
    document.getElementById('split-even-btn').addEventListener('click', splitTotalEvenly);

    // Enter custom tip
    const tipDropdown = document.getElementById('tip');
    tipDropdown.addEventListener('change', () => {
        const customTip = document.getElementById('custom-tip');
        if (tipDropdown.value === 'Custom') {
            customTip.style.display = 'flex';
        } else {
            customTip.style.display = 'none';
        }
    });
});
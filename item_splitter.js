// Define a new map with a shared diner for shared items
const diners = new Map([
    ['Shared',[]]
]);

// Max sales tax percentage in the US
const MAX_SALES_TAX_PERCENTAGE = 0.1035;

// Add a diner to the dropdown
const dinerOptions = () => {
    diners.forEach((items, diner) => {
        const dinerOption = document.createElement('option');
        dinerOption.value = diner;
        dinerOption.text = diner;
        document.getElementById('diners-dropdown').add(dinerOption);
    });
};

// Add a diner to the diners map
const addDiners = () => {
    const nameInput = document.getElementById('diner-name');

    diners.set(nameInput.value, []);
    
    const diner = document.createElement('p');
    diner.classList.add('diner');
    diner.innerHTML = nameInput.value;
    nameInput.value='';
    document.querySelector('.added-diners').appendChild(diner);

    console.log("Inputed diners: ", diners);

    // Allow a user to move on to the next screen after adding enough diners
    if (diners.size > 2) {
        document.getElementById('diner-next-btn').style.display = 'inline';
    }
};

// Enter ordered items
const enterItems = () => {
    const item = document.getElementById('item-name');
    const dinerDropdown = document.getElementById('diners-dropdown');
    const itemPrice = document.getElementById('item-price');

    if (diners.has(dinerDropdown.value)) {
        diners.get(dinerDropdown.value).push({
            item: item.value,
            price: itemPrice.value
        });
    } else {
        diners.set(dinerDropdown.value,[
            {
                item: item.value,
                price: itemPrice.value
            }
        ]);
    }

    console.log("Diners with their items: ", diners);

    const food = document.createElement('p');
    food.classList.add('ordered-item');
    if (dinerDropdown.value === 'Shared') {
        food.innerHTML = `• The group ordered ${item.value} for ${formatCurrency(itemPrice.value)}`;
    } else {
        food.innerHTML = `• ${dinerDropdown.value} ordered a ${item.value} for ${formatCurrency(itemPrice.value)}`;
    }
    document.querySelector('.items-added').appendChild(food);

    item.value = '';
    itemPrice.value = '';
}

// Calculations for splitting the items
let splitComplete = false;

const splitTotalByItem = () => {
    if (splitComplete) {
        let calculationsContainer = document.querySelector('.calculations');
        calculationsContainer.remove();
    }
    let calculationsContainer = document.createElement('div');
    calculationsContainer.classList.add('calculations');
    
    let calculatedTotal = document.createElement('p');
    calculatedTotal.classList.add('calculated-total');
    calculatedTotal.innerHTML = 'Bill Total with Tip';
    let totalAmount = document.createElement('p');
    totalAmount.setAttribute('id','total-amount');

    const billTotal = parseFloat(document.getElementById('item-total').value);
    const tax = parseFloat(document.getElementById('tax').value);
    const tipPercentage = document.getElementById('tip').value;

    let totalPlusTip = 0;
    const subTotal = billTotal - tax;
    const taxPercentage = tax / subTotal;

    if (taxPercentage > MAX_SALES_TAX_PERCENTAGE) {
        window.alert('Invalid total and tax amounts');
        return;
    }

    let customTipFlag = false;
    let tipAmount = 0;
    if (tipPercentage === 'Custom') {
        customTipFlag = true;

        tipAmount = parseFloat(document.getElementById('custom-tip').value);
        totalPlusTip = billTotal + tipAmount;
    } else {
        tipAmount = subTotal * parseFloat(tipPercentage);
        
        totalPlusTip = parseFloat(billTotal) + parseFloat(tipAmount);
    }
    
    totalAmount.textContent = `${formatCurrency(totalPlusTip)}`;

    calculationsContainer.append(calculatedTotal, totalAmount);
    
    // Calculate total for each diner
    const splitContainer = document.querySelector('.item-calculations');
    let sharedPrice = 0;
    const numDiners = diners.size - 1;

    diners.forEach((items, diner) => {
        if (diner === 'Shared') {
            if (items.length >= 1) {            
                let totalSharedCost = 0;
                let sharedItems = '';
                items.forEach(item => {
                    totalSharedCost += parseFloat(item.price);
                    sharedItems += item.item + ' ';
                });
                sharedPrice = totalSharedCost / numDiners;
                
                let sharedContainer = document.createElement('div');
                sharedContainer.classList.add('shared-order');

                let sharedItem = document.createElement('p');
                sharedItem.classList.add('shared-items');
                sharedItem.textContent = `${diner} Items: ${sharedItems}`
                sharedContainer.appendChild(sharedItem);

                let sharedCost = document.createElement('p');
                sharedCost.classList.add('shared-cost');
                sharedCost.textContent = `Price per person: ${formatCurrency(sharedPrice)}`;
                sharedContainer.appendChild(sharedCost);

                calculationsContainer.append(sharedContainer);
            }
        } else {
            let dinerContainer = document.createElement('div');
            dinerContainer.classList.add('diner-order');
            let dinerItems = document.createElement('p');
            dinerItems.classList.add('diner-items');
            let dinerCost = document.createElement('p');
            dinerCost.classList.add('diner-cost');

            let dinerSubTotal = sharedPrice;
            let itemsOrdered = '';
            items.forEach(item => {
                dinerSubTotal += parseFloat(item.price);
                itemsOrdered += item.item + ' ';
            });

            const dinerTaxes = dinerSubTotal * taxPercentage;

            let dinerTip = 0;
            if (customTipFlag) {
                dinerTip = tipAmount / numDiners;
            } else {
                dinerTip = dinerSubTotal * parseFloat(tipPercentage);
            }
            
            const dinerTotal = dinerSubTotal + dinerTaxes + dinerTip;
            dinerItems.textContent = `${diner}'s Items: ${itemsOrdered}`;
            dinerCost.textContent = `SubTotal: ${formatCurrency(dinerSubTotal)} Tax: ${formatCurrency(dinerTaxes)} Tip: ${formatCurrency(dinerTip)} Total: ${formatCurrency(dinerTotal)}`;
            dinerContainer.appendChild(dinerItems);
            dinerContainer.appendChild(dinerCost);

            calculationsContainer.append(dinerContainer);
        }
    });
    splitContainer.appendChild(calculationsContainer);
    splitContainer.style.display = 'flex';
    splitComplete = true;
};

// Format the given number into US currency
function formatCurrency(number) {
    const formattedNumber = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(number);

    return formattedNumber;
};

window.addEventListener('DOMContentLoaded', () => {
    // Move on to entering the items ordered section after clicking next
    document.getElementById('diner-next-btn').addEventListener('click', () => {
        document.querySelector('.add-diner').style.display = 'none';
        document.querySelector('.add-items').style.display = 'flex';
        dinerOptions();
    });

    // Move on to the totals section after clicking next
    document.getElementById('item-next-btn').addEventListener('click', () => {
        // Make sure every diner has an item or the group has shared an item
        let allHaveItems = true;
        let sharedItems = false;

        diners.forEach((items, diner) => {
            if (diner === 'Shared' && items.length >= 1) {
                sharedItems = true;
                allHaveItems = true;
            }
            
            if (diner !== 'Shared' && items.length === 0 && !sharedItems) {
                allHaveItems = false;
            }
        });

        if (allHaveItems) {
            document.querySelector('.add-items').style.display = 'none';
            document.querySelector('.calculate-split').style.display = 'flex';
        } else {
            window.alert(`Add an item for all diners or a shared item`);
        }
    });

    // Enter custom tip
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
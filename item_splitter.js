// Define a new map with a shared diner for shared items
const diners = new Map([
    ['Shared',[]]
]);

// Max sales tax percentage in the US
const MAX_SALES_TAX_PERCENTAGE = 0.125;

// Check if the user already clicked the "Split!" button
let splitComplete = false;

// Add a diner to the dropdown
const dinerOptions = () => {
    diners.forEach((items, diner) => {
        const dinersDropdown = document.getElementById('diners-dropdown');

        // Check if diner is already added to the select tag
        const checkDiner = dinersDropdown.querySelector(`option[value="${diner}"]`);
        if (checkDiner === null) {
            const dinerOption = document.createElement('option');
            dinerOption.value = diner;
            dinerOption.text = diner;
            dinersDropdown.add(dinerOption);
        }
    });
};

// Add a diner to the diners map
const addDiners = () => {
    const nameInput = document.getElementById('diner-name');

    diners.set(nameInput.value, []);
    
    const diner = document.createElement('p');
    diner.classList.add('diner');
    diner.innerHTML = `• ${nameInput.value}`;
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
const splitTotalByItem = () => {
    if (splitComplete) {
        let calculationsContainer = document.querySelector('.calculations');
        calculationsContainer.remove();
        splitComplete = false;
    }
    const calculationsContainer = document.createElement('div');
    calculationsContainer.classList.add('calculations');

    const totalAmount = document.createElement('div');
    totalAmount.classList.add('calculated-amount');

    const calculatedTitle = document.createElement('p');
    calculatedTitle.classList.add('calculated-title');
    calculatedTitle.innerHTML = 'Bill Totals';

    const billTotal = parseFloat(document.getElementById('item-total').value);
    let gratuity = document.getElementById('gratuity').value;
    let gratuityFlag = true;
    if (gratuity === "") {
        gratuity = 0;
        gratuityFlag = false;
    } else {
        gratuity = parseFloat(gratuity);
    }
    const tax = parseFloat(document.getElementById('tax').value);
    const tipPercentage = document.getElementById('tip').value;

    let totalPlusTip = 0;
    const subTotal = billTotal - gratuity - tax;
    const taxPercentage = tax / subTotal;

    if (taxPercentage > MAX_SALES_TAX_PERCENTAGE) {
        window.alert('Invalid total and tax amounts');
        return;
    }

    if (gratuity >= subTotal) {
        window.alert('Invalid gratuity amount');
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
    
    totalAmount.innerHTML = `
        Tip: <span class="calculated-totals">${formatCurrency(tipAmount)}</span> <br/>
        Total: <span class="calculated-totals">${formatCurrency(totalPlusTip)}</span> <br/>
    `;

    calculationsContainer.append(calculatedTitle, totalAmount);
    
    // Calculate total for each diner
    const splitContainer = document.querySelector('.item-calculations');
    let sharedPrice = 0;
    let sharedItems = [];
    const numDiners = diners.size - 1;

    diners.forEach((items, diner) => {
        if (diner === 'Shared') {
            if (items.length >= 1) {            
                let totalSharedCost = 0;
                items.forEach(item => {
                    totalSharedCost += parseFloat(item.price);
                    sharedItems.push(item.item);
                });
                sharedPrice = totalSharedCost / numDiners;
                
                let sharedContainer = document.createElement('div');
                sharedContainer.classList.add('shared-order');

                let sharedTitle = document.createElement('p');
                sharedTitle.classList.add('shared-title');
                sharedTitle.textContent = `${diner}`;
                sharedContainer.appendChild(sharedTitle);

                let sharedItem = document.createElement('p');
                sharedItem.classList.add('shared-items');
                sharedItem.textContent = `• Items: ${sharedItems.join(", ")}`;
                sharedContainer.appendChild(sharedItem);

                let sharedCost = document.createElement('p');
                sharedCost.classList.add('shared-cost');
                sharedCost.innerHTML = `Price per person: <span class="shared-price">${formatCurrency(sharedPrice)}</span>`;
                sharedContainer.appendChild(sharedCost);

                calculationsContainer.append(sharedContainer);
            }
        } else {
            let dinerContainer = document.createElement('div');
            dinerContainer.classList.add('diner-order');
            let dinerName = document.createElement('p');
            dinerName.classList.add('diner-name');
            let dinerItems = document.createElement('p');
            dinerItems.classList.add('diner-items');
            let dinerCost = document.createElement('div');
            dinerCost.classList.add('diner-cost');

            let dinerSubTotal = sharedPrice;
            let itemsOrdered = [];
            items.forEach(item => {
                dinerSubTotal += parseFloat(item.price);
                itemsOrdered.push(item.item);
            });
            let allItemsOrdered = itemsOrdered.concat(sharedItems);

            const dinerTaxes = dinerSubTotal * taxPercentage;

            let dinerTip = 0;
            if (customTipFlag) {
                dinerTip = tipAmount / numDiners;
            } else {
                dinerTip = dinerSubTotal * parseFloat(tipPercentage);
            }

            if (gratuityFlag) {
                dinerTip += (gratuity / numDiners);
            }
            
            const dinerTotal = dinerSubTotal + dinerTaxes + dinerTip;
            dinerName.textContent = `${diner}`;
            dinerItems.textContent = `• Items: ${allItemsOrdered.join(", ")}`;
            dinerCost.innerHTML = `
                SubTotal: <span class="sub-total">${formatCurrency(dinerSubTotal)}</span> <br/>
                Tax: <span class="tax">${formatCurrency(dinerTaxes)}</span> <br/>
                Tip & Gratuity: <span class="tip">${formatCurrency(dinerTip)}</span> <br/>
                Total: <span class="total">${formatCurrency(dinerTotal)}</span> <br/>
            `;

            dinerContainer.appendChild(dinerName);
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
        document.getElementById('add-diner').style.display = 'none';
        document.getElementById('add-items').style.display = 'flex';
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
            document.getElementById('add-items').style.display = 'none';
            document.getElementById('calculate-split').style.display = 'flex';
        } else {
            window.alert(`Add an item for all diners or a shared item`);
        }
    });

    document.getElementById('item-back-btn').addEventListener('click', () => {
        document.getElementById('add-items').style.display = 'none';
        document.getElementById('add-diner').style.display = 'flex';
    });

    document.getElementById('split-back-btn').addEventListener('click', () => {
        if (splitComplete) {
            let calculationsContainer = document.querySelector('.calculations');
            calculationsContainer.remove();
            splitComplete = false;
        }

        document.getElementById('calculate-split').style.display = 'none';
        document.getElementById('add-items').style.display = 'flex';
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
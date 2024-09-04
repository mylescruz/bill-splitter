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
    diner.innerHTML = nameInput.value;
    nameInput.value='';
    document.querySelector('.add-section').append(diner);

    console.log("Inputed diners: ", diners);
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
    food.innerHTML = `Item: ${item.value} Price: $${itemPrice.value} Diner: ${dinerDropdown.value}`;
    document.querySelector('.items-added').appendChild(food);

    item.value = '';
    itemPrice.value = '';
}

// Calculations for splitting the items
const splitTotalByItem = () => {
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
    
    document.getElementById('total-amount').textContent = `$${totalPlusTip.toFixed(2)}`;
    
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
                let sharedItem = document.createElement('p');
                sharedItem.textContent = `${diner} Items: ${sharedItems}`
                sharedContainer.appendChild(sharedItem);
                let sharedCost = document.createElement('p');
                sharedCost.textContent = `Price per person: $${sharedPrice.toFixed(2)}`;
                sharedContainer.appendChild(sharedCost);

                splitContainer.append(sharedContainer);
            }
        } else {
            let dinerContainer = document.createElement('div');
            let dinerItems = document.createElement('p');
            let dinerCost = document.createElement('p');

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
            dinerCost.textContent = `SubTotal: $${dinerSubTotal.toFixed(2)} Tax: $${dinerTaxes.toFixed(2)} Tip: $${dinerTip.toFixed(2)} Total: $${dinerTotal.toFixed(2)}`;
            dinerContainer.appendChild(dinerItems);
            dinerContainer.appendChild(dinerCost);

            splitContainer.append(dinerContainer);
        }
    });
    splitContainer.style.display = 'flex';
};

window.addEventListener('DOMContentLoaded', () => {
    // Move on to entering the items ordered section after clicking next
    document.getElementById('diner-next-btn').addEventListener('click', () => {
        if (diners.size > 2) {
            document.querySelector('.add-diner').style.display = 'none';
            document.querySelector('.add-items').style.display = 'flex';
            dinerOptions();
        } else {
            window.alert('Must enter more than one diner');
        }
    });

    // Move on to the totals section after clicking next
    document.getElementById('item-next-btn').addEventListener('click', () => {
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
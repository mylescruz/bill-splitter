const diners = new Map();

// Add a diner to the dropdown
const dinerOptions = () => {
    diners.forEach((value, key) => {
        const dinerOption = document.createElement('option');
        dinerOption.value = key;
        dinerOption.text = key;
        document.getElementById('diners-dropdown').add(dinerOption);
    });
};

// Add a diner to the diners map
const addDiners = () => {
    const nameInput = document.getElementById('diner-name');

    diners.set(nameInput.value, []);
    console.log(nameInput.value);
    console.log(diners);
    
    const diner = document.createElement('p');
    diner.innerHTML = nameInput.value;
    nameInput.value='';
    document.querySelector('.add-people').append(diner);
};

// Input the diners
const inputDiners = () => {
    const nameInput = document.getElementById('diner-name');
    const addButton = document.getElementById('add-diner-btn');
    const nextButton = document.getElementById('diner-next-btn');
    
    // Add empty shared diner for any shared food
    diners.set('Shared', []);

    addButton.addEventListener('click', () => {
        if (nameInput.value !== '') {
            addDiners();
        }

        if (diners.size > 2) {
            nextButton.removeAttribute('disabled');
        }
    });
    nameInput.addEventListener('keydown', (event) => {
        if (nameInput.value !== '' && event.key === 'Enter') {
            addDiners();
        }

        if (diners.size > 2) {
            nextButton.removeAttribute('disabled');
        }
    });
    
    nextButton.addEventListener('click', () => {
        document.querySelector('.add-people').style.display = 'none';
        document.querySelector('.add-items').style.display = 'flex';
        dinerOptions();
    });
};

window.addEventListener('DOMContentLoaded', () => {
    inputDiners();
    // Add items to each diner
    document.getElementById('add-item-btn').addEventListener('click', () => {
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

        console.log(diners);

        const food = document.createElement('p');
        food.innerHTML = `Item: ${item.value} Price: $${itemPrice.value} Diner: ${dinerDropdown.value}`;
        document.querySelector('.items-added').appendChild(food);

        item.value = '';
        itemPrice.value = '';

        const nextButton = document.getElementById('item-next-btn');
        nextButton.addEventListener('click', () => {
            document.querySelector('.add-items').style.display = 'none';
            document.querySelector('.calculate-split').style.display = 'flex';
        });
    });

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

    // Calculations for splitting the items
    document.getElementById('split-item-btn').addEventListener('click', () => {
        const billTotal = parseFloat(document.getElementById('item-total').value);
        const tax = parseFloat(document.getElementById('tax').value);
        const tipPercentage = document.getElementById('tip').value;
        let customFlag = false;
        let total = 0;
        let tipAmount = 0;
        let subTotal = billTotal - tax;
        const taxPercentage = tax / subTotal;
        console.log(taxPercentage);

        if (tipPercentage === 'Custom') {
            customFlag = true;

            tipAmount = parseFloat(document.getElementById('custom-tip').value);
            total = billTotal + tipAmount;
        } else {
            tipAmount = subTotal * parseFloat(tipPercentage);
            
            total = parseFloat(billTotal) + parseFloat(tipAmount);
        }
        
        document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
        
        // Calculate total for each diner
        const splitContainer = document.querySelector('.item-calculations');
        let sharedPrice = 0;
        diners.forEach((value, key, map) => {
            if (key === 'Shared') {
                const numDiners = map.size - 1;
                let totalSharedCost = 0;
                let sharedItems = '';
                value.forEach(item => {
                    totalSharedCost += parseFloat(item.price);
                    sharedItems += item.item + ' ';
                });
                sharedPrice = totalSharedCost / numDiners;
                
                let sharedContainer = document.createElement('div');
                let sharedItem = document.createElement('p');
                sharedItem.textContent = `${key} Items: ${sharedItems}`
                sharedContainer.appendChild(sharedItem);
                let sharedCost = document.createElement('p');
                sharedCost.textContent = `Price per person: $${sharedPrice.toFixed(2)}`;
                sharedContainer.appendChild(sharedCost);

                splitContainer.append(sharedContainer);
            } else {
                let dinerContainer = document.createElement('div');
                let dinerItems = document.createElement('p');
                let dinerCost = document.createElement('p');

                let dinerSubTotal = sharedPrice;
                let items = '';
                value.forEach(item => {
                    dinerSubTotal += parseFloat(item.price);
                    items += item.item + ' ';
                });

                const dinerTaxes = dinerSubTotal * taxPercentage;
                const dinerTip = dinerSubTotal * parseFloat(tipPercentage);
                const dinerTotal = dinerSubTotal + dinerTaxes + dinerTip;
                dinerItems.textContent = `${key}'s Items: ${items}`;
                dinerCost.textContent = `SubTotal: $${dinerSubTotal.toFixed(2)} Tax: $${dinerTaxes.toFixed(2)} Tip: $${dinerTip.toFixed(2)} Total: $${dinerTotal.toFixed(2)}`;
                dinerContainer.appendChild(dinerItems);
                dinerContainer.appendChild(dinerCost);

                splitContainer.append(dinerContainer);
            }
        });
    });
});
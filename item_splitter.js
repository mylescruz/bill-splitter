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
    
    addButton.addEventListener('click', () => {
        if (nameInput.value !== '') {
            addDiners();
        }

        if (diners.size > 1) {
            nextButton.removeAttribute('disabled');
        }
    });
    nameInput.addEventListener('keydown', (event) => {
        if (nameInput.value !== '' && event.key === 'Enter') {
            addDiners();
        }

        if (diners.size > 1) {
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

        if (diners.has(dinerDropdown)) {
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
        itemPrice.value = 0;

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
        diners.forEach((value, key, map) => {
            let dinerContainer = document.createElement('div');
            let diner = document.createElement('p');

            let dinerSubTotal = 0;
            value.forEach(i => {
                dinerSubTotal += parseFloat(i.price);
            });
            const dinerTaxes = dinerSubTotal * taxPercentage;
            const dinerTip = dinerSubTotal * parseFloat(tipPercentage);
            const dinerTotal = dinerSubTotal + dinerTaxes + dinerTip;
            diner.textContent = `${key}: SubTotal: $${dinerSubTotal.toFixed(2)} Tax: $${dinerTaxes.toFixed(2)} Tip: $${dinerTip.toFixed(2)} Total: $${dinerTotal.toFixed(2)}`;

            dinerContainer.appendChild(diner);

            splitContainer.append(dinerContainer);
        });
    });
});
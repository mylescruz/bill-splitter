const diners = new Map();

const showMainMenu = () => {
    document.querySelector('.main-menu').style.display = 'flex';
};

const hideMainMenu = () => {
    document.querySelector('.main-menu').style.display = 'none';
};

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
    // Go to splitting evenly
    document.getElementById('even-btn').addEventListener('click', () => {
        hideMainMenu();
        document.querySelector('.even-split').style.display = 'flex';
        
        document.getElementById('split-even-btn').addEventListener('click', () => {
            const billTotal = document.getElementById('split-total').value;
            const numPeople = document.getElementById('num-people').value;

            const splitAmount = billTotal / numPeople;
            document.getElementById('split-amount').textContent = `$${splitAmount.toFixed(2)}`;
        });
    });
    // Go to splitting by item
    document.getElementById('item-btn').addEventListener('click', () => {
        hideMainMenu();
        document.querySelector('.item-split').style.display = 'flex';

        inputDiners();
    });

    // Go to main menu
    document.getElementById('even-home-btn').addEventListener('click', () => {
        document.querySelector('.even-split').style.display = 'none';
        showMainMenu();
    });
    // Go to main menu
    document.getElementById('item-home-btn').addEventListener('click', () => {
        document.querySelector('.item-split').style.display = 'none';
        showMainMenu();
    });

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

    // document.getElementById('split-item-btn').addEventListener('click', () => {
    //     diners.forEach((value, key, map) => {

    //     });
    // });
});
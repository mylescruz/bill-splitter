const diners = new Map();

const showWelcome = () => {
    document.querySelector('.welcome').style.display = 'flex';
};

const hideWelcome = () => {
    document.querySelector('.welcome').style.display = 'none';
};

const dinerOptions = () => {
    diners.forEach((value, key) => {
        const dinerOption = document.createElement('option');
        dinerOption.value = key;
        dinerOption.text = key;
        document.getElementById('diners-dropdown').add(dinerOption);
    });
};

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

const inputDiners = () => {
    const nameInput = document.getElementById('diner-name');
    const addButton = document.getElementById('add-diner-btn');
    const nextButton = document.getElementById('next-btn');
    
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
    document.getElementById('even-btn').addEventListener('click', () => {
        hideWelcome();
        document.querySelector('.even-split').style.display = 'flex';
        
        document.getElementById('split-btn').addEventListener('click', () => {
            const billTotal = document.getElementById('split-total').value;
            const numPeople = document.getElementById('num-people').value;

            const splitAmount = billTotal / numPeople;
            document.getElementById('split-amount').textContent = `$${splitAmount.toFixed(2)}`;
        });
    });
    document.getElementById('item-btn').addEventListener('click', () => {
        hideWelcome();
        document.querySelector('.item-split').style.display = 'flex';

        inputDiners();
    });
    document.getElementById('even-home-btn').addEventListener('click', () => {
        document.querySelector('.even-split').style.display = 'none';
        showWelcome();
    });
    document.getElementById('item-home-btn').addEventListener('click', () => {
        document.querySelector('.item-split').style.display = 'none';
        showWelcome();
    });

    document.getElementById('add-item-btn').addEventListener('click', () => {
        const item = document.getElementById('item-name');
        const dropdown = document.getElementById('diners-dropdown');
        const itemPrice = document.getElementById('item-price');

        diners.get(dropdown.value).push({
            item: item.value,
            price: itemPrice.value
        });

        console.log(diners);

        const food = document.createElement('p');
        food.innerHTML = `Item: ${item.value} Price: $${itemPrice.value} Diner: ${dropdown.value}`;
        document.querySelector('.add-items').append(food);

        item.value = '';
        itemPrice.value = 0.00;
    });
});
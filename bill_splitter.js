const showWelcome = () => {
    document.querySelector('.welcome').style.display = 'flex';
};

const hideWelcome = () => {
    document.querySelector('.welcome').style.display = 'none';
};

const diners = [];

const addDiners = () => {
    const peopleContainer = document.querySelector('.addPeople');
    const nameInput = document.getElementById('diner-name');

    diners.push(nameInput.value);
    console.log(nameInput.value);
    console.log(diners);
    
    const diner = document.createElement('p');
    diner.innerHTML = nameInput.value;
    nameInput.value='';
    peopleContainer.append(diner);
}

const inputDiners = () => {
    const nameInput = document.getElementById('diner-name');
    const addButton = document.getElementById('add-diner-btn');
    const nextButton = document.getElementById('next-btn');
    
    addButton.addEventListener('click', () => {
        if (nameInput.value !== '') {
            addDiners();
        }

        if (diners.length > 0) {
            nextButton.removeAttribute('disabled');
        }
    });
    nameInput.addEventListener('keydown', (event) => {
        if (nameInput.value !== '' && event.key === 'Enter') {
            addDiners();
        }

        if (diners.length > 0) {
            nextButton.removeAttribute('disabled');
        }
    });

    
    
    nextButton.addEventListener('click', () => {
        console.log("Next screen");
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
            document.querySelector('.split-amount').textContent = `$${splitAmount.toFixed(2)}`;
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
});
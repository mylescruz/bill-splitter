const hideWelcome = () => {
    document.querySelector('.welcome').style.display = 'none';
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
    });
});
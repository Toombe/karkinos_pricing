document.addEventListener('DOMContentLoaded', () => {
    // Configuration - set your maximums here
    const MAX_VALUES = {
        melee: 109,    // Set maximum for Melee
        hp: 50,       // Set maximum for HP
        weight: 54    // Set maximum for Weight
    };

    const TOTAL_MAX = 158;
    const inputs = document.querySelectorAll('.number-input');
    const priceDisplays = [price1, price2, price3];

    // Initialize max indicators
    inputs.forEach(input => {
        const type = input.dataset.type;
        input.max = MAX_VALUES[type];
        input.closest('.input-wrapper').querySelector('.max-indicator').textContent =
            `(Max ${MAX_VALUES[type]})`;
    });

    function enforceLimits(currentInput) {
        const type = currentInput.dataset.type;
        let value = parseInt(currentInput.value) || 0;

        // Enforce individual maximum
        if (value > MAX_VALUES[type]) {
            currentInput.value = MAX_VALUES[type];
            value = MAX_VALUES[type];
        }

        // Enforce total maximum
        const values = Array.from(inputs).map(i => parseInt(i.value) || 0);
        const total = values.reduce((a, b) => a + b, 0);

        if (total > TOTAL_MAX) {
            const excess = total - TOTAL_MAX;
            currentInput.value = value - excess;
            return enforceLimits(currentInput);
        }

        return true;
    }

    function calculatePrices() {
        enforceLimits(event?.target || inputs[0]);
        const values = Array.from(inputs).map(i => parseInt(i.value) || 0);
        const total = values.reduce((a, b) => a + b, 0);

        // Existing price calculation logic
        let firstPrice;
        if (total === 0) {
            firstPrice = 5000;
        } else {
            firstPrice = 5000 + ((30000 - 5000) / TOTAL_MAX) * total;
        }

        const secondPrice = firstPrice / 2;
        const thirdPrice = secondPrice / 4;

        // Update price displays
        priceDisplays[0].textContent = `${Math.round(firstPrice).toLocaleString()}`;
        priceDisplays[1].textContent = `${Math.round(secondPrice).toLocaleString()}`;
        priceDisplays[2].textContent = `${Math.round(thirdPrice).toLocaleString()}`;
    }

    inputs.forEach(input => {
        input.addEventListener('input', calculatePrices);
        // Add visual feedback when reaching max
        input.addEventListener('change', function() {
            const type = this.dataset.type;
            this.style.borderColor = this.value >= MAX_VALUES[type] ? '#ff4444' : '#ddd';
        });
    });

    calculatePrices();
});

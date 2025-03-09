        // Get elements
        const amountEl = document.getElementById('amount');
        const fromCurrencyEl = document.getElementById('from-currency');
        const toCurrencyEl = document.getElementById('to-currency');
        const convertBtn = document.getElementById('convert-btn');
        const resultEl = document.getElementById('result');
        const swapBtn = document.getElementById('swap-btn');

        // Fetch currencies and populate select options
        async function populateCurrencies() {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const data = await response.json();
                const currencies = Object.keys(data.rates);
                
                currencies.forEach(currency => {
                    const option1 = document.createElement('option');
                    const option2 = document.createElement('option');
                    
                    option1.value = currency;
                    option1.textContent = currency;
                    option2.value = currency;
                    option2.textContent = currency;
                    
                    fromCurrencyEl.appendChild(option1);
                    toCurrencyEl.appendChild(option2);
                });

                // Set default values
                fromCurrencyEl.value = 'USD';
                toCurrencyEl.value = 'EUR';
            } catch (error) {
                console.error('Error fetching currencies:', error);
            }
        }

        // Convert currency
        async function convertCurrency() {
            const amount = amountEl.value;
            const fromCurrency = fromCurrencyEl.value;
            const toCurrency = toCurrencyEl.value;

            if (!amount || amount <= 0) {
                resultEl.textContent = 'Please enter a valid amount';
                return;
            }

            try {
                const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
                const data = await response.json();
                const rate = data.rates[toCurrency];
                const convertedAmount = (amount * rate).toFixed(2);

                resultEl.innerHTML = `
                    ${amount} ${fromCurrency} = 
                    <span style="color: #6b48ff; font-weight: bold;">
                        ${convertedAmount} ${toCurrency}
                    </span>
                `;
            } catch (error) {
                resultEl.textContent = 'Error converting currency. Please try again.';
                console.error('Conversion error:', error);
            }
        }

        // Swap currencies
        function swapCurrencies() {
            const temp = fromCurrencyEl.value;
            fromCurrencyEl.value = toCurrencyEl.value;
            toCurrencyEl.value = temp;
            convertCurrency();
        }

        // Event listeners
        convertBtn.addEventListener('click', convertCurrency);
        swapBtn.addEventListener('click', swapCurrencies);
        amountEl.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') convertCurrency();
        });

        // Initialize
        populateCurrencies();

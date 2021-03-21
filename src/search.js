import React, {useState, useEffect} from 'react';

export default function Search({currentUser}) {

    const [inputText, setInputText] = useState('');
    const [currentStock, setCurrentStock] = useState();
    const [ticker, setTicker] = useState(); 
    const [buyQuantity, setBuyQuantity] = useState(0);

      function refreshPage() {
            window.location.reload(false);
  }

    const fetchWallet = async() => {
        if(!currentUser)return;      
        let res = await fetch("http://localhost:3000/api/v1/wallet/"+currentUser[0].walletId);
        return await res.json();
      };

    const fetchQuote = async () => {
        const res = await fetch(`http://localhost:3000/api/v1/portfolio/search/${inputText}`);
        let json = await res.json();
        console.log(json)
        setCurrentStock(json);
        setTicker(inputText);
        setInputText('')
    };

    const onInputChange = async (ev) => {
        console.log(ev.currentTarget.value)
        setInputText(ev.currentTarget.value.toUpperCase());
    };

    const updateWallet = async (newValue,walletId) => {
        let body = {
            value: newValue
        }
        let options = {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {}
        };
        options.headers["Accept"] = "application/json, text/plain, */*";
        options.headers["Content-Type"] = "application/json;charset=utf-8";
        const res = await fetch(`http://localhost:3000/api/v1/wallet/`+walletId, options);     
    }

    const postPortfolio = async () =>{
        let body = {
            symbol: ticker,
            quantity: buyQuantity,
            price: currentStock.data.regularMarketPrice,
            userId:currentUser[0].id
        }

        let options = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {}
        };

        options.headers["Accept"] = "application/json, text/plain, */*";
        options.headers["Content-Type"] = "application/json;charset=utf-8";
        console.log(options);
        const res = await fetch('http://localhost:3000/api/v1/portfolio', options);
        let json = await res.json();
        return json;
    }

    const buyStock = async () => {
        // check if the quantity is not 0
        // check if the user has enough cash in teh wallet to be able to make a purchase
        // if not show an error
        // if yes, make a purchase and add a field in the portfolio table

        // Gte currenty wallet or processing 

        // Get Current Wallet 

        var currentWallet = await fetchWallet();

        if(buyQuantity === 0){
            alert('Buy quantity needs to be greater than 0!')
        }

        let cashNeeded = buyQuantity * currentStock.data.regularMarketPrice;
        console.log('cashNeeded is', cashNeeded)

            if(cashNeeded > parseFloat(currentWallet[0].value).toFixed(2)){
                alert('You dont have enough cash!');
            } else {
                // make the purchase
                // making a field in the database table for portfolio
                var newWalletValue = parseFloat(currentWallet[0].value).toFixed(2) - cashNeeded;
                //update wallet
                updateWallet(newWalletValue,currentWallet[0].id)
                let json = await postPortfolio();
                console.log(json)
                setBuyQuantity(0)
                alert('Success!')
            }
        
    };

    const onBuyChange = async (ev) => {
        setBuyQuantity(ev.currentTarget.value);
    };

    return (
        <div className={'border p-5'}>

            <div className="grid grid-cols-2">
                <div className={'border p-5'}>
                    <input value={inputText} onChange={onInputChange} type="text" className={'border w-full p-3 rounded-full border-gray-300'}/>
                </div>
                <div className={'border p-5'}>
                    <span onClick={fetchQuote} className={'bg-gray-600 cursor-pointer p-2 rounded text-white text-xl pl-5 pr-5'}>Get Quote</span>
                </div>
            </div>

            {ticker && <div className="grid grid-cols-2">
                <div className={'border p-5'}>
                    <h1 className={'text-2xl'}>{currentStock.data.symbol} - {currentStock.data.longName} : {currentStock && <span>&nbsp;&nbsp;{currentStock.data.financialCurrency} {currentStock.data.regularMarketPrice}</span>}</h1>
                </div>
                <div className={'border p-5'}>

                    <span>
                        <input type="number" onChange={onBuyChange} className={'border'} value={buyQuantity} />&nbsp;&nbsp;
                        <span className={'bg-blue-600 cursor-pointer p-2 rounded text-white text-xl pl-5 pr-5'} onClick={buyStock}>Buy</span>&nbsp;&nbsp;&nbsp;
                    </span>
                </div>
            </div>}

        </div>
    );
}


    


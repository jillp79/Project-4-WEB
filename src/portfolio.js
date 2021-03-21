import React, {useState, useEffect} from 'react';
import { DeleteTwoTone } from '@ant-design/icons';

export default function Portfolio({currentUser}) {

    const [currentPortfolio, setCurrentPortfolio] = useState();  
    const [currentWallet, SetCurrentWallet] = useState()


    const fetchPortfolio = async () => {
        if(!currentUser) return;
        const res = await fetch("http://localhost:3000/api/v1/portfolio/"+currentUser[0].id);
        let json = await res.json();
        console.log('this is the portfolio json', json)
        setCurrentPortfolio(json);       
    };

    const fetchWallet = async () => {
        if(!currentUser)return;
        const res = await fetch("http://localhost:3000/api/v1/wallet/"+currentUser[0].walletId);
        let json = await res.json();
        SetCurrentWallet(parseFloat(json[0].value).toFixed(2));   
      };

      // Update wallet 
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

    
    const removePortfolio = async (item) => {
        const res = await fetch('http://localhost:3000/api/v1/portfolio/' + item.id, {
            method: 'DELETE',
          })
        // update wallet 
        //cast current wallet 
        var numCurrentWallet = parseFloat(currentWallet).toFixed(2);
        var returnAmount = item.quantity * item.price;
        var newAmount = parseFloat(numCurrentWallet) + parseFloat(returnAmount);
        var total = parseFloat(newAmount).toFixed(2)
        updateWallet(total,currentUser[0].walletId);
        //Get Current wallet Amount
        fetchWallet();
    };


     useEffect(() => {
         fetchPortfolio()
         fetchWallet()
    },[currentUser,currentWallet])

    return (
        <div className={'border p-5'}>

            <h1 className={'text-xl font-bold'}>Portfolio</h1>
            {currentPortfolio && <table style={{width: '100%'}}>
                <thead>
                    <th className={'border'}>Stock</th>
                    <th className={'border'}>Quantity</th>
                    <th className={'border'}>Value</th>
                </thead>
                <tbody>
                    {currentPortfolio.map((item, idx) => {
                        return <tr key={idx}>
                            <td className={'border text-center'}>{item.symbol}</td>
                            <td className={'border text-center'}>{item.quantity}</td>
                            <td className={'border text-center'}>{item.price}</td>
                            <td className={'border text-center'}><DeleteTwoTone twoToneColor="#ff1919" onClick={() => removePortfolio(item)} className={'mr-1 align-middle'}/></td>
                        </tr>

                    })}


                </tbody>
            </table>}

            {!currentPortfolio && <h1>Loading...</h1>}

            <br/>
            <br/>
            <br/>

             {currentWallet && <h1 className={'text-xl font-bold'}>Current Wallet Value: {currentWallet}</h1>}
        </div>
    );
}


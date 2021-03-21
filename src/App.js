import logo from './logo.svg';
import './App.css';
import Search from "./search";
import Portfolio from "./portfolio";
import User from "./user";
import UserDropdown from "./userDropDown"
import React, { useState, useEffect} from 'react';


function App() {

  const [userId, setUserId] = useState(1)

  const [currentUser,setCurrentUser]= useState();
  const [currentWallet,SetCurrentWallet]= useState();

  const fetchUser = async () => {
    const res = await fetch("http://localhost:3000/users/"+userId);
    let json = await res.json();
    console.log(json)
    setCurrentUser(json)
    fetchWallet(json)
};

const fetchWallet = async (user) => {
  if(!user)
  {
    fetchUser()
  }
  else
  {
  const res = await fetch("http://localhost:3000/api/v1/wallet/"+user[0].walletId);
  let json = await res.json();
  SetCurrentWallet(json)
  }
};

useEffect(() => {
  fetchUser()
}, [userId])

  return (
    <>       
        <div className={'w-full p-5 bg-blue-200 border-b-2 border-blue-400'}>
            <h1 className={'text-xl font-bold text-center text-blue-600 tracking-wider uppercase'}>Paper Trader</h1>
        </div>
        <UserDropdown setUserId={setUserId}/>
        <User currentUser={currentUser}/>
        <div className="grid grid-cols-2">
            
            <Search currentUser={currentUser}/>
            <Portfolio currentUser={currentUser}/>          
        </div>
        </>
  );
}

export default App;

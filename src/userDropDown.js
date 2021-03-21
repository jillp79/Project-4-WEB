import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import React, { useState, useEffect} from 'react';


export default function User({setUserId}) {

    

    const [currentOptions, setOptions] = useState();

    const fetchUser = async () => {
        const res = await fetch('http://localhost:3000/users/');
        let json = await res.json();
        console.log(json)

        var newOptions = [];

        json.forEach(e => {
            var newOption = {value:e.id,label:e.name};
            newOptions.push(newOption);
        });
        setOptions(newOptions)
    };

    const setId= (e) => {
        setUserId(e.value)
    }

    useEffect(() => {
        console.log('this runs only once on component load')
        fetchUser()
    }, [])

    //const defaultOption = currentOptions[0]
    return (
        <Dropdown options={currentOptions} onChange={setId} value={currentOptions} placeholder="Select an option" />
    );
}
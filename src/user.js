import React, { useState, useEffect} from 'react';


export default function User({currentUser}) {

    return (
        <div>
            {currentUser && <h1 className={'text-xl font-bold text-right text-blue-600 tracking-wider uppercase'}>{currentUser.name}</h1>}
        </div>
    );
}
import React from 'react';

export default function IfComponent({conditional, children}){
    return (conditional ? children : null);
}

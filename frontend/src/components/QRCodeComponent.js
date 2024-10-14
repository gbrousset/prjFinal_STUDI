import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeComponent = ({ authKey, ticketKey }) => {
    const qrValue = `${authKey}-${ticketKey}`; 

    return (
        <div>
            <QRCodeSVG value={qrValue} /> 
        </div>
    );
};

export default QRCodeComponent;

import React from 'react';
import trans from '../../translation/trans';


export default function NotInWhitelistCard() {
    return (
        <div>
            <h2>{trans('notInWhitelist.title')}</h2>
            <p>
                {trans('notInWhitelist.description')}
            </p>
        </div>
    );
}

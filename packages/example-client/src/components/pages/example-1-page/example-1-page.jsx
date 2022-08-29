import React, { memo, useCallback } from 'react';
import map from 'lodash/map';
import { useRicochet } from 'ricochet';
import doughnutsRicochet from '../../../ricochets/doughnuts-ricochet';

function Example1Page() {
    const doughnutsAccess = useRicochet(doughnutsRicochet);

    const doughnuts = doughnutsAccess.getData();
    const running = doughnutsAccess.getRunning();
    const error = doughnutsAccess.getError();
    const action = doughnutsAccess.getAction();

    debugger;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleReload = useCallback(() => {
        doughnutsAccess.getDoughnuts();
    });

    return (
        <div className="example-page example-1-page">
            {map(doughnuts, doughnut => <div key={doughnut.id}>{doughnut.name}</div>)}
            <button type="button" onClick={handleReload}>Reload</button>
        </div>
    );
}

export default memo(Example1Page);
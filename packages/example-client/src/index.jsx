import React from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import RicochetRoot from 'ricochet';
import { Router } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { createBrowserHistory } from 'history';
import './mocks';
import Routes from './components/routes';

const history = createBrowserHistory();

ReactDOM.render(
	<AppContainer>
		<RecoilRoot>
            <RicochetRoot />
			<Router history={history}>
				<Routes />
			</Router>
        </RecoilRoot>
	</AppContainer>,
	document.getElementById('application'),
);

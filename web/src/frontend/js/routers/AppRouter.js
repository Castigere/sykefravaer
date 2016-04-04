import React, { PropTypes } from 'react';
import { Router, Route } from 'react-router';
import DineSykmeldingerSide from '../sider/DineSykmeldingerSide.js';
import { DinSykmeldingSide } from '../sider/DinSykmeldingSide.js';
import SideIkkeFunnet from '../components/SideIkkeFunnet.js';

const Feil = () => {
	return <p>Gå til /app</p>;
};

const AppRouter = ({ history }) => {
	return (<Router history={history}>
		<Route path="/syfofront" component={Feil} />
		<Route path="/syfofront/app" component={DineSykmeldingerSide} />
		<Route path="/syfofront/app/dine-sykmeldinger" component={DineSykmeldingerSide} />
		<Route path="/syfofront/app/sykmelding/:sykmeldingId" component={DinSykmeldingSide} />
		<Route path="*" component={SideIkkeFunnet} />
	</Router>);
};

AppRouter.propTypes = {
	history: PropTypes.object.isRequired,
};

export default AppRouter;

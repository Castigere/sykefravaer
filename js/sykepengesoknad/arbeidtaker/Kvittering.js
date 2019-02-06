import React from 'react';
import { soknad as soknadPt } from '../../propTypes';
import KvitteringArbeidstakersoknad from '../../components/sykepengesoknad-arbeidstaker/Kvittering';

const Kvittering = ({ soknad }) => {
    return (<KvitteringArbeidstakersoknad sykepengesoknad={soknad} />);
};

Kvittering.propTypes = {
    soknad: soknadPt,
};

export default Kvittering;

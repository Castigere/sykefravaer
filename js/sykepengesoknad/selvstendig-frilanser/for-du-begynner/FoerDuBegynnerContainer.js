import React from 'react';
import setup from '../../utils/soknadSetup';
import validerFoerDuBegynner from './validerFoerDuBegynner';
import FoerDuBegynner from './FoerDuBegynner';
import Soknadstatussjekker from '../../felles/Soknadstatussjekker';

const FoerDuBegynnerContainer = (props) => {
    return <Soknadstatussjekker {...props} Component={FoerDuBegynner} />;
};

export default setup(validerFoerDuBegynner, FoerDuBegynnerContainer, true);

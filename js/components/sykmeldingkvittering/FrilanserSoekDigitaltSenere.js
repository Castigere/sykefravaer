import React from 'react';
import { getLedetekst } from 'digisyfo-npm';
import PropTypes from 'prop-types';
import Kvitteringsteg, { StegvisKvittering, HtmlAvsnitt } from './Kvitteringsteg';
import { soknadsdatoremse } from './Soknadsdatoliste';
import { soknad as soknadPt } from '../../propTypes';
import { FrilanserSelvstendigKvitteringstegEn } from './FrilanserSoekDigitaltNaa';

const FrilanserSoekDigitaltSenere = ({ soknader }) => {
    return (<div className="js-kvittering js-kvittering--frilanser-sok-senere">
        <div className="panel blokk">
            <StegvisKvittering>
                <FrilanserSelvstendigKvitteringstegEn />
                <Kvitteringsteg
                    nummer="2"
                    tittel={getLedetekst('sykmelding.kvittering.sok-senere.steg-2.tittel-3')}>
                    <HtmlAvsnitt
                        nokkel="sykmelding.kvittering.sok-senere-frilanser.steg-2.tekst-3"
                        replacements={{
                            '%DATOER%': soknadsdatoremse(soknader),
                        }} />
                </Kvitteringsteg>
            </StegvisKvittering>
        </div>
    </div>);
};

FrilanserSoekDigitaltSenere.propTypes = {
    soknader: PropTypes.arrayOf(soknadPt),
};

export default FrilanserSoekDigitaltSenere;

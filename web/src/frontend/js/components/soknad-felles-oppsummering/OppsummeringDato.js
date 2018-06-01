import React from 'react';
import { getKey } from './Oppsummeringsvisning';
import OppsummeringSporsmalscontainer from './OppsummeringSporsmalscontainer';
import OppsummeringSporsmalstekst from './OppsummeringSporsmalstekst';
import { oppsummeringSporsmal } from '../../propTypes';

const OppsummeringDato = ({ tag, sporsmalstekst, svar, overskriftsnivaa = 3 }) => {
    return (<OppsummeringSporsmalscontainer tag={tag}>
        <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>{sporsmalstekst}</OppsummeringSporsmalstekst>
        <div className="oppsummering__tekstsvar">
            {
                svar.svarverdi.map((svarverdi, index) => {
                    return <p className="oppsummering__dato" key={getKey(tag, index)}>{svarverdi.verdi}</p>;
                })
            }
        </div>
    </OppsummeringSporsmalscontainer>);
};

OppsummeringDato.propTypes = oppsummeringSporsmal;

export default OppsummeringDato;

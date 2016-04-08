import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';
import deepFreeze from 'deep-freeze';

import sykmeldinger from '../../js/reducers/sykmeldinger.js';

describe('sykmeldinger', () => {

  it('handles SET_SYKMELDINGER ', () => {
    const initialState = {};
    const action = {
      type: 'SET_SYKMELDINGER',
      sykmeldinger: [{
        pair: ['Trainspotting', '28 Days Later'], 
        tally: {Trainspotting: 1}
      }]
    };
    const nextState = sykmeldinger(initialState, action);

    expect(nextState).to.deep.equal({
      data: [{ 
        pair: [ 'Trainspotting', '28 Days Later' ],
        tally: { Trainspotting: 1 }  
      }],
      henter: false,
      hentingFeilet: false,
    });
  });

}); 
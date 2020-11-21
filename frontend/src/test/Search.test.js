import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Searchbar from '../components/Searchbar/Searchbar';


const setup = () => {
    const utils = render(<Searchbar />);
    const input = utils.getByLabelText("Enter a product serial or event key")
    return {
        input,
        ...utils
    }
}

test('search term entry updates', () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: 'SHIP-1101' } });
    expect(input.value).toBe('SHIP-1101');
});


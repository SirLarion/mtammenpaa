import React from 'react';
import { render, screen } from '@testing-library/react';

import Restaurant from '../components/Restaurant';
import { RestaurantType } from '../types';

describe('<Restaurant> works correctly', () => {
    test('with example data', () => {
        const testRestaurant: RestaurantType = {
            blurhash: "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX",
            launch_date: "2020-04-20",
            location: [
                24.938082,
                60.17626
            ],
            name: "Sea Chain",
            online: true,
            popularity: 0.956990414084132
        };

        const { container } = render(<Restaurant data={testRestaurant} /> );

        // Sanity check
        expect(container.firstChild).toHaveClass('restaurant');

        /* Check whether the restaurant data was converted into a Restaurant element
         * correctly */
        expect(screen.getByText(testRestaurant['name'])).toBeTruthy();

    });
});

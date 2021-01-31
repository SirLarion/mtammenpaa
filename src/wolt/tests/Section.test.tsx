import React from 'react';
import { render, screen } from '@testing-library/react';

import Section from '../components/Section';
import { SectionType } from '../types'; 

describe('<Section> works correctly', () => {
    test('with example data', () => {

        const testSection: SectionType = {
          title: "New Restaurants",
          restaurants: [
            {
              blurhash: "UEL:h[|8I-OkYxTsn9r_ExOlo{s:M1eCxvkV",
              launch_date: "2020-12-08",
              location: [
                24.938667,
                60.155196
              ],
              name: "Corn Place",
              online: false,
              popularity: 0.5436221040194886
            },
            {
              blurhash: "UDSoswyZVqm.p%cRjLaKUgZ+k.kWrFZ%a$kX",
              launch_date: "2020-11-26",
              location: [
                24.938908,
                60.160413
              ],
              name: "Salt",
              online: true,
              popularity: 0.8954324472876662
            },
            {
              blurhash: "U9O[r*?hI_VN*8yNniVx5^NhxTknY]MmX+tx",
              launch_date: "2020-11-23",
              location: [
                24.935659,
                60.161989
              ],
              name: "Chili powder",
              online: true,
              popularity: 0.7353250033621942
            }
          ]
        };

        const { container, getByText, getAllByText, getByRole } = render(<Section data={testSection} />);

        // Sanity check
        expect(container.firstChild).toHaveClass('section');
        expect(getByText(testSection['title'])).toBeTruthy();

        /* Check that three of each restaurant in testSection exist in the rendered Section element
         * (three because the infinite scrolling in the carousel works by having two clones) */
        expect(getAllByText(testSection['restaurants'][0]['name'])).toHaveLength(3);
        expect(getAllByText(testSection['restaurants'][1]['name'])).toHaveLength(3);
        expect(getAllByText(testSection['restaurants'][2]['name'])).toHaveLength(3);

        // Check that the wrapper child in Section has the correct class
        expect(getByRole('wrapper')).toHaveClass('wrapper--100');
    });
});

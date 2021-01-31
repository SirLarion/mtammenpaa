import React from 'react';
import { render, screen } from '@testing-library/react';

import NotWoltApp from '../NotWoltApp';

// Mock <Section> for easier access to only <NotWoltApp> elements
jest.mock('../components/Section', () => {
    return {
        __esModule: true,
        default: () => {
            return <div></div>;
        }
    }
});

describe('<NotwoltApp> works correctly', () => {

    test('with mock <Section>', () => {
        const { container } = render(<NotWoltApp />);

        // Sanity check
        expect(container.firstChild).toHaveClass('app');

        // Check that the wrapper child in the app has the correct class
        expect(screen.getByRole('wrapper')).toHaveClass('wrapper--100');
        
    });

});

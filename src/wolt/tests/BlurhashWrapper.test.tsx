import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import BlurhashWrapper from '../components/BlurhashWrapper';

describe('<BlurhashWrapper> works correctly', () => {
    const blurhash = "UAN=8k?LS~M:ErJFs%t0MDMWRqo@%BxSV{RX";

    test('for offline restaurant', () => {
        const { container } = render(<BlurhashWrapper hash={blurhash} online={false}/>);

        // Sanity check
        expect(container.firstChild).toHaveClass('blurhash');

        // Check for the class corresponding to offline restaurants
        expect(screen.getByRole('img')).toHaveClass('blurhash__mask--offline');
    });

    test('for online restaurant', () => {
        const { container } = render(<BlurhashWrapper hash={blurhash} online={true}/>);

        // Sanity check
        expect(container.firstChild).toHaveClass('blurhash');

        // Check for the class corresponding to online restaurants
        expect(screen.getByRole('img')).toHaveClass('blurhash__mask--online');
    });
});

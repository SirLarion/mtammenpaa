import '@testing-library/jest-dom';

/* Jest doesn't know how to deal with the blurhash so
 * we mock it */
jest.mock('react-blurhash');

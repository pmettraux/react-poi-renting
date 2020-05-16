import React from 'react';
import { render } from '@testing-library/react';
import HeaderComponent from './header';

test('renders header component', () => {
  const { getByText } = render(<HeaderComponent/>);
  const linkElement = getByText(/PLEASE INSERT APP TITLE HERE LEL/i);
  expect(linkElement).toBeInTheDocument();
});

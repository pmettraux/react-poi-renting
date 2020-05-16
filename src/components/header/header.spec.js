import React from 'react';
import { render } from '@testing-library/react';
import DemoComponent from './header-component';

test('renders demo component', () => {
  const { getByText } = render(<HeaderCompontent />);
  const linkElement = getByText(/Hello World/i);
  expect(linkElement).toBeInTheDocument();
});

import React from 'react';
import { render } from '@testing-library/react';
import DemoComponent from './demo-component';

test('renders demo component', () => {
  const { getByText } = render(<DemoComponent />);
  const linkElement = getByText(/Hello World/i);
  expect(linkElement).toBeInTheDocument();
});

import React from 'react';
import { render } from '@testing-library/react';
import SidePanelComponent from './side-panel';

test('renders side panel component', () => {
  const { getByText } = render(<SidePanelComponent />);
  const linkElement = getByText(/Hello World/i);
  expect(linkElement).toBeInTheDocument();
});

import React from 'react';
import { render } from '@testing-library/react';
import { MapComponent } from './map-component';

test('renders learn react link', () => {
  const { getByText } = render(<MapComponent />);
  const linkElement = getByText(/test/i);
  expect(linkElement).toBeInTheDocument();
});
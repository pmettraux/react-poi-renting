import React from 'react';
import { render } from '@testing-library/react';
import DemoComponent from './header-component';

test('renders header component', () => {
  const { getByText } = render(<HeaderCompontent/>);
});

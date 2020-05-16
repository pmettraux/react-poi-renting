import React from 'react';
import { render } from '@testing-library/react';
import HeaderComponent from './header';

test('renders header component', () => {
  const { getByText } = render(<HeaderCompontent/>);
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import NoData from './NoData';

describe('NoData', () => {
  it('should render successfully with passed params', async () => {
    render(
      <NoData
        title={'There is currently no data to display.'}
        subtext={'Select a template filter to see data.'}
      />
    );
    expect(
      screen.getByText('There is currently no data to display.')
    ).toBeTruthy();
    expect(
      screen.getByText('Select a template filter to see data.')
    ).toBeTruthy();
  });
  it('should render successfully without params', async () => {
    render(<NoData />);
    expect(screen.getByText('No Data')).toBeTruthy();
  });
});

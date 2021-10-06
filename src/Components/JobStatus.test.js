import React from 'react';
import { render } from '@testing-library/react';
import JobStatus from './JobStatus';

describe('Components/JobStatus', () => {
  it('should render successful', () => {
    const { asFragment } = render(<JobStatus status="successful" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render failed', () => {
    const { asFragment } = render(<JobStatus status="failed" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render error', () => {
    const { asFragment } = render(<JobStatus status="error" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render running', () => {
    const { asFragment } = render(<JobStatus status="running" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render new', () => {
    const { asFragment } = render(<JobStatus status="new" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render waiting', () => {
    const { asFragment } = render(<JobStatus status="waiting" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render pending', () => {
    const { asFragment } = render(<JobStatus status="pending" />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render canceled', () => {
    const { asFragment } = render(<JobStatus status="canceled" />);
    expect(asFragment()).toMatchSnapshot();
  });
});

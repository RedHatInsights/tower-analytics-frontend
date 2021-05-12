import React from 'react';
import { shallow } from 'enzyme';
import JobStatus from './JobStatus';

describe('Components/JobStatus', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = null;
  });

  it('should render successful', () => {
    wrapper = shallow(<JobStatus status="successful" />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render failed', () => {
    wrapper = shallow(<JobStatus status="failed" />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render error', () => {
    wrapper = shallow(<JobStatus status="error" />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render running', () => {
    wrapper = shallow(<JobStatus status="running" />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render new', () => {
    wrapper = shallow(<JobStatus status="new" />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render waiting', () => {
    wrapper = shallow(<JobStatus status="waiting" />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render pending', () => {
    wrapper = shallow(<JobStatus status="pending" />);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should render canceled', () => {
    wrapper = shallow(<JobStatus status="canceled" />);
    expect(wrapper.html()).toMatchSnapshot();
  });
});

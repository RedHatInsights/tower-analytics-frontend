import {
  EmptyState,
  } from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';
import React, { Component } from 'react';

/**
 * Webpack allows loading components asynchronously by using import().
 *
 *      Ex) const Component = asyncComponent(() => import('component');
 *
 *          class aClass extends React.Component {
 *              render() {
 *                  return (<Component prop1="prop1" prop2="prop2" ... />);
 *              }
 *          }
 *
 *  https://reactjs.org/docs/higher-order-components.html
 *
 * @param importComponent a function that contains and async import statement
 *      Ex) () => import('react-component')
 *
 * @returns {AsyncComponent} The imported component or can return a loading
 */
// FIXME: asyncComponent -> lazy; Suspense fallback=EmptyState..
export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component,
      });
    }

    render() {
      const C = this.state.component;

      return C ? (
        <div data-cy={'page_component'}>
          <C {...this.props} />
        </div>
      ) : (
        <EmptyState  headingLevel='h4' icon={Spinner}  titleText='Loading'>
          </EmptyState>
      );
    }
  }

  return AsyncComponent;
}

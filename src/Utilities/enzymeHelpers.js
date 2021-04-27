/*
 * Enzyme helpers for injecting top-level contexts
 * derived from https://lingui.js.org/guides/testing.html
 */
import React from 'react';
import { shape, string, arrayOf } from 'prop-types';
import { mount, shallow } from 'enzyme';
import { MemoryRouter, Router } from 'react-router-dom';

const defaultContexts = {
    config: {
        ansible_version: null,
        custom_virtualenvs: [],
        version: null,
        me: { is_superuser: true },
        toJSON: () => '/config/',
        license_info: {
            valid_key: true
        }
    },
    router: {
        history_: {
            push: () => {},
            replace: () => {},
            createHref: () => {},
            listen: () => {},
            location: {
                hash: '',
                pathname: '',
                search: '',
                state: ''
            },
            toJSON: () => '/history/'
        },
        route: {
            location: {
                hash: '',
                pathname: '',
                search: '',
                state: ''
            },
            match: {
                params: {},
                isExact: false,
                path: '',
                url: ''
            }
        },
        toJSON: () => '/router/'
    }
};

function wrapContexts(node, context) {
    const { _config, router } = context;
    class Wrap extends React.Component {
        render() {
        // eslint-disable-next-line react/no-this-in-sfc
            const { ...props } = this.props;
            const component = React.cloneElement(props.children, props);
            if (router.history) {
                return (
                    <Router history={router.history}>{component}</Router>
                );
            }

            return (
                <MemoryRouter>{component}</MemoryRouter>
            );
        }
    }

    return <Wrap>{node}</Wrap>;
}

function applyDefaultContexts(context) {
    if (!context) {
        return defaultContexts;
    }

    const newContext = {};
    Object.keys(defaultContexts).forEach(key => {
        newContext[key] = {
            ...defaultContexts[key],
            ...context[key]
        };
    });
    return newContext;
}

export function shallowWithContexts(node, options = {}) {
    const context = applyDefaultContexts(options.context);
    return shallow(wrapContexts(node, context));
}

export function mountWithContexts(node, options = {}) {
    const context = applyDefaultContexts(options.context);
    const childContextTypes = {
        config: shape({
            ansible_version: string,
            custom_virtualenvs: arrayOf(string),
            version: string
        }),
        router: shape({
            route: shape({
                location: shape({}),
                match: shape({})
            }).isRequired,
            history: shape({})
        }),
        ...options.childContextTypes
    };
    return mount(wrapContexts(node, context), { context, childContextTypes });
}

/**
 * Wait for element(s) to achieve a desired state.
 *
 * @param[wrapper] - A ReactWrapper instance
 * @param[selector] - The selector of the element(s) to wait for.
 * @param[callback] - Callback to poll - by default this checks for a node count of 1.
 */
export function waitForElement(
    wrapper,
    selector,
    callback = el => el.length === 1
) {
    const interval = 100;
    return new Promise((resolve, reject) => {
        let attempts = 30;
        (function pollElement() {
            wrapper.update();
            const el = wrapper.find(selector);
            if (callback(el)) {
                return resolve(el);
            }

            if (--attempts <= 0) {
                const message = `Expected condition for <${selector}> not met: ${callback.toString()}`;
                return reject(new Error(message));
            }

            return setTimeout(pollElement, interval);
        }());
    });
}

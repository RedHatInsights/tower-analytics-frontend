import React, { ReactNode } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * The PageLayout is used as the container for the contents of the page.
 * It enables page components to leverage full page layout and scrolling of sub content.
 * An example is a full page table where the page header, toolbar, column headers, and pagination stay fixed, but the rows of the table can scroll.
 *
 * @example
 * <Page>
 *   <PageLayout>
 *     <PageHeader />
 *     ...
 *   </PageLayout>
 * <Page>
 */
export function PageLayout(props: { children?: ReactNode }) {
  return (
    <ErrorBoundary message='Error'>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxHeight: '100%',
        }}
      >
        {props.children}
      </div>
    </ErrorBoundary>
  );
}

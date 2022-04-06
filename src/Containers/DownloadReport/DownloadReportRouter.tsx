import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import DownloadReport from './DownloadReport';
import { Paths } from '../../paths';

const DownloadReportRouter: FunctionComponent<Record<string, never>> = () => {
  return (
    <Switch>
      {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
      <Route path={[`${Paths.downloadReport}/:slug`, '/downloadReport']}>
        <DownloadReport />
      </Route>
    </Switch>
  );
};

export default DownloadReportRouter;

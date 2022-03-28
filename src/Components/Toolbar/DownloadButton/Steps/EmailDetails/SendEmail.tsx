/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FC } from 'react';
import { email as emailAction } from '../../../../../store/pdfDownloadButton';
import { DispatchType } from '../../../../../store';
import { User } from '../../../types';

const generateToken = () => {
  const min = 1000000;
  const max = 10000000000;
  return parseInt(String(min + Math.random() * (max - min)));
};

const parseUrl = (
  emailExtraRows: boolean,
  reportUrl: string,
  token: string,
  expiry: string,
  slug: string
) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const params = `showExtraRows=${emailExtraRows}&token=${token}&expiry=${expiry}&slug=${slug}`;
  const url = new URL(reportUrl).search === '' ? '?' + params : '&' + params;
  return reportUrl.replace('/reports/', '/downloadReport/') + url;
};

interface Props {
  slug: string;
  users: User[];
  eula: boolean;
  additionalRecipients: string;
  subject: string;
  body: string;
  dispatch: DispatchType;
  emailExtraRows: boolean;
  expiry: string;
}

const SendEmail: FC<Props> = ({
  slug,
  users,
  eula,
  additionalRecipients,
  subject,
  body,
  dispatch,
  emailExtraRows,
  expiry,
}) => {
  const all_recipients = users.map(({ usernames }) => usernames);

  if (additionalRecipients !== '')
    all_recipients.push(additionalRecipients.split(','));
  const token = generateToken();
  const reportUrl = window.location.href;
  // Dispatch the email,
  dispatch(
    emailAction(
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        recipient: all_recipients.flat(),
        subject: subject === '' ? 'Report is ready to be viewed' : subject,
        body: body.toString().replace(/(?:\r\n|\r|\n)/g, '<br>'),
        reportUrl: parseUrl(emailExtraRows, reportUrl, token, expiry, slug),
        expiry: expiry,
        slug: slug,
        token: token,
        payload: 'Download',
      },
      dispatch,
      slug
    )
  );
};

export default SendEmail;

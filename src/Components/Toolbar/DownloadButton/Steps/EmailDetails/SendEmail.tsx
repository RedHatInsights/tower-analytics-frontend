/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
// @ts-nocheck
import { FC } from 'react';
import { email as emailAction } from '../../../../../store/pdfDownloadButton';
import { DispatchType } from '../../../../../store';
import { User } from '../../../types';

const generateToken = () => {
  return Math.random(0).toString(36).substring(2, 16);
};

const parseUrl = (
  emailExtraRows: boolean,
  reportUrl: string,
  token: string,
  expiry: string,
  slug: string
) => {
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

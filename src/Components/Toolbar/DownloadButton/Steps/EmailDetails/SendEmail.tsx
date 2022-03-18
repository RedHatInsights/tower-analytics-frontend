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

const generateExpiryDate = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 3);
  return d.toLocaleDateString();
};

const parseUrl = (emailExtraRows: boolean, reportUrl: string) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const params = `showExtraRows=${emailExtraRows}&token=${generateToken()}&expires=${generateExpiryDate()}`;
  const url =
    new URL(window.location.href).search === '' ? '?' + params : '&' + params;
  return reportUrl.replace('/reports/', '/downloadReport/') + url;
};

interface Props {
  slug: string;
  users: User[];
  eula: boolean;
  additionalRecipients: string;
  subject: string;
  body: string;
  reportUrl: string;
  dispatch: DispatchType;
  emailExtraRows: boolean;
}

const SendEmail: FC<Props> = ({
  slug,
  users,
  eula,
  additionalRecipients,
  subject,
  body,
  reportUrl,
  dispatch,
  emailExtraRows,
}) => {
  const all_recipients = users.map(({ emails }) => emails);

  if (additionalRecipients !== '' && eula)
    all_recipients.push(additionalRecipients.split(','));

  // Dispatch the email,
  dispatch(
    emailAction(
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        recipient: all_recipients.flat(),
        subject: subject === '' ? 'Report is ready to be viewed' : subject,
        body: body.toString().replace(/(?:\r\n|\r|\n)/g, '<br>'),
        reportUrl: parseUrl(emailExtraRows, reportUrl),
        payload: 'Download',
      },
      dispatch,
      slug
    )
  );
};

export default SendEmail;

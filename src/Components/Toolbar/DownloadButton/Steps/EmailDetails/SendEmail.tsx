import { PDFEmailParams } from '../../../../../Api';
import { DispatchType } from '../../../../../store';
import { email as emailAction } from '../../../../../store/pdfDownloadButton';
import { User } from '../../../types';

interface Props {
  slug: string;
  users: User[];
  additionalRecipients: string;
  subject: string;
  body: string;
  dispatch: DispatchType;
  emailExtraRows: boolean;
  expiry: string;
  pdfPostBody: PDFEmailParams;
}

const generateToken = (): string => {
  // Use cryptographically secure random number generator
  const array = new Uint8Array(14);
  crypto.getRandomValues(array);
  // Convert bytes to base36 characters
  return Array.from(array, (b) => (b % 36).toString(36)).join('');
};

const parseUrl = (
  emailExtraRows: boolean,
  reportUrl: string,
  token: string,
  expiry: string,
  slug: string,
) => {
  const params = `slug=${slug}&token=${token}`;
  const host = location.protocol + '//' + location.host;
  const url =
    new URL(reportUrl).search === ''
      ? '?' + params
      : location.search + '&' + params;
  return host + '/api/tower-analytics/v1/generate_pdf/' + url;
};

const SendEmail: ({
  slug,
  users,
  additionalRecipients,
  subject,
  body,
  dispatch,
  emailExtraRows,
  expiry,
  pdfPostBody,
}: Props) => void = ({
  slug,
  users,
  additionalRecipients,
  subject,
  body,
  dispatch,
  emailExtraRows,
  expiry,
  pdfPostBody,
}) => {
  const all_recipients = users.map(({ usernames }) => usernames);
  pdfPostBody.dataFetchingParams.showExtraRows = emailExtraRows;

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
        pdfPostBody: pdfPostBody,
      },
      dispatch,
      slug,
      token,
    ),
  );
};

export default SendEmail;

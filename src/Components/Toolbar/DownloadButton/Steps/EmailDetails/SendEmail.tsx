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
  // Generate 14 random bytes (which will give us more than enough entropy for 14 characters)
  const array = new Uint8Array(14);
  crypto.getRandomValues(array);

  // Convert to base36 string similar to original format
  // Use a deterministic conversion to maintain compatibility
  let token = '';
  for (let i = 0; i < array.length; i++) {
    // Convert each byte to base36 and append
    token += array[i].toString(36);
  }

  // Return first 14 characters to match original length
  return token.substring(0, 14);
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

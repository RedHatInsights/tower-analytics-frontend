import { SelectOptionObject } from '@patternfly/react-core';
import { Endpoint, OptionsReturnType, Params } from '../../Api';

export type AttributeType =
  | string
  | string[]
  | SelectOptionObject
  | SelectOptionObject[]
  | boolean;

export interface SelectOptionProps {
  value: string;
  description: string;
  key: string;
}

export type SetValue = (value: AttributeType | null) => void;
export type SetValues = (
  type: string | null,
  value: AttributeType | null
) => void;
export type ApiOptionsType = Record<
  string,
  { key: string; value: AttributeType }[]
>;

export interface User {
  uuid: string;
  name: string;
  emails: string[];
  usernames: string[];
}

export interface RbacGroupFromApi {
  uuid: string;
  name: string;
  description: string;
  principalCount: number;
  platform_default: boolean;
  roleCount: number;
  created: string;
  modified: string;
  system: boolean;
}

export interface RbacPrincipalFromApi {
  username: string;
  email: string;
}

export interface EmailDetailsProps {
  downloadType: string;
  showExtraRows: boolean;
  additionalRecipients: string;
  eula: boolean;
  emailExtraRows: boolean;
  subject: string;
  body: string;
  selectedRbacGroups: string[];
  users: User[];
  expiry: string;
}

export interface PdfDetailsProps {
  settingsNamespace: string;
  slug: string;
  isMoney: boolean;
  name: string;
  description: string;
  endpointUrl: Endpoint;
  queryParams: Params;
  selectOptions: OptionsReturnType;
  y: string;
  label: string;
  xTickFormat: string;
  themeColor: string;
  chartType: string;
  totalPages: number;
  pageLimit: number;
  sortOptions: string;
  sortOrder: 'asc' | 'desc';
  dateGranularity: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  inputs?: { automationCost: number; manualCost: number };
  adoptionRateType: string;
}

export interface TypeValue {
  type: string;
  value?: string | string[] | boolean | number | User[];
}

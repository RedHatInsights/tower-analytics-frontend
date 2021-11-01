export enum ValidFeatureFlags {
  orgReports = 'orgReports',
  pdfDownloadButton = 'pdfDownloadButton',
  moduleReports = 'moduleReports',
}

export interface FeatureFlagType {
  name: ValidFeatureFlags;
  enabled: boolean;
}

export interface ApiFeatureFlagReturnType {
  toggles?: FeatureFlagType[];
}

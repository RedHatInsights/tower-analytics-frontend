export enum ValidFeatureFlags {
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

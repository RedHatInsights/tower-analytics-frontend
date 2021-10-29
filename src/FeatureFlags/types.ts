export enum ValidFeatureFlags {
  pdfDownloadButton = 'pdfDownloadButton',
}

export interface FeatureFlagType {
  name: ValidFeatureFlags;
  enabled: boolean;
}

export interface ApiFeatureFlagReturnType {
  toggles?: FeatureFlagType[];
}

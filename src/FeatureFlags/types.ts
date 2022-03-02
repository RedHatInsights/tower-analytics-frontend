export enum ValidFeatureFlags {
  moduleReports = 'moduleReports',
  newAutomationCalculator = 'newAutomationCalculator',
  onboardingReports = 'aa21Onboarding',
  sendEmail = 'sendEmail',
}

export interface FeatureFlagType {
  name: ValidFeatureFlags;
  enabled: boolean;
}

export interface ApiFeatureFlagReturnType {
  toggles?: FeatureFlagType[];
}

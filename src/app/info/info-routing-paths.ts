import { getInfoModulePath } from '../app-routing-paths';

export const END_USER_AGREEMENT_PATH = 'end-user-agreement';
export const PRIVACY_PATH = 'privacy';
export const FEEDBACK_PATH = 'feedback';
export const HELP_PATH = 'help';
export const CONTACT_PATH = 'contact';
export const LANDING_PAGE_PATH = 'landing-page'

export function getEndUserAgreementPath() {
    return getSubPath(END_USER_AGREEMENT_PATH);
}

export function getPrivacyPath() {
    return getSubPath(PRIVACY_PATH);
}

export function getFeedbackPath() {
    return getSubPath(FEEDBACK_PATH);
}
export function getHelpPath() {
  return getSubPath(HELP_PATH);
}
export function getContactPath() {
  return getSubPath(CONTACT_PATH);
}
export function getLandingPagePath() {
  return getSubPath(LANDING_PAGE_PATH);
}
function getSubPath(path: string) {
    return `${getInfoModulePath()}/${path}`;
}

import { URLCombiner } from '../core/url-combiner/url-combiner';

export const TOPIC_PARENT_PARAMETER = 'parent';

export const TOPIC_MODULE_PATH = 'topics';

export function getTopicModuleRoute() {
  return `/${TOPIC_MODULE_PATH}`;
}

export function getTopicPageRoute(topicId: string) {
  return new URLCombiner(getTopicModuleRoute(), topicId).toString();
}

export function getTopicEditRoute(id: string) {
  return new URLCombiner(getTopicModuleRoute(), id, TOPIC_EDIT_PATH).toString();
}

export function getTopicCreateRoute() {
  return new URLCombiner(getTopicModuleRoute(), TOPIC_CREATE_PATH).toString();
}

export function getTopicEditRolesRoute(id) {
  return new URLCombiner(
    getTopicPageRoute(id),
    TOPIC_EDIT_PATH,
    TOPIC_EDIT_ROLES_PATH
  ).toString();
}

export const TOPIC_CREATE_PATH = 'create';
export const TOPIC_EDIT_PATH = 'edit';
export const TOPIC_EDIT_ROLES_PATH = 'roles';

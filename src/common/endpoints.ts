const API_VERSION = '/v1';
const COMMON_ENDPOINT = `/api${API_VERSION}`;

export const USERS = `${COMMON_ENDPOINT}/users`;
export const AUTH_LOGIN = `${COMMON_ENDPOINT}/auth/sign-in`;
export const CHANGE_PASSWORD = `${COMMON_ENDPOINT}/auth/change-password`;
export const PERMISSIONS = `${COMMON_ENDPOINT}/permissions`;
export const ROLES = `${COMMON_ENDPOINT}/roles`;
export const USER_ROLES = `${COMMON_ENDPOINT}/user-roles`;
export const TASKS = `${COMMON_ENDPOINT}/projects/:projectId/tasks`;
export const PROJECTS = `${COMMON_ENDPOINT}/projects`;
export const TEAMS = `${COMMON_ENDPOINT}/teams`;

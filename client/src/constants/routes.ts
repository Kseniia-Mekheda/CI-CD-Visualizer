export const ROUTES = {
  REFRESH_TOKEN: '/auth/refresh',
  LOGIN: '/auth/login',
  GOOGLE_LOGIN: '/auth/google/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  UPLOAD_YAML: '/parser/upload-yaml',
  HISTORY: '/parser/history',
  HISTORY_BY_ID: (id: string) => `/parser/history/${id}`,
  AI_ANALYZE: '/ai/analyze-pipeline',
  UPDATE_YAML: '/parser/update',
};

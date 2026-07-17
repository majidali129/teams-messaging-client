/** Allow only same-origin relative paths for post-auth redirects. */
export const getSafeReturnTo = (returnTo: string | null): string | null => {
  if (!returnTo) return null;
  if (!returnTo.startsWith('/') || returnTo.startsWith('//')) return null;
  return returnTo;
};

export const buildAuthSearchParams = (params: {
  returnTo?: string | null;
  email?: string | null;
}) => {
  const search = new URLSearchParams();
  const safeReturnTo = getSafeReturnTo(params.returnTo ?? null);
  if (safeReturnTo) search.set('returnTo', safeReturnTo);
  if (params.email) search.set('email', params.email);
  return search;
};

export const isAuthenticated = () =>
  !!localStorage.getItem('access-token') && !!localStorage.getItem('user');

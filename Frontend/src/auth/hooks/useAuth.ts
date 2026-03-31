import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { login, signup, logout, completeOnboarding, setUser, updateUser } from '../store/authSlice';
import { replaceBusinesses } from '../store/businessSlice';
import { authApi, mapProfileToFrontend } from '../../api/auth';
import { businessApi, mapBusinessToFrontend } from '../../api/businesses';
import { toast } from 'sonner';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const fetchProfileAndBusinesses = useCallback(
    async (_token: string, loginEmail?: string) => {
      try {
        const profile = await authApi.getProfile();
        const user = mapProfileToFrontend(profile);
        dispatch(setUser({ ...user, email: loginEmail || user.email || '' }));

        const summaries = await businessApi.list();
        const businesses = summaries.map((s, i) => ({
          ...mapBusinessToFrontend(s),
          isActive: i === 0,
        }));
        dispatch(replaceBusinesses(businesses));
      } catch {
        // profile fetch is best-effort during login flow
      }
    },
    [dispatch],
  );

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.signIn({ email, password });
      dispatch(
        login({
          email,
          token: res.access_token,
          refreshToken: res.refresh_token,
        }),
      );
      await fetchProfileAndBusinesses(res.access_token, email);
    },
    [dispatch, fetchProfileAndBusinesses],
  );

  const handleSignup = useCallback(
    async (email: string, password: string, firstName?: string, lastName?: string) => {
      const res = await authApi.signUp({ email, password, first_name: firstName, last_name: lastName });
      dispatch(
        signup({
          email,
          token: res.access_token,
          refreshToken: res.refresh_token,
        }),
      );
    },
    [dispatch],
  );

  const handleGoogleLogin = useCallback(
    async (idToken: string) => {
      const res = await authApi.googleOAuth(idToken);
      dispatch(
        login({
          email: '',
          token: res.access_token,
          refreshToken: res.refresh_token,
        }),
      );
      await fetchProfileAndBusinesses(res.access_token);
    },
    [dispatch, fetchProfileAndBusinesses],
  );

  const handleLogout = useCallback(async () => {
    try {
      await authApi.signOut();
    } catch {
      // sign out even if the API call fails
    }
    dispatch(logout());
  }, [dispatch]);

  return {
    ...auth,
    login: handleLogin,
    signup: handleSignup,
    googleLogin: handleGoogleLogin,
    logout: handleLogout,
    completeOnboarding: () => dispatch(completeOnboarding()),
    setUser: (user: Parameters<typeof setUser>[0]) => dispatch(setUser(user)),
    updateUser: (updates: Parameters<typeof updateUser>[0]) => dispatch(updateUser(updates)),
    fetchProfileAndBusinesses,
  };
};

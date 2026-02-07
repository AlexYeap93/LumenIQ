import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { login, signup, logout, completeOnboarding } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    ...auth,
    login: (email: string, token: string) => dispatch(login({ email, token })),
    signup: (email: string, token: string) => dispatch(signup({ email, token })),
    logout: () => dispatch(logout()),
    completeOnboarding: () => dispatch(completeOnboarding()),
  };
};

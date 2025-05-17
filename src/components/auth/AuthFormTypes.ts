
export interface AuthFormProps {
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignup: (email: string, password: string, username: string) => Promise<void>;
  loading: boolean;
}

export interface AuthUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface LoginFormValues {
  username: string;
  email: string;
  password: string;
}

/** The profile form edits everything except the username. */
export type ProfileFormValues = Omit<AuthUser, "username">;

export type Theme = "light" | "dark";

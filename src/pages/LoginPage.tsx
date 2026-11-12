import { useFormik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "../components/ui/Button";
import { ArrowLeftIcon } from "../components/ui/Icons";
import { TextField } from "../components/ui/TextField";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type { LoginFormValues } from "../types/user";
import { getRedirectPath } from "../utils/guards";

/** Yup schema — the exact error texts come from the PRD (P1.2). */
const loginSchema = Yup.object({
  username: Yup.string().trim().required("Username is required"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
});

const INITIAL_VALUES: LoginFormValues = { username: "", password: "" };

export default function LoginPage() {
  const { login, logout, isLoggedIn, displayName } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Came here from /checkout (or another protected page)? Go back there after login.
  const redirectTo = getRedirectPath(location.state, "/");
  const cameFromCheckout = redirectTo === "/checkout";

  // Formik keeps values / touched / errors; Yup validates on change, blur and submit.
  const formik = useFormik<LoginFormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      login(values.username);
      showToast(`Welcome, ${values.username.trim()} ✓`);
      navigate(redirectTo, { replace: true });
    },
  });

  const fieldError = (field: keyof LoginFormValues) =>
    formik.touched[field] || formik.submitCount > 0 ? formik.errors[field] : undefined;

  return (
    <div className="container-page py-10 sm:py-16">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-4xl border border-line bg-surface md:grid-cols-2">
        <aside
          className="relative hidden flex-col justify-end p-10 text-white md:flex"
          style={{
            background:
              "radial-gradient(110% 70% at 20% 10%, rgb(201 168 118 / 0.5), transparent 65%), linear-gradient(160deg, #6a3245, #3a1824)",
          }}
        >
          <p className="eyebrow text-white/75">Members' corner</p>
          <p className="mt-3 font-display text-4xl leading-tight font-semibold">Your favourite scents, one click away.</p>
          <p className="mt-4 text-sm text-white/80">Log in to check out, follow your orders and keep your bag on every visit.</p>
        </aside>

        <div className="p-6 sm:p-10">
          <Link to="/" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full text-sm text-ink-soft hover:text-ink">
            <ArrowLeftIcon width={18} height={18} /> Back to catalog
          </Link>

          <h1 className="mt-4 text-4xl font-semibold">Log in</h1>

          {isLoggedIn ? (
            <div className="mt-6 space-y-4">
              <p className="text-ink-soft">
                You are logged in as <span className="font-medium text-ink">{displayName}</span>.
              </p>
              <Button variant="secondary" onClick={logout}>
                Log out
              </Button>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-ink-soft">
                {cameFromCheckout ? "Please log in to complete your order." : "Welcome back — please enter your details."}
              </p>

              <form onSubmit={formik.handleSubmit} noValidate className="mt-6 space-y-5">
                <TextField
                  id="username"
                  name="username"
                  label="Username"
                  autoComplete="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={fieldError("username")}
                />
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={fieldError("password")}
                  hint="Demo login — any username and a password of 6+ characters (e.g. emilys / emilyspass)."
                />
                <Button type="submit" size="lg" fullWidth disabled={formik.isSubmitting}>
                  Log In
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

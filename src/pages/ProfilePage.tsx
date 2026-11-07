import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { TextField } from "../components/ui/TextField";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { loadOrders, ordersStorage, reviewsStorage } from "../models/storage";
import type { ProfileFormValues } from "../types/user";
import { hasErrors, validateProfile, type FormErrors } from "../utils/validation";

const FIELDS: ReadonlyArray<{ name: keyof ProfileFormValues; label: string; type?: string; autoComplete: string }> = [
  { name: "firstName", label: "First name", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", autoComplete: "family-name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel" },
];

export default function ProfilePage() {
  const { user, displayName, updateProfile, logout } = useAuth();
  const { clear } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState<ProfileFormValues>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [errors, setErrors] = useState<FormErrors<ProfileFormValues>>({});
  const [orderCount, setOrderCount] = useState(() => loadOrders().length);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateProfile(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    updateProfile(values);
    showToast("Profile saved ✓");
  }

  function handleClearData() {
    if (!window.confirm("Clear your cart, orders and reviews on this device?")) return;
    clear();
    ordersStorage.remove();
    reviewsStorage.remove();
    setOrderCount(0);
    showToast("Local data cleared.", "info");
  }

  function handleLogout() {
    logout();
    showToast("You have been logged out.", "info");
    navigate("/");
  }

  const initials =
    displayName
      .split(/\s+/)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div className="container-page py-10 sm:py-14">
      <p className="eyebrow text-accent">Your account</p>
      <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">Profile</h1>

      <div className="mt-8 grid items-start gap-8 *:min-w-0 lg:grid-cols-[18rem_1fr]">
        <aside className="rounded-2xl border border-line bg-surface p-6 text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-accent font-display text-3xl font-semibold text-on-accent">
            {initials}
          </span>
          <p className="mt-4 font-display text-2xl font-semibold">{displayName}</p>
          <p className="text-sm text-ink-soft">@{user?.username}</p>
          <p className="mt-4 text-sm">
            <span className="font-semibold">{orderCount}</span> <span className="text-ink-soft">orders placed</span>
          </p>
        </aside>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-line bg-surface p-5 sm:p-8">
            <h2 className="text-2xl font-semibold">Personal details</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <TextField
                  key={field.name}
                  id={field.name}
                  name={field.name}
                  label={field.label}
                  type={field.type ?? "text"}
                  autoComplete={field.autoComplete}
                  value={values[field.name]}
                  onChange={handleChange}
                  error={errors[field.name]}
                />
              ))}
            </div>
            <Button type="submit" className="mt-6">
              Save changes
            </Button>
          </form>

          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-8">
            <h2 className="text-2xl font-semibold">Preferences &amp; data</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <ThemeToggle withLabel />
              <Button variant="secondary" onClick={handleClearData}>
                Clear local data
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </div>
            <p className="mt-3 text-xs text-ink-soft">Clearing local data keeps your session and theme.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

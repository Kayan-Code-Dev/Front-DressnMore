import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import type { AccountProfile } from "@/features/settings/types/settings.types";
import { getAccountSettingsMock } from "@/features/settings/services/settings.mock.service";

export function AccountSettingsPage() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    getAccountSettingsMock().then((response) => {
      setProfile(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    });
  }, []);

  return (
    <section>
      <div className="page-title">
        <h2>Account Settings</h2>
        <p>Mock account/profile settings screen with placeholder actions.</p>
      </div>

      <div className="insight-grid">
        <article className="insight-card">
          <h3>Profile</h3>
          <form className="form-field" onSubmit={(event) => event.preventDefault()}>
            <FormField label="Name" htmlFor="settings-name">
              <Input id="settings-name" value={name} onChange={(event) => setName(event.target.value)} />
            </FormField>
            <FormField label="Email" htmlFor="settings-email">
              <Input id="settings-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </FormField>
            <FormField label="Avatar" htmlFor="settings-avatar" hint="Mock upload only">
              <Input id="settings-avatar" type="file" disabled />
            </FormField>
            <FormField label="Logo" htmlFor="settings-logo" hint="Mock upload only">
              <Input id="settings-logo" type="file" disabled />
            </FormField>
            <Button disabled={!profile}>Save Profile (Mock)</Button>
          </form>
        </article>

        <article className="insight-card">
          <h3>Password</h3>
          <form className="form-field" onSubmit={(event) => event.preventDefault()}>
            <FormField label="Current Password" htmlFor="current-password">
              <Input id="current-password" type="password" />
            </FormField>
            <FormField label="New Password" htmlFor="new-password">
              <Input id="new-password" type="password" />
            </FormField>
            <FormField label="Confirm New Password" htmlFor="confirm-password">
              <Input id="confirm-password" type="password" />
            </FormField>
            <Button>Update Password (Mock)</Button>
          </form>
        </article>

        <article className="insight-card">
          <h3>Delete Account</h3>
          <p>This action is a placeholder only in mock phase.</p>
          <Button variant="secondary" disabled>
            Delete Account (Placeholder)
          </Button>
        </article>
      </div>
    </section>
  );
}

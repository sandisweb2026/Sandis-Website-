import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchAdminSettings, upsertAdminSetting } from "@/lib/travel-cms";

type SettingsFormState = Record<string, string>;

const defaultSettings: Array<{ key: string; label: string; multiline?: boolean }> =
  [
    { key: "contact_phone", label: "Contact Phone" },
    { key: "contact_email", label: "Contact Email" },
    { key: "contact_address", label: "Contact Address", multiline: true },
    { key: "instagram_url", label: "Instagram URL" },
    { key: "facebook_url", label: "Facebook URL" },
    { key: "default_whatsapp_message", label: "Default WhatsApp Message", multiline: true },
  ];

const AdminSettings = () => {
  const [settings, setSettings] = useState<SettingsFormState>({});
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      const rows = await fetchAdminSettings();
      const next = rows.reduce<SettingsFormState>((accumulator, item) => {
        accumulator[item.setting_key] = item.setting_value ?? "";
        return accumulator;
      }, {});
      setSettings(next);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load settings.";
      toast.error(message);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const setting of defaultSettings) {
        await upsertAdminSetting(
          setting.key,
          settings[setting.key]?.trim() || null,
        );
      }

      toast.success("Settings updated.");
      await loadSettings();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save settings.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/admin"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-4">
          {defaultSettings.map((setting) => (
            <div key={setting.key} className="space-y-2">
              <p className="text-sm font-medium text-foreground">{setting.label}</p>
              {setting.multiline ? (
                <Textarea
                  value={settings[setting.key] ?? ""}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      [setting.key]: event.target.value,
                    }))
                  }
                  rows={4}
                />
              ) : (
                <Input
                  value={settings[setting.key] ?? ""}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      [setting.key]: event.target.value,
                    }))
                  }
                />
              )}
            </div>
          ))}

          <Button onClick={handleSave} disabled={saving} className="gap-2 mt-2">
            <Save size={16} />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

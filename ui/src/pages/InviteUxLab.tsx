import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyPatternIcon } from "@/components/CompanyPatternIcon";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  Clock3,
  ExternalLink,
  FlaskConical,
  KeyRound,
  Link2,
  Loader2,
  MailPlus,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

const inviteRoleOptions = [
  {
    value: "viewer",
    label: "Viewer",
    description: "Can view company work and follow along without operational permissions.",
    gets: "No built-in grants.",
  },
  {
    value: "operator",
    label: "Operator",
    description: "Recommended for people who need to help run work without managing access.",
    gets: "Can assign tasks.",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Recommended for operators who need to invite people, create agents, and approve joins.",
    gets: "Can create agents, invite users, assign tasks, and approve join requests.",
  },
  {
    value: "owner",
    label: "Owner",
    description: "Full company access, including membership and permission management.",
    gets: "Everything in Admin, plus managing members and permission grants.",
  },
] as const;

const inviteHistory = [
  {
    id: "invite-active",
    state: "Active",
    humanRole: "operator",
    invitedBy: "Board User 25",
    email: "board25@paperclip.local",
    createdAt: "Apr 25, 2026, 9:00 AM",
    action: "Revoke",
    relatedLabel: "Review request",
  },
  {
    id: "invite-accepted",
    state: "Accepted",
    humanRole: "viewer",
    invitedBy: "Board User 24",
    email: "board24@paperclip.local",
    createdAt: "Apr 24, 2026, 8:15 AM",
    action: "Inactive",
    relatedLabel: "—",
  },
  {
    id: "invite-revoked",
    state: "Revoked",
    humanRole: "admin",
    invitedBy: "Board User 20",
    email: "board20@paperclip.local",
    createdAt: "Apr 20, 2026, 2:45 PM",
    action: "Inactive",
    relatedLabel: "—",
  },
  {
    id: "invite-expired",
    state: "Expired",
    humanRole: "owner",
    invitedBy: "Board User 19",
    email: "board19@paperclip.local",
    createdAt: "Apr 19, 2026, 7:10 PM",
    action: "Inactive",
    relatedLabel: "—",
  },
] as const;

const fieldClassName =
  "w-full border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500";
const panelClassName = "border border-zinc-800 bg-zinc-950/95 p-6";

function LabSection({
  eyebrow,
  title,
  description,
  accentClassName,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accentClassName?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <section
      className={cn(
        "rounded-[28px] border border-border/70 bg-background/80 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5",
        accentClassName,
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function StatusCard({
  icon,
  title,
  body,
  tone = "default",
}: {
  icon: ReactNode;
  title: string;
  body: string;
  tone?: "default" | "warn" | "success" | "error";
}) {
  const { t } = useTranslation();
  const toneClassName = {
    default: "border-border/70 bg-background/85",
    warn: "border-amber-400/40 bg-amber-500/[0.08]",
    success: "border-emerald-400/40 bg-emerald-500/[0.08]",
    error: "border-rose-400/40 bg-rose-500/[0.08]",
  }[tone];

  return (
    <Card className={cn("rounded-[24px] shadow-none", toneClassName)}>
      <CardHeader className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-current/10 bg-background/70 text-muted-foreground">
          {icon}
        </div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="mt-2 text-sm leading-6">{body}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}

function InviteLandingShell({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950 shadow-[0_30px_80px_rgba(2,6,23,0.55)]">
      <div className="grid gap-px bg-zinc-800 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className={cn(panelClassName, "space-y-6 bg-zinc-950")}>{left}</section>
        <section className={cn(panelClassName, "h-full bg-zinc-950")}>{right}</section>
      </div>
    </div>
  );
}

function InviteSummaryPanel({
  title,
  description,
  inviteMessage,
  requestedAccess,
  signedInLabel,
}: {
  title: string;
  description: string;
  inviteMessage?: string;
  requestedAccess: string;
  signedInLabel?: string;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-start gap-4">
        <CompanyPatternIcon
          companyName="Acme Robotics"
          logoUrl="/api/invites/pcp_invite_test/logo"
          brandColor="#114488"
          className="h-16 w-16 rounded-none border border-zinc-800"
        />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{t("inviteUxLab.summary_invited_to_join")}</p>
          <h3 className="mt-2 text-2xl font-semibold text-zinc-100">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">{description}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MetaCard label={t("inviteUxLab.meta_company")} value="Acme Robotics" />
        <MetaCard label={t("inviteUxLab.meta_invited_by")} value="Board User" />
        <MetaCard label={t("inviteUxLab.meta_requested_access")} value={requestedAccess} />
        <MetaCard label={t("inviteUxLab.meta_invite_expires")} value="Mar 7, 2027" />
      </div>

      {inviteMessage ? (
        <div className="border border-amber-500/40 bg-amber-500/10 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-amber-200/80">{t("inviteUxLab.meta_message_from_inviter")}</div>
          <p className="mt-2 text-sm leading-6 text-amber-50">{inviteMessage}</p>
        </div>
      ) : null}

      {signedInLabel ? (
        <div className="border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-50">
          {t("inviteUxLab.meta_signed_in_as", { signedInLabel })}
        </div>
      ) : null}
    </>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-800 p-3">
      <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</div>
      <div className="mt-1 text-sm text-zinc-100">{value}</div>
    </div>
  );
}

function InlineAuthPreview({
  mode,
  feedback,
  working,
}: {
  mode: "sign_up" | "sign_in";
  feedback?: { tone: "info" | "error"; text: string };
  working?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">
          {mode === "sign_up" ? t("inviteUxLab.inline_sign_up_heading") : t("inviteUxLab.inline_sign_in_heading")}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">
          {mode === "sign_up"
            ? t("inviteUxLab.inline_sign_up_description")
            : t("inviteUxLab.inline_sign_in_description")}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className={cn(
            "flex-1 border px-3 py-2 text-sm transition-colors",
            mode === "sign_up"
              ? "border-zinc-100 bg-zinc-100 text-zinc-950"
              : "border-zinc-800 text-zinc-300 hover:border-zinc-600",
          )}
        >
          {t("inviteUxLab.btn_create_account")}
        </button>
        <button
          type="button"
          className={cn(
            "flex-1 border px-3 py-2 text-sm transition-colors",
            mode === "sign_in"
              ? "border-zinc-100 bg-zinc-100 text-zinc-950"
              : "border-zinc-800 text-zinc-300 hover:border-zinc-600",
          )}
        >
          {t("inviteUxLab.btn_already_have_account")}
        </button>
      </div>

      <form className="space-y-4">
        {mode === "sign_up" ? (
          <label className="block text-sm">
            <span className="mb-1 block text-zinc-400">{t("inviteUxLab.label_name")}</span>
            <input name="name" className={fieldClassName} defaultValue="Jane Example" readOnly />
          </label>
        ) : null}
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">{t("inviteUxLab.label_email")}</span>
          <input name="email" type="email" className={fieldClassName} defaultValue="jane@example.com" readOnly />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-zinc-400">{t("inviteUxLab.label_password")}</span>
          <input name="password" type="password" className={fieldClassName} defaultValue="supersecret" readOnly />
        </label>
        {feedback ? (
          <p className={cn("text-xs", feedback.tone === "info" ? "text-amber-300" : "text-red-400")}>
            {feedback.text}
          </p>
        ) : null}
        <Button type="button" className="w-full rounded-none" disabled={working}>
          {working
            ? t("inviteUxLab.btn_working")
            : mode === "sign_in"
              ? t("inviteUxLab.btn_sign_in_and_continue")
              : t("inviteUxLab.btn_create_account_and_continue")}
        </Button>
      </form>

      <p className="text-xs leading-5 text-zinc-500">
        {mode === "sign_up"
          ? t("inviteUxLab.footer_sign_up")
          : t("inviteUxLab.footer_sign_in")}
      </p>
    </div>
  );
}

function AgentRequestPreview() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">{t("inviteUxLab.agent_heading")}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          {t("inviteUxLab.agent_description")}
        </p>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block text-zinc-400">{t("inviteUxLab.label_agent_name")}</span>
        <input className={fieldClassName} defaultValue="Acme Ops Agent" readOnly />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-zinc-400">{t("inviteUxLab.label_adapter_type")}</span>
        <select className={fieldClassName} defaultValue="codex_local" disabled>
          <option value="codex_local">Codex</option>
          <option value="claude_local">Claude Code</option>
          <option value="cursor">Cursor</option>
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-zinc-400">{t("inviteUxLab.label_capabilities")}</span>
        <textarea
          className={fieldClassName}
          rows={4}
          defaultValue="Reviews invites, triages requests, and keeps the board queue moving."
          readOnly
        />
      </label>
      <Button type="button" className="w-full rounded-none">
        {t("inviteUxLab.btn_submit_request")}
      </Button>
    </div>
  );
}

function AcceptInvitePreview({
  autoAccept,
  isCurrentMember,
  error,
}: {
  autoAccept?: boolean;
  isCurrentMember?: boolean;
  error?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100">{t("inviteUxLab.accept_heading")}</h3>
        <p className="mt-1 text-sm text-zinc-400">
          {autoAccept
            ? t("inviteUxLab.accept_description_auto_accept")
            : isCurrentMember
              ? t("inviteUxLab.accept_description_member")
              : t("inviteUxLab.accept_description_default")}
        </p>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {autoAccept ? (
        <div className="text-sm text-zinc-400">{t("inviteUxLab.btn_working")}</div>
      ) : (
        <Button type="button" className="w-full rounded-none" disabled={isCurrentMember}>
          {t("inviteUxLab.btn_accept_invite")}
        </Button>
      )}
    </div>
  );
}

function InviteResultPreview({
  title,
  description,
  claimSecret,
  onboardingTextUrl,
  joinedNow = false,
}: {
  title: string;
  description: string;
  claimSecret?: string;
  onboardingTextUrl?: string;
  joinedNow?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-md border border-zinc-800 bg-zinc-950 p-6 text-zinc-100">
      <div className="flex items-center gap-3">
        <CompanyPatternIcon
          companyName="Acme Robotics"
          logoUrl="/api/invites/pcp_invite_test/logo"
          brandColor="#114488"
          className="h-12 w-12 rounded-none border border-zinc-800"
        />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        <p className="text-sm text-zinc-400">{description}</p>
        {joinedNow ? (
          <Button type="button" className="w-full rounded-none">
            {t("inviteUxLab.btn_open_board")}
          </Button>
        ) : (
          <>
            <div className="border border-zinc-800 p-3">
              <p className="mb-1 text-xs text-zinc-500">{t("inviteUxLab.label_approval_page")}</p>
              <a className="text-sm text-zinc-200 underline underline-offset-2" href="/company/settings/access">
                {t("inviteUxLab.link_company_settings_access")}
              </a>
            </div>
            <p className="text-xs text-zinc-500">
              {t("inviteUxLab.footer_refresh_approved")}
            </p>
          </>
        )}
        {claimSecret ? (
          <div className="space-y-1 border border-zinc-800 p-3 text-xs text-zinc-400">
            <div className="text-zinc-200">{t("inviteUxLab.label_claim_secret")}</div>
            <div className="font-mono break-all">{claimSecret}</div>
            <div className="font-mono break-all">POST /api/agents/claim-api-key</div>
          </div>
        ) : null}
        {onboardingTextUrl ? (
          <div className="text-xs text-zinc-400">
            {t("inviteUxLab.label_onboarding")} <span className="font-mono break-all">{onboardingTextUrl}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AuthScreenPreview({ mode, error }: { mode: "sign_in" | "sign_up"; error?: string }) {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden rounded-[28px] border border-border/70 bg-background shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
      <div className="grid gap-px bg-border/60 md:grid-cols-2">
        <div className="flex min-h-[420px] flex-col justify-center bg-background px-8 py-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Paperclip</span>
            </div>
            <h3 className="text-xl font-semibold">
              {mode === "sign_in" ? t("inviteUxLab.auth_sign_in_heading") : t("inviteUxLab.auth_sign_up_heading")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "sign_in"
                ? t("inviteUxLab.auth_sign_in_description")
                : t("inviteUxLab.auth_sign_up_description")}
            </p>
            <div className="mt-6 space-y-4">
              {mode === "sign_up" ? (
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">{t("inviteUxLab.label_name")}</span>
                  <input
                    className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                    defaultValue="Jane Example"
                    readOnly
                  />
                </label>
              ) : null}
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{t("inviteUxLab.label_email")}</span>
                <input
                  className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                  defaultValue="jane@example.com"
                  readOnly
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-muted-foreground">{t("inviteUxLab.label_password")}</span>
                <input
                  className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                  defaultValue="supersecret"
                  readOnly
                />
              </label>
              {error ? <p className="text-xs text-destructive">{error}</p> : null}
              <Button type="button" className="w-full">
                {mode === "sign_in" ? t("inviteUxLab.btn_sign_in") : t("inviteUxLab.btn_create_account_btn")}
              </Button>
            </div>
            <div className="mt-5 text-sm text-muted-foreground">
              {mode === "sign_in" ? t("inviteUxLab.auth_need_account") : t("inviteUxLab.auth_have_account")}{" "}
              <span className="font-medium text-foreground underline underline-offset-2">
                {mode === "sign_in" ? t("inviteUxLab.auth_link_create") : t("inviteUxLab.auth_link_sign_in")}
              </span>
            </div>
          </div>
        </div>
        <div className="hidden min-h-[420px] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(8,145,178,0.18),transparent_48%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,1))] px-8 py-10 md:flex">
          <div className="max-w-sm space-y-4 text-zinc-200">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-cyan-200">
              {t("inviteUxLab.badge_auth_preview")}
            </div>
            <div className="text-2xl font-semibold">{t("inviteUxLab.auth_preview_heading")}</div>
            <p className="text-sm leading-6 text-zinc-400">
              {t("inviteUxLab.auth_preview_description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanyInvitesPreview() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <Card className="rounded-[28px] shadow-none">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MailPlus className="h-4 w-4" />
            {t("inviteUxLab.company_invites_header")}
          </div>
          <div>
            <CardTitle>{t("inviteUxLab.create_invite_title")}</CardTitle>
            <CardDescription className="mt-2">
              {t("inviteUxLab.create_invite_description")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">{t("inviteUxLab.choose_role_label")}</legend>
            <div className="rounded-2xl border border-border">
              {inviteRoleOptions.map((option, index) => (
                <label
                  key={option.value}
                  className={cn("flex cursor-default gap-3 px-4 py-4", index > 0 && "border-t border-border")}
                >
                  <input
                    type="radio"
                    readOnly
                    checked={option.value === "operator"}
                    className="mt-1 h-4 w-4 border-border text-foreground"
                  />
                  <span className="min-w-0 space-y-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{option.label}</span>
                      {option.value === "operator" ? (
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          {t("inviteUxLab.role_default_badge")}
                        </span>
                      ) : null}
                    </span>
                    <span className="block max-w-2xl text-sm text-muted-foreground">{option.description}</span>
                    <span className="block text-sm text-foreground">{option.gets}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground">
            {t("inviteUxLab.invite_single_use_note")}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button">{t("inviteUxLab.btn_create_invite")}</Button>
            <span className="text-sm text-muted-foreground">{t("inviteUxLab.invite_history_note")}</span>
          </div>

          <div className="space-y-3 rounded-2xl border border-border px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{t("inviteUxLab.latest_invite_link_title")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("inviteUxLab.latest_invite_link_description")}
                </div>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
                <Check className="h-3.5 w-3.5" />
                {t("inviteUxLab.copied_label")}
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-md border border-border bg-muted/60 px-3 py-2 text-left text-sm break-all"
            >
              https://paperclip.local/invite/new-token
            </button>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline">
                <ExternalLink className="h-4 w-4" />
                {t("inviteUxLab.btn_open_invite")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] shadow-none">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{t("inviteUxLab.invite_history_title")}</CardTitle>
              <CardDescription className="mt-2">
                {t("inviteUxLab.invite_history_description")}
              </CardDescription>
            </div>
            <a href="/inbox/requests" className="text-sm underline underline-offset-4">
              {t("inviteUxLab.link_open_join_queue")}
            </a>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 font-medium text-muted-foreground">{t("inviteUxLab.table_state")}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{t("inviteUxLab.table_role")}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{t("inviteUxLab.table_invited_by")}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{t("inviteUxLab.table_created")}</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">{t("inviteUxLab.table_join_request")}</th>
                  <th className="px-5 py-3 text-right font-medium text-muted-foreground">{t("inviteUxLab.table_action")}</th>
                </tr>
              </thead>
              <tbody>
                {inviteHistory.map((invite) => (
                  <tr key={invite.id} className="border-b border-border last:border-b-0">
                    <td className="px-5 py-3 align-top">
                      <span className="inline-flex rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {invite.state}
                      </span>
                    </td>
                    <td className="px-5 py-3 align-top">{invite.humanRole}</td>
                    <td className="px-5 py-3 align-top">
                      <div>{invite.invitedBy}</div>
                      <div className="text-xs text-muted-foreground">{invite.email}</div>
                    </td>
                    <td className="px-5 py-3 align-top text-muted-foreground">{invite.createdAt}</td>
                    <td className="px-5 py-3 align-top">
                      {invite.relatedLabel === "Review request" ? (
                        <a href="/inbox/requests" className="underline underline-offset-4">
                          {invite.relatedLabel}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{invite.relatedLabel}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right align-top">
                      {invite.action === "Revoke" ? (
                        <Button type="button" size="sm" variant="outline">
                          {t("inviteUxLab.btn_revoke")}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">{t("inviteUxLab.inactive_label")}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border p-4">
              <div className="text-sm font-medium">{t("inviteUxLab.empty_history_title")}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {t("inviteUxLab.empty_history_description")}
              </div>
            </div>
            <div className="rounded-2xl border border-rose-400/40 bg-rose-500/[0.07] p-4">
              <div className="text-sm font-medium text-foreground">{t("inviteUxLab.permission_error_title")}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {t("inviteUxLab.permission_error_description")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function InviteUxLab() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(135deg,rgba(8,145,178,0.10),transparent_28%),linear-gradient(180deg,rgba(245,158,11,0.10),transparent_44%),var(--background)] shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="p-6 sm:p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-300">
              <FlaskConical className="h-3.5 w-3.5" />
              {t("inviteUxLab.badge_label")}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">{t("inviteUxLab.page_title")}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {t("inviteUxLab.page_description")}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
                {t("inviteUxLab.badge_tests_ux_invites")}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
                {t("inviteUxLab.badge_signup_invite_states")}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
                {t("inviteUxLab.badge_fixture_backed_preview")}
              </Badge>
            </div>
          </div>

          <aside className="border-t border-border/60 bg-background/70 p-6 lg:border-l lg:border-t-0">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t("inviteUxLab.covered_states")}
            </div>
            <div className="space-y-3">
              {[
                t("inviteUxLab.states_loading_access"),
                t("inviteUxLab.states_inline_auth"),
                t("inviteUxLab.states_accept_transitions"),
                t("inviteUxLab.states_pending_joined"),
                t("inviteUxLab.states_company_invite"),
              ].map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-border/70 bg-background/85 px-4 py-3 text-sm text-muted-foreground"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <LabSection
        eyebrow={t("inviteUxLab.lab_top_level_eyebrow")}
        title={t("inviteUxLab.lab_top_level_title")}
        description={t("inviteUxLab.lab_top_level_description")}
        accentClassName="bg-[linear-gradient(180deg,rgba(59,130,246,0.05),transparent_30%),var(--background)]"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            icon={<Loader2 className="h-4 w-4 animate-spin" />}
            title={t("inviteUxLab.status_loading_title")}
            body={t("inviteUxLab.status_loading_body")}
          />
          <StatusCard
            icon={<Clock3 className="h-4 w-4" />}
            title={t("inviteUxLab.status_checking_title")}
            body={t("inviteUxLab.status_checking_body")}
          />
          <StatusCard
            icon={<KeyRound className="h-4 w-4" />}
            title={t("inviteUxLab.status_invalid_token_title")}
            body={t("inviteUxLab.status_invalid_token_body")}
            tone="error"
          />
          <StatusCard
            icon={<Link2 className="h-4 w-4" />}
            title={t("inviteUxLab.status_not_available_title")}
            body={t("inviteUxLab.status_not_available_body")}
            tone="warn"
          />
          <StatusCard
            icon={<ShieldCheck className="h-4 w-4" />}
            title={t("inviteUxLab.status_bootstrap_complete_title")}
            body={t("inviteUxLab.status_bootstrap_complete_body")}
            tone="success"
          />
          <StatusCard
            icon={<ArrowRight className="h-4 w-4" />}
            title={t("inviteUxLab.status_auto_accept_title")}
            body={t("inviteUxLab.status_auto_accept_body")}
          />
          <StatusCard
            icon={<Users className="h-4 w-4" />}
            title={t("inviteUxLab.status_already_member_title")}
            body={t("inviteUxLab.status_already_member_body")}
          />
          <StatusCard
            icon={<UserPlus className="h-4 w-4" />}
            title={t("inviteUxLab.status_result_surfaces_title")}
            body={t("inviteUxLab.status_result_surfaces_body")}
            tone="success"
          />
        </div>
      </LabSection>

      <LabSection
        eyebrow={t("inviteUxLab.lab_invite_landing_eyebrow")}
        title={t("inviteUxLab.lab_invite_landing_title")}
        description={t("inviteUxLab.lab_invite_landing_description")}
        accentClassName="bg-[linear-gradient(180deg,rgba(234,179,8,0.06),transparent_28%),var(--background)]"
      >
        <div className="space-y-5">
          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title="Join Acme Robotics"
                description={t("inviteUxLab.inline_sign_up_description")}
                inviteMessage="Welcome aboard."
                requestedAccess="Operator"
              />
            }
            right={<InlineAuthPreview mode="sign_up" />}
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title="Join Acme Robotics"
                description={t("inviteUxLab.inline_sign_up_description")}
                inviteMessage="Welcome aboard."
                requestedAccess="Operator"
              />
            }
            right={
              <InlineAuthPreview
                mode="sign_in"
                feedback={{
                  tone: "info",
                  text: "An account already exists for jane@example.com. Sign in below to continue with this invite.",
                }}
              />
            }
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title="Join Acme Robotics"
                description={t("inviteUxLab.inline_sign_up_description")}
                inviteMessage="Welcome aboard."
                requestedAccess="Operator"
                signedInLabel="Jane Example"
              />
            }
            right={<AcceptInvitePreview autoAccept />}
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title="Join Acme Robotics"
                description={t("inviteUxLab.agent_description")}
                requestedAccess="Agent join request"
              />
            }
            right={<AgentRequestPreview />}
          />

          <InviteLandingShell
            left={
              <InviteSummaryPanel
                title="Join Acme Robotics"
                description={t("inviteUxLab.inline_sign_up_description")}
                requestedAccess="Operator"
                signedInLabel="Jane Example"
              />
            }
            right={<AcceptInvitePreview error={t("inviteUxLab.accept_error_member")} isCurrentMember />}
          />
        </div>
      </LabSection>

      <LabSection
        eyebrow={t("inviteUxLab.lab_result_eyebrow")}
        title={t("inviteUxLab.lab_result_title")}
        description={t("inviteUxLab.lab_result_description")}
        accentClassName="bg-[linear-gradient(180deg,rgba(16,185,129,0.06),transparent_30%),var(--background)]"
      >
        <div className="grid gap-5 xl:grid-cols-3">
          <InviteResultPreview
            title={t("inviteUxLab.result_request_title")}
            description={t("inviteUxLab.result_request_description")}
            claimSecret="pcp_claim_secret_demo"
            onboardingTextUrl="/api/invites/pcp_invite_test/onboarding.txt"
          />
          <InviteResultPreview
            title={t("inviteUxLab.result_joined_title")}
            description={t("inviteUxLab.result_joined_description")}
            joinedNow
          />
          <InviteResultPreview
            title={t("inviteUxLab.result_request_title")}
            description={t("inviteUxLab.result_ask_approve_description")}
          />
        </div>
      </LabSection>

      <LabSection
        eyebrow={t("inviteUxLab.lab_standalone_auth_eyebrow")}
        title={t("inviteUxLab.lab_standalone_auth_title")}
        description={t("inviteUxLab.lab_standalone_auth_description")}
        accentClassName="bg-[linear-gradient(180deg,rgba(168,85,247,0.06),transparent_28%),var(--background)]"
      >
        <div className="space-y-5">
          <AuthScreenPreview mode="sign_in" error="Invalid email or password" />
          <AuthScreenPreview mode="sign_up" />
        </div>
      </LabSection>

      <LabSection
        eyebrow={t("inviteUxLab.lab_company_settings_eyebrow")}
        title={t("inviteUxLab.lab_company_settings_title")}
        description={t("inviteUxLab.lab_company_settings_description")}
        accentClassName="bg-[linear-gradient(180deg,rgba(244,114,182,0.06),transparent_28%),var(--background)]"
      >
        <CompanyInvitesPreview />
      </LabSection>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import {
  fetchStdlibTraffic,
  fetchStdlibTrafficRange,
  getDefaultTrafficDateRange,
  getPresetDateRange,
  REPOSITORY_LABEL,
  TRAFFIC_WINDOWS,
} from "../utils/githubTraffic";

const numberFormatter = new Intl.NumberFormat("en-US");

function formatCount(value) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return numberFormatter.format(value);
}

function formatDateLabel(value) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Metric({ label, value, accentClass, description }) {
  return (
    <div className="rounded-[10px] border border-[#E0E0E0] bg-white px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#6C7378]">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${accentClass}`}>{formatCount(value)}</p>
      <p className="mt-1 text-xs text-[#6C7378]">{description}</p>
    </div>
  );
}

function LoadingCard({ label }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="border-b border-[#E0E0E0] bg-[#F5F7FA] px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#003087]">{label}</p>
            <div className="mt-2 h-3 w-28 animate-pulse rounded-full bg-slate-800" />
          </div>
          <div className="h-9 w-9 animate-pulse rounded-full bg-[#D8E7F5]" />
        </div>
      </div>
      <div className="grid gap-3 px-6 py-6 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-[10px] border border-[#E0E0E0] bg-white px-4 py-4">
            <div className="h-3 w-20 animate-pulse rounded-full bg-slate-300" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded-full bg-slate-300" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewCard({ windowData, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`overflow-hidden rounded-2xl border bg-white text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DD3FC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F7FA] active:translate-y-px active:scale-[0.995] ${
        isSelected
          ? "border-[#009CDE] shadow-[0_16px_32px_rgba(0,156,222,0.18)]"
          : "border-[#E0E0E0] shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:border-[#009CDE]/40 hover:shadow-[0_14px_28px_rgba(15,23,42,0.12)]"
      }`}
    >
      <div className="border-b border-[#E0E0E0] bg-[#F5F7FA] px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#6C7378]">Window</p>
            <h3 className="mt-2 text-xl font-semibold text-[#003087]">Past {windowData.label}</h3>
            <p className="mt-1 text-sm text-[#2C2E2F]">Activity since {windowData.since}</p>
          </div>
          <div className="rounded-full border border-[#E0E0E0] bg-white px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-[#6C7378]">
            stdlib
          </div>
        </div>
      </div>

      <div className="grid gap-3 px-6 py-6 md:grid-cols-3">
        <Metric
          label="Contributors"
          value={windowData.contributors}
          accentClass="text-[#003087]"
          description="Unique commit contributors"
        />
        <Metric
          label="Pull Requests"
          value={windowData.pullRequests}
          accentClass="text-[#009CDE]"
          description="PRs opened in the window"
        />
        <Metric
          label="Issues"
          value={windowData.issues}
          accentClass="text-[#2C2E2F]"
          description="Issues opened in the window"
        />
      </div>
    </button>
  );
}

function ContributorCard({ contributor }) {
  return (
    <article className="rounded-xl border border-[#E0E0E0] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="flex items-start gap-4">
        <img
          src={contributor.avatarUrl}
          alt={contributor.name}
          className="h-14 w-14 rounded-xl border border-[#E0E0E0] bg-[#F5F7FA] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-semibold text-[#003087]">{contributor.name}</h4>
            <span className="rounded-full border border-[#E0E0E0] px-2 py-0.5 text-xs font-mono text-[#6C7378]">
              @{contributor.login}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#6C7378]">
            {contributor.company ? <span>{contributor.company}</span> : null}
            {contributor.location ? <span>{contributor.location}</span> : null}
            {contributor.followers !== null ? <span>{formatCount(contributor.followers)} followers</span> : null}
            {contributor.publicRepos !== null ? <span>{formatCount(contributor.publicRepos)} public repos</span> : null}
            {contributor.repositoryContributions !== null ? <span>{formatCount(contributor.repositoryContributions)} lifetime repo contributions</span> : null}
          </div>
          {contributor.bio ? <p className="mt-3 text-sm leading-6 text-[#2C2E2F]">{contributor.bio}</p> : null}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Metric label="Commits" value={contributor.commits} accentClass="text-[#003087]" description="In selected range" />
        <Metric label="Open PRs" value={contributor.openPRs} accentClass="text-[#2C2E2F]" description="Currently open pull requests" />
        <Metric label="Merged PRs" value={contributor.mergedPRs} accentClass="text-[#2C2E2F]" description="Successfully merged pull requests" />
        <Metric label="Active Weeks" value={contributor.activeWeeks} accentClass="text-[#2C2E2F]" description={contributor.lastActiveWeek ? `Last active ${contributor.lastActiveWeek}` : "No active week"} />
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {contributor.profileUrl ? (
          <a
            href={contributor.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#E0E0E0] px-3 py-1.5 text-[#003087] transition-colors hover:border-[#009CDE]/40 hover:text-[#009CDE]"
          >
            View GitHub Profile
          </a>
        ) : null}
        {contributor.blog ? (
          <a
            href={contributor.blog}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#E0E0E0] px-3 py-1.5 text-[#003087] transition-colors hover:border-[#009CDE]/40 hover:text-[#009CDE]"
          >
            Website
          </a>
        ) : null}
        {contributor.twitterUsername ? (
          <a
            href={`https://x.com/${contributor.twitterUsername}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#E0E0E0] px-3 py-1.5 text-[#003087] transition-colors hover:border-[#009CDE]/40 hover:text-[#009CDE]"
          >
            @{contributor.twitterUsername}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function TrafficDashboard() {
  const defaultRange = getDefaultTrafficDateRange();
  const [overview, setOverview] = useState(null);
  const [overviewStatus, setOverviewStatus] = useState("loading");
  const [overviewError, setOverviewError] = useState("");
  const [details, setDetails] = useState(null);
  const [detailsStatus, setDetailsStatus] = useState("loading");
  const [detailsError, setDetailsError] = useState("");
  const [draftRange, setDraftRange] = useState(defaultRange);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const [selectedPreset, setSelectedPreset] = useState("1m");
  const [filterError, setFilterError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOverview() {
      setOverviewStatus("loading");
      setOverviewError("");

      try {
        const data = await fetchStdlibTraffic(controller.signal);
        setOverview(data);
        setOverviewStatus("ready");
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        setOverviewStatus("error");
        setOverviewError(loadError.message || "Unable to load GitHub traffic right now.");
      }
    }

    loadOverview();

    return () => controller.abort();
  }, [reloadKey]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRangeDetails() {
      setDetailsStatus("loading");
      setDetailsError("");

      try {
        const data = await fetchStdlibTrafficRange(appliedRange, controller.signal);
        setDetails(data);
        setDetailsStatus("ready");
      } catch (loadError) {
        if (loadError.name === "AbortError") {
          return;
        }

        setDetailsStatus("error");
        setDetailsError(loadError.message || "Unable to load contributor details right now.");
      }
    }

    loadRangeDetails();

    return () => controller.abort();
  }, [appliedRange, reloadKey]);

  function handlePresetSelect(windowConfig) {
    const nextRange = getPresetDateRange(windowConfig.days);
    setSelectedPreset(windowConfig.id);
    setFilterError("");
    setDraftRange(nextRange);
    setAppliedRange(nextRange);
  }

  function handleApplyDateFilter() {
    if (!draftRange.startDate || !draftRange.endDate) {
      setFilterError("Choose both a start date and an end date.");
      return;
    }

    if (draftRange.startDate > draftRange.endDate) {
      setFilterError("The start date must be before the end date.");
      return;
    }

    setSelectedPreset("custom");
    setFilterError("");
    setAppliedRange(draftRange);
  }

  return (
    <section className="rounded-xl border border-[#E0E0E0] bg-white px-6 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:px-8 sm:py-8">
      <div>
        <div className="flex flex-col gap-4 border-b border-[#E0E0E0] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#6C7378]">Repository Traffic</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#003087] sm:text-3xl">GitHub activity explorer for {REPOSITORY_LABEL}</h2>
            <p className="mt-3 text-sm leading-7 text-[#2C2E2F] sm:text-[15px]">
              Open the stdlib traffic view to inspect rolling activity windows, apply a custom date range, and
              browse active contributors with profile details, commit totals, additions, deletions, and last
              active week.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(details?.updatedAt || overview?.updatedAt) ? (
              <div className="rounded-full border border-[#E0E0E0] bg-white px-4 py-2 text-xs text-[#6C7378]">
                Updated {new Date(details?.updatedAt || overview?.updatedAt).toLocaleString()}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="rounded-full bg-[#009CDE] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(0,156,222,0.2)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#007FB2] hover:shadow-[0_16px_30px_rgba(0,127,178,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DD3FC] focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px active:scale-[0.99]"
            >
              Refresh Data
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#E0E0E0] bg-[#F5F7FA] p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#6C7378]">Date Filter</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {TRAFFIC_WINDOWS.map((windowConfig) => (
                  <button
                    key={windowConfig.id}
                    type="button"
                    onClick={() => handlePresetSelect(windowConfig)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DD3FC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F7FA] active:translate-y-px active:scale-[0.99] ${
                      selectedPreset === windowConfig.id
                        ? "border-[#009CDE] bg-[#009CDE] text-white shadow-[0_12px_24px_rgba(0,156,222,0.2)]"
                        : "border-[#E0E0E0] bg-white text-[#6C7378] shadow-[0_4px_10px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-[#009CDE]/40 hover:shadow-[0_12px_20px_rgba(15,23,42,0.1)]"
                    }`}
                  >
                    {windowConfig.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] xl:min-w-[420px]">
              <label className="text-sm text-[#6C7378]">
                <span className="mb-2 block text-xs font-mono uppercase tracking-[0.18em] text-[#6C7378]">Start date</span>
                <input
                  type="date"
                  value={draftRange.startDate}
                  onChange={(event) => setDraftRange((current) => ({ ...current, startDate: event.target.value }))}
                  className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2C2E2F] outline-none transition-colors focus:border-[#009CDE]"
                />
              </label>
              <label className="text-sm text-[#6C7378]">
                <span className="mb-2 block text-xs font-mono uppercase tracking-[0.18em] text-[#6C7378]">End date</span>
                <input
                  type="date"
                  value={draftRange.endDate}
                  onChange={(event) => setDraftRange((current) => ({ ...current, endDate: event.target.value }))}
                  className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2C2E2F] outline-none transition-colors focus:border-[#009CDE]"
                />
              </label>
              <button
                type="button"
                onClick={handleApplyDateFilter}
                className="rounded-full bg-[#009CDE] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(0,156,222,0.2)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#007FB2] hover:shadow-[0_16px_30px_rgba(0,127,178,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DD3FC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F7FA] active:translate-y-px active:scale-[0.99]"
              >
                Apply
              </button>
            </div>
          </div>
          {filterError ? <p className="mt-3 text-sm text-red-700">{filterError}</p> : null}
          <p className="mt-4 text-xs leading-6 text-[#6C7378]">
            Selected range: {formatDateLabel(appliedRange.startDate)} to {formatDateLabel(appliedRange.endDate)}
          </p>
        </div>

        {overviewStatus === "loading" ? (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <LoadingCard label="1 week" />
            <LoadingCard label="1 month" />
            <LoadingCard label="3 months" />
            <LoadingCard label="6 months" />
          </div>
        ) : null}

        {overviewStatus === "error" ? (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-6">
            <p className="text-sm font-semibold text-red-700">Unable to load GitHub traffic</p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700">{overviewError}</p>
            <p className="mt-3 text-xs leading-6 text-[#6C7378]">
              The dashboard uses the public GitHub API. If you hit rate limits, add VITE_GITHUB_TOKEN to your
              local environment and refresh the page.
            </p>
          </div>
        ) : null}

        {overviewStatus === "ready" ? (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {overview.windows.map((windowData) => (
              <OverviewCard
                key={windowData.id}
                windowData={windowData}
                isSelected={selectedPreset === windowData.id}
                onSelect={() => handlePresetSelect(windowData)}
              />
            ))}
          </div>
        ) : null}

        {detailsStatus === "loading" ? (
          <div className="mt-6 rounded-xl border border-[#E0E0E0] bg-white px-6 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <p className="text-sm font-semibold text-[#003087]">Loading contributor details</p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="rounded-[10px] border border-[#E0E0E0] bg-white px-4 py-4">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-slate-300" />
                  <div className="mt-3 h-8 w-14 animate-pulse rounded-full bg-slate-300" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {detailsStatus === "error" ? (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-6">
            <p className="text-sm font-semibold text-red-700">Unable to load contributor details</p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-700">{detailsError}</p>
          </div>
        ) : null}

        {detailsStatus === "ready" ? (
          <div className="mt-6 space-y-6">
            <div className="rounded-xl border border-[#E0E0E0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#6C7378]">Selected Window</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#003087]">
                    {formatDateLabel(details.range.startDate)} to {formatDateLabel(details.range.endDate)}
                  </h3>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-[#2C2E2F]">
                  Contributors are derived from GitHub contributor stats, while issues and pull requests count
                  items opened inside this date range.
                </p>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Metric label="Contributors" value={details.summary.contributors} accentClass="text-[#003087]" description="Commit contributors active in range" />
                <Metric label="Pull Requests" value={details.summary.pullRequests} accentClass="text-[#009CDE]" description="PRs opened in range" />
                <Metric label="Issues" value={details.summary.issues} accentClass="text-[#2C2E2F]" description="Issues opened in range" />
              </div>
              <p className="mt-4 text-xs leading-6 text-[#6C7378]">
                If GitHub search rate limits are hit, contributor details still load and issue or PR counts may temporarily show N/A.
              </p>
            </div>

            <div>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#6C7378]">Contributors</p>
                  <h3 className="mt-2 text-xl font-semibold text-[#003087]">Active contributors in the selected range</h3>
                </div>
                <p className="text-sm text-[#2C2E2F]">{formatCount(details.contributors.length)} people matched this filter.</p>
              </div>

              {details.contributors.length ? (
                <div className="grid gap-4">
                  {details.contributors.map((contributor) => (
                    <ContributorCard key={contributor.login} contributor={contributor} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-[#E0E0E0] bg-white px-6 py-6 text-sm text-[#2C2E2F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  No contributor activity was found for this date range.
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default TrafficDashboard;
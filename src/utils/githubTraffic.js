import isNaNNumber from "@stdlib/math/base/assert/is-nan";

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_API_VERSION = "2022-11-28";
const OWNER = "stdlib-js";
const REPO = "stdlib";
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const contributorProfileCache = new Map();
const githubResponseCache = new Map();

export const TRAFFIC_WINDOWS = [
  { id: "1w", label: "1 week", days: 7 },
  { id: "1m", label: "1 month", days: 30 },
  { id: "3m", label: "3 months", days: 90 },
  { id: "6m", label: "6 months", days: 180 },
];

export const REPOSITORY_LABEL = `${OWNER}/${REPO}`;

function getRequestHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  };
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(resolve, ms);

    if (!signal) {
      return;
    }

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeoutId);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

async function getErrorMessage(response) {
  try {
    const data = await response.json();

    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    return `${response.status} ${response.statusText}`;
  }

  return `${response.status} ${response.statusText}`;
}

async function fetchGitHubJson(path, signal) {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: getRequestHeaders(),
    signal,
  });

  if (response.status === 202) {
    return { processing: true };
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
}

function fetchGitHubJsonCached(path) {
  if (!githubResponseCache.has(path)) {
    const request = fetchGitHubJson(path).catch((error) => {
      githubResponseCache.delete(path);
      throw error;
    });

    githubResponseCache.set(path, request);
  }

  return githubResponseCache.get(path);
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function getWindowStart(days) {
  return new Date(Date.now() - days * DAY_MS);
}

function getToday() {
  return new Date();
}

function parseDateInput(value, endOfDay = false) {
  const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);

  if (isNaNNumber(date.getTime())) {
    throw new Error("Please provide a valid date range.");
  }

  return date;
}

export function getDefaultTrafficDateRange() {
  const endDate = getToday();
  const startDate = new Date(endDate.getTime() - 30 * DAY_MS);

  return {
    startDate: toIsoDate(startDate),
    endDate: toIsoDate(endDate),
  };
}

export function getPresetDateRange(days) {
  return {
    startDate: toIsoDate(getWindowStart(days)),
    endDate: toIsoDate(getToday()),
  };
}

function normalizeDateRange(dateRange) {
  const start = parseDateInput(dateRange.startDate);
  const end = parseDateInput(dateRange.endDate, true);

  if (start.getTime() > end.getTime()) {
    throw new Error("The start date must be before the end date.");
  }

  return {
    start,
    end,
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
  };
}

function countActiveContributors(contributorStats, startDate) {
  const cutoff = startDate.getTime();

  return contributorStats.reduce((total, contributor) => {
    const isActive = contributor.weeks?.some((week) => {
      const weekStart = week.w * 1000;
      const weekEnd = weekStart + WEEK_MS;

      return week.c > 0 && weekEnd > cutoff;
    });

    return total + Number(Boolean(isActive));
  }, 0);
}

async function fetchContributorStats(signal) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const data = await fetchGitHubJsonCached(`/repos/${OWNER}/${REPO}/stats/contributors`, signal);

    if (!data.processing) {
      return data;
    }

    githubResponseCache.delete(`/repos/${OWNER}/${REPO}/stats/contributors`);

    await delay(900 * (attempt + 1), signal);
  }

  throw new Error("GitHub is still preparing contributor stats. Try again in a few seconds.");
}

async function fetchSearchCount(type, startDate, signal) {
  const excludeDraft = type === "pr" ? "-is:draft" : "";
  const query = [
    `repo:${OWNER}/${REPO}`,
    `is:${type}`,
    `created:>=${toIsoDate(startDate)}`,
    excludeDraft,
  ]
    .filter(Boolean)
    .join(" ");
  const data = await fetchGitHubJsonCached(`/search/issues?q=${encodeURIComponent(query)}&per_page=1`, signal);

  return data.total_count;
}

async function fetchSearchCountInRange(type, range, signal) {
  const excludeDraft = type === "pr" ? "-is:draft" : "";
  const query = [
    `repo:${OWNER}/${REPO}`,
    `is:${type}`,
    `created:${range.startDate}..${range.endDate}`,
    excludeDraft,
  ]
    .filter(Boolean)
    .join(" ");
  const data = await fetchGitHubJsonCached(`/search/issues?q=${encodeURIComponent(query)}&per_page=1`, signal);

  return data.total_count;
}

async function fetchRepoContributorsPage(page, signal) {
  return fetchGitHubJsonCached(`/repos/${OWNER}/${REPO}/contributors?per_page=100&page=${page}`, signal);
}

async function fetchRepoContributors(signal) {
  const contributors = [];

  for (let page = 1; page <= 10; page += 1) {
    const pageData = await fetchRepoContributorsPage(page, signal);

    if (!Array.isArray(pageData) || pageData.length === 0) {
      break;
    }

    contributors.push(...pageData);

    if (pageData.length < 100) {
      break;
    }
  }

  return contributors;
}

function calculateContributorActivity(contributorStats, range) {
  const rangeStart = range.start.getTime();
  const rangeEnd = range.end.getTime();

  return contributorStats
    .map((contributor) => {
      const totals = contributor.weeks?.reduce(
        (summary, week) => {
          const weekStart = week.w * 1000;
          const weekEnd = weekStart + WEEK_MS - 1;
          const overlapsRange = week.c > 0 && weekEnd >= rangeStart && weekStart <= rangeEnd;

          if (!overlapsRange) {
            return summary;
          }

          return {
            commits: summary.commits + week.c,
            activeWeeks: summary.activeWeeks + 1,
            lastActiveWeek: Math.max(summary.lastActiveWeek, weekStart),
          };
        },
        {
          commits: 0,
          activeWeeks: 0,
          lastActiveWeek: 0,
        }
      ) ?? {
        commits: 0,
        activeWeeks: 0,
        lastActiveWeek: 0,
      };

      return {
        login: contributor.author?.login || "unknown",
        author: contributor.author,
        commits: totals.commits,
        openPRs: null,
        mergedPRs: null,
        activeWeeks: totals.activeWeeks,
        lastActiveWeek: totals.lastActiveWeek ? toIsoDate(new Date(totals.lastActiveWeek)) : null,
      };
    })
    .filter((contributor) => contributor.commits > 0)
    .sort((left, right) => right.commits - left.commits);
}

async function fetchContributorProfile(login, signal) {
  if (!login || login === "unknown") {
    return null;
  }

  if (!contributorProfileCache.has(login)) {
    contributorProfileCache.set(login, fetchGitHubJsonCached(`/users/${login}`, signal).catch(() => null));
  }

  return contributorProfileCache.get(login);
}

async function fetchContributorPRCounts(login, signal) {
  if (!login || login === "unknown") {
    return { openPRs: null, mergedPRs: null };
  }

  try {
    const openQuery = `is:pr author:${login} repo:${OWNER}/${REPO} is:open -is:draft`;
    const mergedQuery = `is:pr author:${login} repo:${OWNER}/${REPO} is:merged`;

    const [openResult, mergedResult] = await Promise.all([
      fetchGitHubJsonCached(`/search/issues?q=${encodeURIComponent(openQuery)}&per_page=1`, signal).catch(
        () => ({ total_count: null })
      ),
      fetchGitHubJsonCached(`/search/issues?q=${encodeURIComponent(mergedQuery)}&per_page=1`, signal).catch(
        () => ({ total_count: null })
      ),
    ]);

    return {
      openPRs: openResult?.total_count ?? null,
      mergedPRs: mergedResult?.total_count ?? null,
    };
  } catch {
    return { openPRs: null, mergedPRs: null };
  }
}

function mergeContributorBaseInfo(contributors, repoContributors) {
  const repoContributorMap = new Map(
    repoContributors.map((contributor) => [contributor.login, contributor])
  );

  return contributors.map((contributor) => {
    const repoContributor = repoContributorMap.get(contributor.login);

    return {
      ...contributor,
      name: contributor.author?.login || contributor.login,
      avatarUrl: repoContributor?.avatar_url || contributor.author?.avatar_url || "",
      profileUrl: repoContributor?.html_url || contributor.author?.html_url || "",
      bio: "",
      company: "",
      location: "",
      blog: "",
      followers: null,
      publicRepos: null,
      twitterUsername: "",
      repositoryContributions: repoContributor?.contributions ?? null,
      openPRs: contributor.openPRs ?? null,
      mergedPRs: contributor.mergedPRs ?? null,
    };
  });
}

async function hydrateContributors(contributors, signal) {
  const baseContributors = mergeContributorBaseInfo(contributors, await fetchRepoContributors(signal));
  const detailedContributors = baseContributors.slice(0, 12);
  const detailProfiles = await Promise.all(
    detailedContributors.map((contributor) => fetchContributorProfile(contributor.login, signal))
  );
  const prCounts = await Promise.all(
    detailedContributors.map((contributor) => fetchContributorPRCounts(contributor.login, signal))
  );

  const detailedMap = new Map(
    detailedContributors.map((contributor, index) => [contributor.login, detailProfiles[index]])
  );
  const prCountsMap = new Map(
    detailedContributors.map((contributor, index) => [contributor.login, prCounts[index]])
  );

  return baseContributors.map((contributor) => {
    const profile = detailedMap.get(contributor.login);
    const prData = prCountsMap.get(contributor.login) || { openPRs: null, mergedPRs: null };

    return {
      ...contributor,
      name: profile?.name || contributor.author?.login || contributor.login,
      avatarUrl: profile?.avatar_url || contributor.author?.avatar_url || "",
      profileUrl: profile?.html_url || contributor.author?.html_url || "",
      bio: profile?.bio || "",
      company: profile?.company || "",
      location: profile?.location || "",
      blog: profile?.blog || "",
      followers: profile?.followers ?? null,
      publicRepos: profile?.public_repos ?? null,
      twitterUsername: profile?.twitter_username || "",
      openPRs: prData.openPRs,
      mergedPRs: prData.mergedPRs,
    };
  });
}

async function safelyResolve(promise) {
  try {
    return await promise;
  } catch {
    return null;
  }
}

export async function fetchStdlibTraffic(signal) {
  const contributorStats = await fetchContributorStats(signal);

  const windows = await Promise.all(
    TRAFFIC_WINDOWS.map(async (windowConfig) => {
      const startDate = getWindowStart(windowConfig.days);
      const [pullRequests, issues] = await Promise.all([
        fetchSearchCount("pr", startDate, signal),
        fetchSearchCount("issue", startDate, signal),
      ]);

      return {
        ...windowConfig,
        since: toIsoDate(startDate),
        contributors: countActiveContributors(contributorStats, startDate),
        pullRequests,
        issues,
      };
    })
  );

  return {
    repo: REPOSITORY_LABEL,
    updatedAt: new Date().toISOString(),
    windows,
  };
}

export async function fetchStdlibTrafficRange(dateRange, signal) {
  const normalizedRange = normalizeDateRange(dateRange);
  const contributorStats = await fetchContributorStats(signal);
  const contributorActivity = calculateContributorActivity(contributorStats, normalizedRange);
  const [pullRequests, issues, contributors] = await Promise.all([
    safelyResolve(fetchSearchCountInRange("pr", normalizedRange, signal)),
    safelyResolve(fetchSearchCountInRange("issue", normalizedRange, signal)),
    hydrateContributors(contributorActivity, signal),
  ]);

  return {
    repo: REPOSITORY_LABEL,
    updatedAt: new Date().toISOString(),
    range: normalizedRange,
    summary: {
      contributors: contributors.length,
      pullRequests,
      issues,
    },
    contributors,
  };
}
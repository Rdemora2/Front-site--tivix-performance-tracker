const API_BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
}${import.meta.env.VITE_API_PREFIX || "/api/v1"}`;

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

export const teamsAPI = {
  getAll: () => apiRequest("/teams"),

  getById: (id) => apiRequest(`/teams/${id}`),

  create: (teamData) =>
    apiRequest("/teams", {
      method: "POST",
      body: JSON.stringify(teamData),
    }),

  update: (id, teamData) =>
    apiRequest(`/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(teamData),
    }),

  delete: (id) =>
    apiRequest(`/teams/${id}`, {
      method: "DELETE",
    }),

  getDevelopers: (teamId) => apiRequest(`/teams/${teamId}/developers`),
};

export const developersAPI = {
  getAll: (includeArchived = false) =>
    apiRequest(`/developers?includeArchived=${includeArchived}`),

  getArchived: () => apiRequest("/developers/archived"),

  getById: (id) => apiRequest(`/developers/${id}`),

  create: (developerData) =>
    apiRequest("/developers", {
      method: "POST",
      body: JSON.stringify(developerData),
    }),

  update: (id, developerData) =>
    apiRequest(`/developers/${id}`, {
      method: "PUT",
      body: JSON.stringify(developerData),
    }),

  archive: (id, archive = true) =>
    apiRequest(`/developers/${id}/archive`, {
      method: "PUT",
      body: JSON.stringify({ archive }),
    }),

  getReports: (developerId) => apiRequest(`/developers/${developerId}/reports`),
};

export const performanceReportsAPI = {
  getAll: () => apiRequest("/performance-reports"),

  getById: (id) => apiRequest(`/performance-reports/${id}`),

  create: (reportData) =>
    apiRequest("/performance-reports", {
      method: "POST",
      body: JSON.stringify(reportData),
    }),

  getAvailableMonths: () => apiRequest("/performance-reports/months"),

  getByMonth: (month) => apiRequest(`/performance-reports/month/${month}`),

  getStats: () => apiRequest("/performance-reports/stats"),
};

export default {
  teams: teamsAPI,
  developers: developersAPI,
  performanceReports: performanceReportsAPI,
};

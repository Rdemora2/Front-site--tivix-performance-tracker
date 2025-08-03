import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createDeveloper } from "../types";

const useAppStore = create(
  persist(
    (set, get) => ({
      developers: [
        createDeveloper("1", "João Silva", "Frontend Developer", 8.5),
        createDeveloper("2", "Maria Santos", "Backend Developer", 9.2),
        createDeveloper("3", "Pedro Costa", "Full Stack Developer", 7.8),
      ],
      archivedDevelopers: [],
      teams: [],
      performanceReports: [],
      darkMode: true,

      addDeveloper: (developer) =>
        set((state) => ({
          developers: [...state.developers, developer],
        })),

      updateDeveloper: (id, updates) =>
        set((state) => ({
          developers: state.developers.map((dev) =>
            dev.id === id ? { ...dev, ...updates } : dev
          ),
        })),

      archiveDeveloper: (id) =>
        set((state) => {
          const developerToArchive = state.developers.find(
            (dev) => dev.id === id
          );
          if (!developerToArchive) return state;

          return {
            developers: state.developers.filter((dev) => dev.id !== id),
            archivedDevelopers: [
              ...state.archivedDevelopers,
              { ...developerToArchive, archivedAt: new Date().toISOString() },
            ],
          };
        }),

      restoreDeveloper: (id) =>
        set((state) => {
          const developerToRestore = state.archivedDevelopers.find(
            (dev) => dev.id === id
          );
          if (!developerToRestore) return state;

          const { ...restoredDeveloper } = developerToRestore;

          return {
            developers: [...state.developers, restoredDeveloper],
            archivedDevelopers: state.archivedDevelopers.filter(
              (dev) => dev.id !== id
            ),
          };
        }),

      // Team actions
      addTeam: (team) =>
        set((state) => ({
          teams: [...state.teams, team],
        })),

      updateTeam: (id, updates) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === id ? { ...team, ...updates } : team
          ),
        })),

      removeTeam: (id) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id),
          // Remove team association from developers
          developers: state.developers.map((dev) =>
            dev.teamId === id ? { ...dev, teamId: null } : dev
          ),
        })),

      getDevelopersByTeam: (teamId) => {
        const state = get();
        return state.developers.filter((dev) => dev.teamId === teamId);
      },

      addPerformanceReport: (report) =>
        set((state) => {
          const newReports = [...state.performanceReports, report];

          // Update developer's latest performance score
          const updatedDevelopers = state.developers.map((dev) =>
            dev.id === report.developerId
              ? { ...dev, latestPerformanceScore: report.weightedAverageScore }
              : dev
          );

          return {
            performanceReports: newReports,
            developers: updatedDevelopers,
          };
        }),

      getReportsByDeveloper: (developerId) => {
        const state = get();
        return state.performanceReports
          .filter((report) => report.developerId === developerId)
          .sort((a, b) => new Date(b.month) - new Date(a.month));
      },

      getLatestReport: (developerId) => {
        const reports = get().getReportsByDeveloper(developerId);
        return reports[0] || null;
      },

      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),

      setDarkMode: (darkMode) =>
        set(() => ({
          darkMode,
        })),
    }),
    {
      name: "tivix-performance-tracker-storage",
      partialize: (state) => ({
        developers: state.developers,
        archivedDevelopers: state.archivedDevelopers, // Include archived developers in persistence
        teams: state.teams, // Include teams in persistence
        performanceReports: state.performanceReports,
        darkMode: state.darkMode,
      }),
    }
  )
);

export default useAppStore;

import { create } from 'zustand';

export type SidebarItemType = "home" | "chats" | "meets" | "calls" | "files" | "settings" | "profile";

export interface GlobalState {
  // Sidebar state
  sidebar: {
    activeTab: SidebarItemType;
  };
  // Sidebar actions
  setSidebarTab: (tab: SidebarItemType) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  sidebar: {
    activeTab: "home",
  },
  setSidebarTab: (tab) => set((state) => ({
    sidebar: {
      ...state.sidebar,
      activeTab: tab,
    }
  })),
})); 
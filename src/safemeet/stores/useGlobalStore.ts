import { create } from 'zustand';

export type SidebarItemType = "home" | "chats" | "meets" | "calls" | "files";

export interface GlobalState {
  // Sidebar state
  sidebar: {
    activeTab: SidebarItemType;
  };
  // Sidebar actions
  setSidebarTab: (tab: SidebarItemType) => void;
  
  // Thêm các state và actions khác trong tương lai
  // example: {
  //   user: { ... },
  //   setUser: () => void,
  //   theme: { ... },
  //   setTheme: () => void,
  // }
}

export const useGlobalStore = create<GlobalState>((set) => ({
  sidebar: {
    activeTab: "chats",
  },
  setSidebarTab: (tab) => set((state) => ({
    sidebar: {
      ...state.sidebar,
      activeTab: tab,
    }
  })),
})); 
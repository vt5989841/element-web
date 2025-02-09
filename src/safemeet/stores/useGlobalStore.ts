import { create } from 'zustand';

export type SidebarItemType = "home" | "chats" | "meets" | "calls" | "files" | "settings" | "profile";

export interface GlobalState {
  // Sidebar state
  sidebar: {
    activeTab: SidebarItemType;
  };
  // Sidebar actions
  setSidebarTab: (tab: SidebarItemType) => void;
  
  // Thêm settings state
  settings: {
    isOpen: boolean;
  };
  setSettingsOpen: (isOpen: boolean) => void;
  
  // Thêm profile state 
  profile: {
    isOpen: boolean;
  };
  setProfileOpen: (isOpen: boolean) => void;
  
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
    activeTab: "home",
  },
  setSidebarTab: (tab) => set((state) => ({
    sidebar: {
      ...state.sidebar,
      activeTab: tab,
    }
  })),
  
  settings: {
    isOpen: false,
  },
  setSettingsOpen: (isOpen) => set((state) => ({
    settings: { ...state.settings, isOpen },
  })),
  
  profile: {
    isOpen: false, 
  },
  setProfileOpen: (isOpen) => set((state) => ({
    profile: { ...state.profile, isOpen },
  })),
})); 
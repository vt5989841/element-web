import {
  defaultConfig,
  createSystem,
  defineConfig,
  defineSemanticTokens,
  defineTokens,
  defineRecipe,
} from "@chakra-ui/react";

// Define base color tokens
const tokens = defineTokens({
  colors: {
    brand: {
      50: { value: "{colors.blue.50}" },
      100: { value: "{colors.blue.100}" },
      200: { value: "{colors.blue.200}" },
      300: { value: "{colors.blue.300}" },
      400: { value: "{colors.blue.400}" },
      500: { value: "{colors.blue.500}" },
      600: { value: "{colors.blue.600}" },
      700: { value: "{colors.blue.700}" },
      800: { value: "{colors.blue.800}" },
      900: { value: "{colors.blue.900}" },
    },
  },
});

// Define semantic tokens
const semanticTokens = defineSemanticTokens({
  colors: {
    "bg.surface": {
      value: { 
        base: "{colors.white}",
        _dark: "{colors.gray.800}" 
      }
    },
    "bg.subtle": {
      value: { 
        base: "{colors.gray.100}",
        _dark: "{colors.gray.700}" 
      }
    },
    "text.primary": {
      value: { 
        base: "{colors.gray.900}",
        _dark: "{colors.white}" 
      }
    },
    "border.default": {
      value: { 
        base: "{colors.gray.200}",
        _dark: "{colors.gray.700}" 
      }
    },
  },
});

// Define recipes cho từng component
const sidebarRecipe = defineRecipe({
  className: "chakra-sidebar",
  base: {
    bg: "bg.surface",
    borderColor: "border.default",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100vh",
    py: 4,
    width: "fit-content",
    minWidth: "56px"
  },
  variants: {
    collapsed: {
      true: {
        width: "72px",
      },
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

const buttonRecipe = defineRecipe({
  className: "chakra-button",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  variants: {
    variant: {
      ghost: {
        bg: "transparent",
        color: "text.primary",
        _hover: {
          bg: "bg.subtle",
        },
      },
      solid: {
        bg: "brand.solid",
        color: "brand.contrast",
        _hover: {
          bg: "brand.emphasized",
        },
      },
    },
    size: {
      sm: {
        px: 3,
        py: 2,
        fontSize: "sm",
      },
      md: {
        px: 4,
        py: 2,
        fontSize: "md",
      },
      "32x32": {
        h: "32px",
        w: "32px",
        p: 2,
        fontSize: "sm",
      },
      "50x50": {
        h: "50px",
        w: "50px",
        p: 2,
        fontSize: "md",
      }
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

// Combine tất cả recipes
const recipes = {
  sidebar: sidebarRecipe,
  button: buttonRecipe,
};

const themeConfig = defineConfig({
  preflight: true,
  cssVarsPrefix: "chakra",
  cssVarsRoot: ":host, :root",
  theme: {
    tokens,
    semanticTokens,
    recipes,
  },
});

export const system = createSystem(defaultConfig, themeConfig);
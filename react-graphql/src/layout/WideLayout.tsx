"use client";

import Auth0ProviderWithNavigate from "@/components/authentication/Auth0ProviderWithNavigate";
import { Container, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "inherit",
  },
});

const WideLayout = (props: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <Auth0ProviderWithNavigate>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {props.children}
      </Container>
      </Auth0ProviderWithNavigate>
    </ThemeProvider>
  );
};

export default WideLayout;
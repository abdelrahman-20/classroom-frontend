import "./App.css";
import { GitHubBanner, Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
// import { dataProvider } from "./providers/data";
import Dashboard from "./pages/Dashboard";
import { Layout } from "./components/refine-ui/layout/layout";
import { BookOpen, Home } from "lucide-react";
import SubjectsList from "./pages/subjects/SubjectsList";
import SubjectsCreate from "./pages/subjects/SubjectsCreate";
import { dataProvider } from "./providers/data";

function App() {
  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ThemeProvider>
          {/* <DevtoolsProvider> */}
          <Refine
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider()}
            routerProvider={routerProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "ajTWWG-cR3QqE-h1jJNa",
            }}
            resources={[
              // Home (Dashboard)
              {
                name: "dashboard",
                list: "/",
                meta: { label: "Home", icon: <Home /> },
              },
              // Subjects
              {
                name: "subjects",
                list: "/subjects",
                create: "/subjects/create",
                meta: { label: "Subjects", icon: <BookOpen /> },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route index path="/" element={<Dashboard />} />
                <Route path="subjects">
                  <Route index element={<SubjectsList />} />
                  <Route path="create" element={<SubjectsCreate />} />
                </Route>
              </Route>
            </Routes>
            <Toaster />
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          {/* <DevtoolsPanel /> */}
          {/* </DevtoolsProvider> */}
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

import "./App.css";
import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { Layout } from "./components/refine-ui/layout/layout";
import { BookOpen, GraduationCap, Home, School } from "lucide-react";

import dataProvider from "./providers/data";
import Dashboard from "./pages/Dashboard";
import SubjectsList from "./pages/subjects/List";
import SubjectCreate from "./pages/subjects/Create";
import ClassesList from "./pages/classRooms/List";
import ClassCreate from "./pages/classRooms/Create";

function App() {
  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "uhZgOj-GaJYG8-6vTq3I",
                title: {
                  text: "Classroom",
                  icon: <GraduationCap />,
                },
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: { label: "Dashboard", icon: <Home /> },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  meta: { label: "Subjects", icon: <BookOpen /> },
                },

                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  meta: { label: "Classes", icon: <School /> },
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
                  <Route index element={<Dashboard />} />
                  <Route path="subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectCreate />} />
                  </Route>
                  <Route path="classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassCreate />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

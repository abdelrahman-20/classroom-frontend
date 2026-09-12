import "./App.css";
import {
  Authenticated,
  CanAccess,
  DataProvider,
  Refine,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { Layout } from "./components/refine-ui/layout/layout";
import {
  BookMarked,
  BookOpen,
  GraduationCap,
  Home,
  School,
  Users,
} from "lucide-react";

import dataProvider from "./providers/data";
import { authProvider } from "./providers/auth";
import { accessControlProvider } from "./providers/accessControl";
import Dashboard from "./pages/Dashboard";
import { SignInForm } from "./components/refine-ui/form/sign-in-form";
import { SignUpForm } from "./components/refine-ui/form/sign-up-form";
import SubjectsList from "./pages/subjects/List";
import SubjectCreate from "./pages/subjects/Create";
import SubjectEdit from "./pages/subjects/Edit";
import ClassesList from "./pages/classRooms/List";
import ClassCreate from "./pages/classRooms/Create";
import ShowClassDetails from "./pages/classRooms/Show";
import EnrollmentsList from "./pages/enrollments/List";
import UsersList from "./pages/users/List";
import UserCreate from "./pages/users/Create";
import UserEdit from "./pages/users/Edit";
import UserShow from "./pages/users/Show";

function App() {
  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ThemeProvider>
          {/* <DevtoolsProvider> */}
          <Refine
            authProvider={authProvider}
            dataProvider={dataProvider as DataProvider}
            accessControlProvider={accessControlProvider}
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
                name: "users",
                list: "/users",
                create: "/users/create",
                edit: "/users/edit/:id",
                show: "/users/show/:id",
                meta: { label: "Users", icon: <Users /> },
              },
              {
                name: "subjects",
                list: "/subjects",
                create: "/subjects/create",
                edit: "/subjects/edit/:id",
                meta: { label: "Subjects", icon: <BookOpen /> },
              },

              {
                name: "classes",
                list: "/classes",
                show: "/classes/show/:id",
                create: "/classes/create",
                meta: { label: "Classes", icon: <School /> },
              },
              {
                name: "enrollments",
                list: "/enrollments",
                meta: { label: "My Enrollments", icon: <BookMarked /> },
              },
            ]}
          >
            <Routes>
              <Route path="/login" element={<SignInForm />} />
              <Route path="/register" element={<SignUpForm />} />
              <Route
                element={
                  <Authenticated key="protected-routes" redirectOnFail="/login">
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }
              >
                <Route index element={<Dashboard />} />

                <Route path="subjects">
                  <Route index element={<SubjectsList />} />
                  <Route
                    path="create"
                    element={
                      <CanAccess
                        resource="subjects"
                        action="create"
                        fallback={<Navigate to="/subjects" replace />}
                      >
                        <SubjectCreate />
                      </CanAccess>
                    }
                  />
                  <Route
                    path="edit/:id"
                    element={
                      <CanAccess
                        resource="subjects"
                        action="edit"
                        fallback={<Navigate to="/subjects" replace />}
                      >
                        <SubjectEdit />
                      </CanAccess>
                    }
                  />
                </Route>

                <Route path="classes">
                  <Route index element={<ClassesList />} />
                  <Route
                    path="create"
                    element={
                      <CanAccess
                        resource="classes"
                        action="create"
                        fallback={<Navigate to="/classes" replace />}
                      >
                        <ClassCreate />
                      </CanAccess>
                    }
                  />
                  <Route path="show/:id" element={<ShowClassDetails />} />
                </Route>

                <Route path="enrollments" element={<EnrollmentsList />} />

                <Route
                  path="users"
                  element={
                    <CanAccess
                      resource="users"
                      action="list"
                      fallback={<Navigate to="/" replace />}
                    >
                      <Outlet />
                    </CanAccess>
                  }
                >
                  <Route index element={<UsersList />} />
                  <Route path="create" element={<UserCreate />} />
                  <Route path="edit/:id" element={<UserEdit />} />
                  <Route path="show/:id" element={<UserShow />} />
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

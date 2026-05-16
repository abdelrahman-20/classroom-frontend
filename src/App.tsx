import "./App.css";
import {Refine} from "@refinedev/core";
import {RefineKbar, RefineKbarProvider} from "@refinedev/kbar";
import routerProvider, {DocumentTitleHandler, UnsavedChangesNotifier,} from "@refinedev/react-router";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import {Toaster} from "./components/refine-ui/notification/toaster";
import {useNotificationProvider} from "./components/refine-ui/notification/use-notification-provider";
import {ThemeProvider} from "./components/refine-ui/theme/theme-provider";
import {dataProvider} from "./providers/data";
import {Dashboard} from "@/pages/Dashboard.tsx";
import {BookOpen, Home} from "lucide-react";
import {Layout} from "@/components/refine-ui/layout/layout.tsx";
import {SubjectsList} from "@/pages/subjects/SubjectsList.tsx";
import {SubjectsCreate} from "@/pages/subjects/SubjectsCreate.tsx";

function App() {
  return (
      <BrowserRouter>
        {/*<GitHubBanner/>*/}
        <RefineKbarProvider>
          <ThemeProvider>
            {/*<DevtoolsProvider>*/}
            <Refine
                dataProvider={dataProvider}
                notificationProvider={useNotificationProvider()}
                routerProvider={routerProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "GCxGjk-lvXQuD-TI7hXg",
                }}
                resources={[
                  {
                    name: "dashboard",
                    list: "/",
                    meta: {label: "Home", icon: <Home/>},
                  },
                  {
                    name: "subjects",
                    list: "/subjects",
                    crete: "/subjects/create",
                    meta: {label: "Subjects", icon: <BookOpen/>}
                  }
                ]}
            >
              <Routes>
                <Route
                    element={
                      <Layout>
                        <Outlet/>
                      </Layout>
                    }
                >
                  <Route path="/" element={<Dashboard/>}/>
                  <Route path="subjects">
                    <Route index element={<SubjectsList/>}/>
                    <Route path="create" element={<SubjectsCreate/>}></Route>
                  </Route>
                </Route>
              </Routes>
              <Toaster/>
              <RefineKbar/>
              <UnsavedChangesNotifier/>
              <DocumentTitleHandler/>
            </Refine>
            {/*  <DevtoolsPanel />*/}
            {/*</DevtoolsProvider>*/}
          </ThemeProvider>
        </RefineKbarProvider>
      </BrowserRouter>
  );
}

export default App;

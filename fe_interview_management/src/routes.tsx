import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/layouts/LayoutWrapper.tsx";
import { Spin } from "antd";
import { RouteCheck, RouteConfig, SuspenseWrapperProps } from "@/vite-env";
import Home from "@/pages/home";
import Login from "@/pages/login";
import { ManageUser } from "@/pages/user";
import { ManageJob } from "@/pages/job";
import { OfferPage } from "@/pages/offer";
import { InterviewPage } from "@/pages/interview";
import { CandidatePage } from "@/pages/candidate";
import { RequestPage } from "@/pages/request";

const PageNotFound = React.lazy(() => import("@/pages/404"));
// @ts-ignore
export const PUBLIC_ROUTES: RouteConfig[] = [
  {
    path: "*",
    title: "Page Not Found",
    canActivate: () => true,
    routeError: "Page Not Found",
    component: PageNotFound,
  },
  {
    path: "/login",
    title: "Login",
    canActivate: () => true,
    routeError: "Login",
    component: Login,
  },
  {
    path: "/",
    title: "Home",
    canActivate: () => true,
    routeError: "Home",
    component: Home,
  },
  {
    path: "/user",
    title: "User",
    canActivate: ({ validUser, isAdmin }: { validUser: boolean, isAdmin: boolean }) => validUser && isAdmin,
    routeError: "Home",
    component: ManageUser,
  },
  {
    path: "/job",
    title: "Job",
    canActivate: () => true,
    routeError: "Job",
    component: ManageJob,
  },
  {
    path: '/offer',
    title: 'Offer',
    canActivate: () => true,
    routeError: 'Offer',
    component: OfferPage,
  },
  {
    path: '/interview',
    title: 'Interview',
    canActivate: () => true,
    routeError: 'Interview',
    component: InterviewPage,
  },
  {
    path: '/candidate',
    title: 'Candidate',
    canActivate: () => true,
    routeError: 'Candidate',
    component: CandidatePage,
  },
  {
    path: '/request',
    title: 'Request',
    canActivate: () => true,
    routeError: 'Request',
    component: RequestPage,
  },
];

export const canNavigateToRoute = ({
  route,
  validUser,
  isAdmin,
}: RouteCheck): [RouteConfig, string] => {
  const cr = PUBLIC_ROUTES.find((r) => r.path === route);
  if (
    cr?.canActivate &&
    !cr.canActivate({ validUser, isAdmin })
  ) {
    return [{
      path: "/",
      title: "Home",
      canActivate: () => true,
      routeError: "Login",
      component: Login,
    } as any, cr.routeError || "Access denied"];
  }
  return [cr || {
    path: "/login",
    title: "Login",
    canActivate: () => true,
    routeError: "Login",
    component: Login,
  } as any, ""];
};
const SuspenseWrapper = (props: SuspenseWrapperProps) => {
  return (
    <React.Suspense fallback={<Spin />}>
      {props.children}
    </React.Suspense>
  );
};

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {PUBLIC_ROUTES.map((route) => (
          <Route
            path={route.path}
            key={route.path}
            element={
              <SuspenseWrapper>
                <route.component />
              </SuspenseWrapper>
            }
          />
        ))}
      </Route>
    </Routes>
  );
}

export default MainRoutes;

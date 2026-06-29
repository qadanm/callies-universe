// RoastMyRide — app shell + router [ROASTMYRIDE-NEW].
//
// Real routing (react-router-dom): every screen has its own URL, so the whole
// flow is navigable/click-through. The phone frame + tab bar + a dev-only
// screen-picker make up the decoration shell; the screens inside are composed
// entirely from CORE components.
import React from "react";
import {
  createHashRouter,
  RouterProvider,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { FlowProvider } from "./flow/FlowContext.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { OfflineBanner } from "./components/OfflineBanner.jsx";
import { isNative } from "./native.js";
import { Onboarding } from "./screens/Onboarding.jsx";
import { Home } from "./screens/Home.jsx";
import { Chips } from "./screens/Chips.jsx";
import { Cast } from "./screens/Cast.jsx";
import { Cooking } from "./screens/Cooking.jsx";
import { Reveal } from "./screens/Reveal.jsx";
import { Celebrate } from "./screens/Celebrate.jsx";
import { Paywall } from "./screens/Paywall.jsx";
import { Settings } from "./screens/Settings.jsx";
import { Legal } from "./screens/Legal.jsx";

// path, picker label — order = the intended flow.
const SCREENS = [
  ["/", "Onboard"],
  ["/home", "Home"],
  ["/chips", "Chips"],
  ["/cast", "Cast"],
  ["/cooking", "Cooking"],
  ["/reveal", "Reveal"],
  ["/celebrate", "Share"],
  ["/credits", "Credits"],
  ["/settings", "Settings"],
];

const TABS = [
  ["/home", "Home", "🏠"],
  ["/credits", "Credits", "🎟️"],
  ["/settings", "Settings", "⚙️"],
];

function DevPicker() {
  const go = useNavigate();
  const { pathname } = useLocation();
  return (
    <div className="picker">
      <span className="label">dev · jump to any screen</span>
      {SCREENS.map(([path, label]) => (
        <button key={path} className={pathname === path ? "on" : ""} onClick={() => go(path)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function TabBar() {
  const go = useNavigate();
  const { pathname } = useLocation();
  if (!TABS.some(([p]) => p === pathname)) return null; // only on the rooted tabs
  return (
    <div className="tabbar">
      {TABS.map(([path, label, ico]) => (
        <button key={path} className={pathname === path ? "on" : ""} onClick={() => go(path)}>
          <span className="ico">{ico}</span>
          {label}
        </button>
      ))}
    </div>
  );
}

function Layout() {
  // Native (Capacitor): fill the real device — no simulated phone bezel, no fake
  // status bar, no dev picker. Safe-area insets come from the .native-app CSS.
  if (isNative()) {
    return (
      <div className="native-app">
        <OfflineBanner />
        <div className="stage">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
        <TabBar />
      </div>
    );
  }
  // Web: the cute phone frame + dev picker (a desktop preview affordance).
  return (
    <div className="stage-wrap">
      <DevPicker />
      <div className="phone">
        <div className="screen">
          <div className="notch" />
          <div className="statusbar">
            <span>9:41</span>
            <span>🔥 RoastMyRide</span>
            <span>100%</span>
          </div>
          <OfflineBanner />
          <div className="stage">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
          <TabBar />
        </div>
      </div>
    </div>
  );
}

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Onboarding /> },
      { path: "home", element: <Home /> },
      { path: "chips", element: <Chips /> },
      { path: "cast", element: <Cast /> },
      { path: "cooking", element: <Cooking /> },
      { path: "reveal", element: <Reveal /> },
      { path: "celebrate", element: <Celebrate /> },
      { path: "credits", element: <Paywall /> },
      { path: "settings", element: <Settings /> },
      { path: "legal/:doc", element: <Legal /> },
    ],
  },
]);

export function App() {
  return (
    <FlowProvider>
      <RouterProvider router={router} />
    </FlowProvider>
  );
}

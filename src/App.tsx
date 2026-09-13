import { lazy, Suspense, useEffect, useState } from 'react';
import PreBirthdayPage from './components/PreBirthdayPage';
import { getLaunchState, type LaunchState } from './utils/birthdayGate';

const AdminApp = lazy(() => import('./components/admin/AdminApp'));
const BirthdayExperience = lazy(() => import('./components/BirthdayExperience'));

function RouteLoading({ label }: { label: string }) {
  return <div className="route-loading"><span>WOB</span><p>{label}</p></div>;
}

export default function App() {
  const [launchState, setLaunchState] = useState<LaunchState>(() => getLaunchState());
  const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');

  useEffect(() => {
    if (isAdminRoute) return;
    const timer = window.setInterval(() => setLaunchState(getLaunchState()), 30_000);
    return () => window.clearInterval(timer);
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return <Suspense fallback={<RouteLoading label="Opening private studio…" />}><AdminApp /></Suspense>;
  }

  if (launchState === 'PRE_BIRTHDAY') return <PreBirthdayPage />;

  return (
    <Suspense fallback={<RouteLoading label="Opening the October Chapter…" />}>
      <BirthdayExperience postBirthday={launchState === 'POST_BIRTHDAY'} />
    </Suspense>
  );
}

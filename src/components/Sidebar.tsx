import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../images/logo/image.png';
import SidebarLinkGroup from './SidebarLinkGroup';
import {
  CircleChevronDown,
  CircleChevronUp,
  ClipboardCheck,
  Cog,
  FolderOpen,
  IdCard,
  ListTodo,
  LogOut,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react';
import renderWithAccessControl from '../common/access-control';
import { useLoginStore } from '../store/useLoginStore';
import { RolesEnum } from '../common/enums';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { logout, authenticatedUserRoleId } = useLoginStore();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-10 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#E5E4E2] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink
          to="/"
          className="flex items-center gap-4 text-black dark:text-white"
        >
          <img src={Logo} alt="Logo" className="h-22" />
          <span className="text-xl font-medium">
            {' '}
            {import.meta.env.VITE_APP_NAME}
          </span>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="ml-4 text-sm font-semibold text-bodydark2">MENU</h3>

            <ul className="flex flex-col gap-1.5">
              <SidebarLinkGroup activeCondition={pathname === '/'}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      {renderWithAccessControl(
                        <>
                          <NavLink
                            to="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium  duration-300 ease-in-out text-slate-500 hover:text-white dark:text-bodydark1 hover:bg-graydark dark:hover:bg-meta-4 ${
                              (pathname === '/' ||
                                pathname.includes('access-management')) &&
                              'bg-graydark dark:bg-meta-4'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <ShieldCheck />
                            Roles & Permissions
                            {open ? (
                              <CircleChevronUp size={17} />
                            ) : (
                              <CircleChevronDown size={17} />
                            )}
                          </NavLink>
                          <div
                            className={`translate transform overflow-hidden ${
                              !open && 'hidden'
                            }`}
                          >
                            <ul className="my-1 flex flex-col gap-2.5 pl-6">
                              {/*  {renderWithAccessControl(
                                <li>
                                  <NavLink
                                    to="/permissions"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-slate-800 hover:dark:text-white ' +
                                      (isActive &&
                                        '!text-slate-700 dark:!text-white')
                                    }
                                  >
                                    <KeyRound />
                                    Permissions
                                  </NavLink>
                                </li>,
                                'PERMISSIONS',
                                'READ',
                                '*',
                              )}
                              {renderWithAccessControl(
                                <li>
                                  <NavLink
                                    to="/roles"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-slate-800 hover:dark:text-white ' +
                                      (isActive &&
                                        '!text-slate-700 dark:!text-white')
                                    }
                                  >
                                    <Fingerprint /> Roles
                                  </NavLink>
                                </li>,
                                'ROLES',
                                'READ',
                                '*',
                              )}
                                */}
                              {renderWithAccessControl(
                                <li>
                                  <NavLink
                                    to="/user-roles"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-500 hover:text-white dark:text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                      pathname.includes('user-roles') &&
                                      'bg-graydark dark:bg-meta-4'
                                    }`}
                                  >
                                    <IdCard />
                                    User Roles
                                  </NavLink>
                                </li>,
                                'USER_ROLES',
                                'READ',
                                '*',
                              )}
                            </ul>
                          </div>
                        </>,
                        'ACCESS_CONTROL',
                        'READ',
                        '*',
                      )}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {renderWithAccessControl(
                <li>
                  <NavLink
                    to="/projects"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-500 hover:text-white dark:text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('projects') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <FolderOpen />
                    Projects
                  </NavLink>
                </li>,
                'PROJECTS',
                'READ',
                '*',
              )}
              {renderWithAccessControl(
                <li>
                  <NavLink
                    to="/tasks"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-500 hover:text-white dark:text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('tasks') && 'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <ListTodo />
                    Tasks
                  </NavLink>
                </li>,
                'TASKS',
                'READ',
                '*',
              )}
              {![RolesEnum.ADMIN, RolesEnum.DIRECTOR].includes(
                authenticatedUserRoleId as RolesEnum,
              ) &&
                renderWithAccessControl(
                  <li>
                    <NavLink
                      to="/approvals"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-500 hover:text-white dark:text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('approvals') &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <ClipboardCheck />
                      Approvals
                    </NavLink>
                  </li>,
                  'APPROVALS',
                  'UPDATE',
                  '*',
                )}
              {renderWithAccessControl(
                <li>
                  <NavLink
                    to="/teams"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-500 hover:text-white dark:text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('teams') && 'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <UsersRound />
                    Teams
                  </NavLink>
                </li>,
                'TEAMS',
                'READ',
                '*',
              )}
              {renderWithAccessControl(
                <li>
                  <NavLink
                    to="/users"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-500 hover:text-white dark:text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('users') && 'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <UserRoundPlus />
                    Users
                  </NavLink>
                </li>,
                'USERS',
                'CREATE',
                '*',
              )}
              <li>
                <NavLink
                  to="/settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-500 hover:text-white dark:text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('settings') &&
                    'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <Cog />
                  Settings
                </NavLink>
              </li>
            </ul>
          </div>

          <button
            onClick={logout}
            className={`my-1 w-full relative flex md:hidden items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-slate-500 hover:text-white dark:text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
          >
            <LogOut />
            Log Out
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

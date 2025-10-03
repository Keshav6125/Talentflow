import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Users, ClipboardCheck, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const Navigation = ({ className = '' }) => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/jobs', 
      label: 'Jobs', 
      icon: Building2,
      description: 'Manage job postings'
    },
    { 
      path: '/candidates', 
      label: 'Candidates', 
      icon: Users,
      description: 'View and manage candidates'
    },
    { 
      path: '/assessments', 
      label: 'Assessments', 
      icon: ClipboardCheck,
      description: 'Create and manage assessments'
    }
  ];
  
  return (
    <nav className={className}>
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-xl font-bold text-gray-900">TalentFlow</h1>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <Navigation />
            
            {/* Footer */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full">
                <div className="text-xs text-gray-500">
                  Demo Version - All data is stored locally
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h1 className="ml-2 text-lg font-bold text-gray-900">TalentFlow</h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex items-center px-4 py-5 border-b border-gray-200">
                <Building2 className="h-6 w-6 text-blue-600" />
                <h1 className="ml-2 text-lg font-bold text-gray-900">TalentFlow</h1>
              </div>
              <div className="px-4 py-4">
                <Navigation />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
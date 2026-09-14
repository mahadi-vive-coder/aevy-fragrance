import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  path: string;
  currentPath: string;
  navigate: (to: string, options?: { replace?: boolean; state?: any }) => void;
  params: Record<string, string>;
  searchParams: URLSearchParams;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname || '/';
      setPath(newPath);
      setSearchParams(new URLSearchParams(window.location.search));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean; state?: any }) => {
    // If external or mailto or tel
    if (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:')) {
      window.location.href = to;
      return;
    }

    // Split target into path and search query if any
    const [rawPath, rawQuery] = to.split('?');
    const targetPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    const fullTarget = rawQuery ? `${targetPath}?${rawQuery}` : targetPath;

    try {
      if (options?.replace) {
        window.history.replaceState(options?.state || null, '', fullTarget);
      } else {
        window.history.pushState(options?.state || null, '', fullTarget);
      }
    } catch {
      // In sandboxed iframe environments history manipulation might be restricted
    }

    setPath(targetPath);
    setSearchParams(new URLSearchParams(rawQuery || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Compute simple URL params like /products/:slug
  let params: Record<string, string> = {};
  if (path.startsWith('/products/')) {
    const slug = path.replace('/products/', '').split('/')[0].split('?')[0];
    params.slug = slug;
  }

  return (
    <RouterContext.Provider
      value={{
        path,
        currentPath: path,
        navigate,
        params,
        searchParams,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const Link: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
  title?: string;
}> = ({ to, children, className = '', onClick, id, title }) => {
  const { navigate, path } = useRouter();
  const isActive = path === to.split('?')[0];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    onClick?.();
    navigate(to);
  };

  return (
    <a
      id={id}
      href={to}
      title={title}
      onClick={handleClick}
      className={`${className} ${isActive ? 'is-active' : ''}`}
    >
      {children}
    </a>
  );
};

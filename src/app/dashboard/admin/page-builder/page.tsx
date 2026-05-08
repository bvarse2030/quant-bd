/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { toast } from 'react-toastify';
import { useEffect, useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, ExternalLink, FolderOpen, Layout, X, AlertTriangle, RefreshCw, Database } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetPagesQuery, useAddPageMutation, useUpdatePageMutation, useDeletePageMutation } from '@/redux/features/page-builder/pageBuilderSlice';

interface IPage {
  _id: string;
  pageName: string;
  path: string;
  isActive: boolean;
  [key: string]: unknown;
}

const Page = () => {
  const { data: pagesData, isLoading, error, refetch } = useGetPagesQuery({ page: 1, limit: 100 });

  const [addPage, { isLoading: isAdding }] = useAddPageMutation();
  const [updatePage] = useUpdatePageMutation();
  const [deletePage] = useDeletePageMutation();

  const [pages, setPages] = useState<IPage[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<IPage | null>(null);
  const [formData, setFormData] = useState({ pageName: '', path: '' });

  useEffect(() => {
    const rawPages = pagesData?.data?.pages || [];

    if (rawPages.length > 0) {
      const normalizedList: IPage[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extractPages = (list: any[]) => {
        list.forEach(item => {
          const normalizedPage: IPage = {
            ...item,
            _id: item._id,
            isActive: item.isActive ?? true,
            pageName: item.pageName || item.pageTitle || 'Untitled Page',
            path: item.path || item.pagePath || '#',
          };

          normalizedList.push(normalizedPage);

          if (item.subPage && Array.isArray(item.subPage) && item.subPage.length > 0) {
            extractPages(item.subPage);
          }
        });
      };

      extractPages(rawPages);
      setPages(normalizedList);
    }
  }, [pagesData]);

  const groupedPages = useMemo(() => {
    return pages.reduce((groups: Record<string, IPage[]>, page) => {
      if (!page.path) return groups;

      const parts = page.path.split('/').filter(Boolean);
      const groupKey = parts.length > 0 ? `/${parts[0]}` : 'Root Pages';

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(page);
      return groups;
    }, {});
  }, [pages]);

  const handleSavePage = async () => {
    if (!formData.pageName || !formData.path) {
      toast.error('Please fill in all fields');
      return;
    }

    const formattedPath = formData.path.startsWith('/') ? formData.path : `/${formData.path}`;

    try {
      await addPage({
        pageName: formData.pageName,
        path: formattedPath,
        isActive: true,
        content: [],
      }).unwrap();

      toast.success('Page created successfully');
      setFormData({ pageName: '', path: '' });
      setIsAddDialogOpen(false);
    } catch (err) {
      toast.error('Failed to create page');
      console.error('Error creating page:', err);
    }
  };

  const handleEdit = (path: string) => {
    window.open(`/dashboard/admin/page-builder/edit-page?pathTitle=${path}`);
  };

  const initiateDelete = (page: IPage) => {
    setPageToDelete(page);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pageToDelete?._id) return;

    try {
      await deletePage({ id: pageToDelete._id }).unwrap();
      toast.success('Page deleted successfully');
      setIsDeleteDialogOpen(false);
      setPageToDelete(null);
    } catch (err) {
      toast.error('Failed to delete page');
      console.error('Error deleting page:', err);
    }
  };

  const handlePreview = (path: string) => {
    window.open(`/dashboard/admin/page-builder/preview-page?pathTitle=${path}`);
  };

  const handleLiveLink = (path: string) => {
    window.open(path);
  };
  const handleFormDataPage = (path: string) => {
    window.open(`/dashboard/admin/page-builder/form-data?pathTitle=${path}`);
  };

  const handleToggleActive = async (page: IPage) => {
    if (!page._id) return;

    try {
      const updatedStatus = !page.isActive;
      setPages(prev => prev.map(p => (p._id === page._id ? { ...p, isActive: updatedStatus } : p)));

      await updatePage({
        id: page._id,
        isActive: updatedStatus,
      }).unwrap();

      toast.success(`Page ${updatedStatus ? 'activated' : 'deactivated'}`);
    } catch (err) {
      setPages(prev => prev.map(p => (p._id === page._id ? { ...p, isActive: !page.isActive } : p)));
      toast.error('Failed to update page status');
      console.error('Error updating page:', err);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                <Layout className="h-10 w-10 text-white animate-spin duration-3000" />
              </div>
            </div>
            <div className="text-white text-xl font-semibold">Loading pages...</div>
            <div className="text-slate-400 text-sm">Please wait while we fetch your structure</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    const errorMessage =
      'status' in error ? `Error ${error.status}: ${JSON.stringify(error.data)}` : 'message' in error ? error.message : 'An unexpected error occurred';

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 pt-[90px] pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-500 max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 blur-3xl rounded-full" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Failed to Load Pages</h2>
              <p className="text-slate-400 text-sm">We encountered an error while fetching your pages.</p>
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-left w-full overflow-hidden">
                <p className="text-red-400 text-xs font-mono break-all">{errorMessage}</p>
              </div>
            </div>
            <Button onClick={() => refetch()} variant="outlineGlassy" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 pt-[90px] pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Page Management</h1>
            <p className="text-slate-400 mt-1 text-sm">Manage your application routes, structure, and visibility.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => refetch()} variant="outlineGlassy" size="icon" title="Refresh Data">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineGlassy" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>
        </div>

        {pages.length === 0 ? (
          <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center justify-center min-h-[50vh] border-2 border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm p-12">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <FolderOpen className="h-12 w-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 text-center">No Pages Yet</h2>
            <p className="text-slate-400 text-center max-w-md mb-8 text-lg">Get started by creating your first page.</p>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outlineGlassy" size="lg">
              <Plus className="h-5 w-5" />
              Create Your First Page
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedPages).map(([groupName, groupPages]) => (
              <div key={groupName} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-4 text-slate-300">
                  <FolderOpen className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-semibold capitalize tracking-wide">{groupName === 'Root Pages' ? 'Main Pages' : groupName.replace('/', '')}</h2>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-slate-400">{groupPages.length}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupPages.map(page => (
                    <div
                      key={page._id}
                      className={`
                        relative group overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-300
                        ${
                          page.isActive
                            ? 'bg-slate-900/60 border-white/10 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                            : 'bg-slate-900/30 border-white/5 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'
                        }
                      `}
                    >
                      <div className="p-5 space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 max-w-[70%]">
                              <div className={`p-1.5 rounded-md shrink-0 ${page.isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/20 text-slate-500'}`}>
                                <Layout className="h-4 w-4" />
                              </div>
                              <h3 className="font-bold text-slate-100 truncate" title={page.pageName}>
                                {page.pageName}
                              </h3>
                            </div>
                            <Switch
                              checked={page.isActive}
                              onCheckedChange={() => handleToggleActive(page)}
                              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/50"
                            />
                          </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <div className="w-full flex flex-col gap-2 items-start justify-between">
                          <p
                            className="text-xs font-mono text-slate-400 bg-black/20 inline-block px-2 py-1 rounded border border-white/5 max-w-[120px] truncate"
                            title={page.path}
                          >
                            {page.path}
                          </p>

                          <div className="flex items-center justify-between gap-1">
                            <div className="flex gap-1">
                              <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handleEdit(page.path)} title="Edit Page">
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handlePreview(page.path)} title="Preview Page">
                                <Eye className="h-4 w-4" />
                              </Button>

                              <Button size="sm" variant="outlineGlassy" className="min-w-1" onClick={() => handleLiveLink(page.path)} title="Visit Live Page">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outlineGlassy"
                                className="min-w-1"
                                onClick={() => handleFormDataPage(page.path)}
                                title="Visit Live Page"
                              >
                                <Database className="h-4 w-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="outlineFire"
                                className="min-w-1 text-red-400 hover:text-red-200"
                                onClick={() => initiateDelete(page)}
                                title="Delete Page"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-semibold text-white">Create New Page</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsAddDialogOpen(false)} className="hover:bg-white/10 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                  Page Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. About Us"
                  className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500"
                  value={formData.pageName}
                  onChange={e => setFormData({ ...formData, pageName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="path" className="text-slate-300">
                  Page Path
                </Label>
                <Input
                  id="path"
                  placeholder="e.g. /about/us"
                  className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-500 font-mono text-sm"
                  value={formData.path}
                  onChange={e => setFormData({ ...formData, path: e.target.value })}
                />
              </div>
            </div>
            <div className="p-6 pt-2 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={handleSavePage} disabled={!formData.pageName || !formData.path || isAdding} className="bg-blue-600 hover:bg-blue-500 text-white">
                {isAdding ? 'Creating...' : 'Create Page'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && pageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-red-500/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-red-500/5">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Delete Page?</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsDeleteDialogOpen(false)} className="hover:bg-white/10 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <p className="text-slate-300">
                Are you sure you want to delete <span className="font-bold text-white">{pageToDelete.pageName}</span>?
              </p>
              <p className="text-sm text-slate-500 mt-2">
                This action cannot be undone. The path <span className="font-mono text-slate-400">{pageToDelete.path}</span> will no longer be accessible.
              </p>
            </div>

            <div className="p-6 pt-2 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-500 text-white border-none">
                Delete Page
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;

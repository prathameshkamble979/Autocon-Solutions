
import { useEffect, useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
} from '@tanstack/react-table';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('category', data.category);
        formData.append('description', data.description);
        formData.append('status', data.status);
        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append('images', data.images[i]);
            }
        }

        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, formData);
                toast.success('Project updated successfully!');
            } else {
                await api.post('/projects', formData);
                toast.success('Project added successfully!');
            }
            setIsModalOpen(false);
            reset();
            setEditingProject(null);
            fetchProjects();
        } catch (error) {
            console.error('Failed to save project', error);
            toast.error(error.response?.data?.message || 'Failed to save project');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                toast.success('Project deleted');
                fetchProjects();
            } catch (error) {
                console.error('Failed to delete', error);
                toast.error('Failed to delete project');
            }
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setValue('title', project.title);
        setValue('category', project.category);
        setValue('description', project.description);
        setValue('status', project.status);
        setIsModalOpen(true);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
            },
            {
                accessorKey: 'category',
                header: 'Category',
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: (info) => (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${info.getValue() === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {info.getValue()}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: (info) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(info.row.original)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(info.row.original._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: projects,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Projects</h1>
                <button
                    onClick={() => {
                        setEditingProject(null);
                        reset();
                        setIsModalOpen(true);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Add Project</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="px-6 py-3 text-sm font-semibold text-slate-600">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingProject ? 'Edit Project' : 'Add Project'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input {...register('title', { required: true })} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <input {...register('category', { required: true })} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea {...register('description', { required: true })} className="w-full border rounded p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select {...register('status')} className="w-full border rounded p-2">
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Images (Select multiple)</label>
                                <input type="file" multiple {...register('images')} className="w-full border rounded p-2" />
                            </div>
                            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-2.5 rounded-lg transition-colors">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Projects;

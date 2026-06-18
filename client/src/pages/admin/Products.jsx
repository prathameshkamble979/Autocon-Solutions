
import { useEffect, useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import { Edit, Trash2, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const CONVEYOR_SUBCATEGORIES = [
    'Belt Conveyor',
    'Roller Conveyor',
    'Chain Conveyor',
    'Slat Conveyor',
    'Modular Belt Conveyor',
    'Spiral Conveyor',
    'Wiremesh Conveyor',
    'Truck Loading Conveyor',
    'Telescopic Conveyor',
    'Flexible Conveyor',
    'Screw Conveyor',
];

// Reusable dynamic list field component
const DynamicListField = ({ label, items, onChange, placeholder }) => {
    const [inputVal, setInputVal] = useState('');
    const addItem = () => {
        if (!inputVal.trim()) return;
        onChange([...items, inputVal.trim()]);
        setInputVal('');
    };
    const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <div className="flex gap-2 mb-2">
                <input
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
                    placeholder={placeholder}
                    className="flex-grow border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                />
                <button type="button" onClick={addItem} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg text-sm font-bold">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item, i) => (
                    <span key={i} className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-700">
                        {item}
                        <button type="button" onClick={() => removeItem(i)} className="ml-1 text-slate-400 hover:text-red-500"><X size={12} /></button>
                    </span>
                ))}
            </div>
        </div>
    );
};

// Specification key-value field
const SpecificationsField = ({ specs, onChange }) => {
    const [key, setKey] = useState('');
    const [val, setVal] = useState('');
    const addSpec = () => {
        if (!key.trim() || !val.trim()) return;
        onChange([...specs, { label: key.trim(), value: val.trim() }]);
        setKey(''); setVal('');
    };
    const removeSpec = (idx) => onChange(specs.filter((_, i) => i !== idx));
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Technical Specifications</label>
            <div className="flex gap-2 mb-2">
                <input value={key} onChange={e => setKey(e.target.value)} placeholder="Label (e.g. Belt Width)" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none" />
                <input value={val} onChange={e => setVal(e.target.value)} placeholder="Value (e.g. 300–1500mm)" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none" />
                <button type="button" onClick={addSpec} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-lg text-sm font-bold">Add</button>
            </div>
            <div className="space-y-1">
                {specs.map((s, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 rounded px-3 py-1.5 text-xs">
                        <span className="font-semibold text-slate-700 w-1/3">{s.label}</span>
                        <span className="text-slate-500 flex-grow">{s.value}</span>
                        <button type="button" onClick={() => removeSpec(i)} className="text-slate-400 hover:text-red-500 ml-2"><X size={12} /></button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Dynamic fields state
    const [features, setFeatures] = useState([]);
    const [specifications, setSpecifications] = useState([]);
    const [applications, setApplications] = useState([]);

    const { register, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: { category: 'Conveyors' }
    });

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const resetForm = () => {
        reset({ category: 'Conveyors' });
        setFeatures([]);
        setSpecifications([]);
        setApplications([]);
        setEditingProduct(null);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('shortDesc', data.shortDesc);
        if (data.description) formData.append('description', data.description);
        formData.append('category', data.category || 'Conveyors');
        formData.append('subcategory', data.subcategory);
        formData.append('featured', data.featured);
        formData.append('features', JSON.stringify(features));
        formData.append('specifications', JSON.stringify(specifications));
        formData.append('applications', JSON.stringify(applications));
        if (data.image && data.image[0]) formData.append('image', data.image[0]);
        if (data.video && data.video[0]) formData.append('video', data.video[0]);

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formData);
                toast.success('Product updated successfully!');
            } else {
                await api.post('/products', formData);
                toast.success('Product added successfully!');
            }
            setIsModalOpen(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Failed to save product', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setValue('name', product.name);
        setValue('shortDesc', product.shortDesc);
        setValue('description', product.description || '');
        setValue('category', product.category || 'Conveyors');
        setValue('subcategory', product.subcategory || '');
        setValue('featured', product.featured);
        setFeatures(product.features || []);
        setSpecifications(product.specifications || []);
        setApplications(product.applications || product.useCases || []);
        setIsModalOpen(true);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'image',
                header: 'Image',
                cell: (info) => (
                    <img src={info.getValue()} alt="Product" className="w-14 h-14 object-cover rounded-lg border border-slate-200" onError={(e) => { e.target.src = '/images/hero_conveyor_1773902700148.png'; }} />
                ),
            },
            { accessorKey: 'name', header: 'Product Name' },
            {
                accessorKey: 'subcategory',
                header: 'Conveyor Type',
                cell: (info) => (
                    <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded">
                        {info.getValue() || '—'}
                    </span>
                ),
            },
            {
                accessorKey: 'featured',
                header: 'Featured',
                cell: (info) => (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${info.getValue() ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-500'}`}>
                        {info.getValue() ? 'Yes' : 'No'}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: (info) => (
                    <div className="flex space-x-2">
                        <button onClick={() => handleEdit(info.row.original)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(info.row.original._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                    <p className="text-slate-500 text-sm mt-1">{products.length} conveyor products total</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Add Product</span>
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
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-12 text-slate-400">Loading products...</td></tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-16 text-slate-400">No products yet. Click "Add Product" to get started.</td></tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {!loading && products.length > 0 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
                        <p className="text-sm text-slate-500">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 text-sm border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50">Prev</button>
                            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 text-sm border border-slate-200 rounded disabled:opacity-40 hover:bg-slate-50">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <p className="text-slate-500 text-sm mt-0.5">Fill in the conveyor product details below</p>
                            </div>
                            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                <X size={22} className="text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                                    <input {...register('name', { required: true })} placeholder="e.g. Flat Belt Conveyor" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Main Category</label>
                                    <input {...register('category')} defaultValue="Conveyors" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-400 cursor-not-allowed" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Conveyor Type (Subcategory) *</label>
                                    <select {...register('subcategory', { required: true })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none bg-white">
                                        <option value="">— Select Conveyor Type —</option>
                                        {CONVEYOR_SUBCATEGORIES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Short Description * (shown in cards)</label>
                                <textarea {...register('shortDesc', { required: true })} rows={2} placeholder="Brief description shown on product cards..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none resize-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Description (shown on detail page)</label>
                                <textarea {...register('description')} rows={3} placeholder="Detailed product description..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none resize-none" />
                            </div>

                            {/* Dynamic Fields */}
                            <DynamicListField
                                label="Key Features"
                                items={features}
                                onChange={setFeatures}
                                placeholder="e.g. Heavy-duty steel frame"
                            />

                            <SpecificationsField specs={specifications} onChange={setSpecifications} />

                            <DynamicListField
                                label="Application Industries"
                                items={applications}
                                onChange={setApplications}
                                placeholder="e.g. Warehouse Automation"
                            />

                            {/* Media */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Image {!editingProduct && '*'}</label>
                                    <input type="file" {...register('image')} accept="image/*" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                    <p className="text-xs text-slate-400 mt-1">Recommended: 800×600px, JPG/PNG</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Video (Optional)</label>
                                    <input type="file" {...register('video')} accept="video/*" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                                    <p className="text-xs text-slate-400 mt-1">MP4 format preferred</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <input type="checkbox" {...register('featured')} id="featured" className="w-4 h-4 rounded border-slate-300 text-amber-500" />
                                <label htmlFor="featured" className="text-sm font-medium text-slate-700">Mark as Featured Product (shown prominently on homepage)</label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-medium transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors shadow-md">
                                    {editingProduct ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Products;

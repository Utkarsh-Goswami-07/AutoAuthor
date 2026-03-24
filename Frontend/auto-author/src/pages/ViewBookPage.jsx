import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Book, ArrowLeft } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import ViewBook from "../components/view/ViewBook";


const ViewBookSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/2 mb-4" />
        <div className="h-4 bg-slate-200 rounded w-1/4 mb-8" />

        <div className="flex gap-8">
            <div className="w-1/4">
                <div className="h-96 bg-slate-200 rounded-lg" />
            </div>

            <div className="w-3/4">
                <div className="h-full bg-slate-200 rounded-lg" />
            </div>
        </div>
    </div>
);

const ViewBookPage = () => {

    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { bookId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axiosInstance.get(
                    `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
                );
                setBook(response.data);
            } catch (error) {
                toast.error("Failed to fetch eBook.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    return (
        <DashboardLayout>
            <div className="container mx-auto p-6">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </button>

                {isLoading ? (
                    <ViewBookSkeleton />
                ) : book ? (
                    <ViewBook book={book} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl mt-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Book className="w-8 h-8 text-slate-400"/>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">
                            eBook Not Found
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-md">
                            The eBook you are looking for does not exist or you do not have
                            permission to view it.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
export default ViewBookPage
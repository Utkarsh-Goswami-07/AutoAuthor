import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/apiPaths";
import { Edit, Trash2 } from "lucide-react";

const BookCard = ({ book, onDelete }) => {
    const navigate = useNavigate();

    const coverImageUrl = book.coverImage
        ? `${BASE_URL}${book.coverImage}`.replace(/\\/g, "/")
        : "";

    return (
        <div
            className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(`/view-book/${book._id}`)}
        >
            <div className="relative overflow-hidden bg-gray-100">
                {coverImageUrl ? (
                    <img
                        src={coverImageUrl}
                        alt={book.title}
                        className="w-full aspect-[16/25] object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                ) : (
                    <div className="w-full aspect-[16/25] flex items-center justify-center text-gray-400 text-sm">
                        No Cover
                    </div>
                )}

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/editor/${book._id}`);
                        }}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow"
                    >
                        <Edit className="w-4 h-4" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(book._id);
                        }}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="relative">
                    <h3 className="text-sm font-semibold line-clamp-2">
                        {book.title}
                    </h3>
                    <p className="text-xs text-gray-300">{book.author}</p>
                </div>
            </div>
        </div>
    );
};

export default BookCard;

/*
|-----------------------------------------
| setting up GeneratePagination for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

export const generatePaginationComponentFile = (): string => {
  return `import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    if (totalItems <= itemsPerPage) return null

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const getPageNumbers = () => {
        const maxPagesToShow = 5 // Maximum number of page buttons to show
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
        let endPage = startPage + maxPagesToShow - 1

        if (endPage > totalPages) {
            endPage = totalPages
            startPage = Math.max(1, endPage - maxPagesToShow + 1)
        }

        return Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i)
    }

    const renderPageButton = (page: number, isCurrent: boolean) => (
        <button
            key={\`page-\${page}\`}
            onClick={() => onPageChange(page)}
            disabled={isCurrent}
            className={\`
                flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                \${isCurrent
                    ? 'bg-primary text-primary-foreground cursor-default'
                    : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }
            \`}
            aria-current={isCurrent ? 'page' : undefined}
        >
            {page}
        </button>
    )
    
    const pageNumbers = getPageNumbers()
    const showStartEllipsis = pageNumbers[0] > 2
    const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages - 1

    return (
        <div className="flex items-center justify-center w-full py-4">
            <nav className="flex items-center gap-1">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* First Page */}
                {pageNumbers[0] > 1 && renderPageButton(1, false)}

                {/* Start Ellipsis */}
                {showStartEllipsis && (
                    <span className="flex items-center justify-center h-9 w-9 text-muted-foreground">...</span>
                )}

                {/* Page Numbers */}
                {pageNumbers.map((page) => renderPageButton(page, currentPage === page))}

                {/* End Ellipsis */}
                {showEndEllipsis && (
                    <span className="flex items-center justify-center h-9 w-9 text-muted-foreground">...</span>
                )}

                {/* Last Page */}
                {pageNumbers[pageNumbers.length - 1] < totalPages && renderPageButton(totalPages, false)}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center h-9 w-9 rounded-md text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </nav>
        </div>
    )
}

export default Pagination
`;
};

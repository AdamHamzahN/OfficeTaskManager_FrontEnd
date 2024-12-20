import { Table } from "antd";
import { useState } from "react";

interface TableComponentProps {
    data: any;
    columns: any;
    loading?: boolean;
    page?: number;
    pageSize?: number;
    total?: number;
    className?: string;
    pagination: boolean; // Menentukan apakah pagination digunakan
    onPageChange?: (page: number, pageSize: number) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
    data,
    columns,
    loading,
    page,
    pageSize,
    total,
    className,
    pagination,
    onPageChange
}) => {
    const [currentPage, setCurrentPage] = useState(page);
    const [itemsPerPage, setItemsPerPage] = useState(pageSize);

    const handlePageChange = (newPage: number, newPageSize: number) => {
        setCurrentPage(newPage);
        setItemsPerPage(newPageSize);
        if(onPageChange){
            onPageChange(newPage, newPageSize);
        }
    };

    return (
        <Table
            dataSource={data}
            columns={columns}
            className={className}
            loading={loading ? loading : false}
            pagination={
                pagination
                    ? {
                        current: currentPage,
                        pageSize: itemsPerPage,
                        total: total,
                        position: ["bottomCenter"],
                        onChange: handlePageChange,
                    }
                    : false
            }
        />
    );
};

export default TableComponent;

import React, { useState } from 'react';
import { Button, Modal } from 'antd';


const ModalComponent: React.FC<{
    content: React.ReactNode;
    title: string;
    children?: React.ReactNode;
    footer?: (handleCancel: () => void, handleOk: () => void) => React.ReactNode;
}> = ({ content, title, children, footer }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <div onClick={showModal}>
                {children || <Button type="primary">Open Modal</Button>}
            </div>
            <Modal
                open={open}
                title={title}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={footer ? footer(handleCancel, handleOk) : null}
            >
                {content}
            </Modal>
        </>
    );
};

export default ModalComponent;

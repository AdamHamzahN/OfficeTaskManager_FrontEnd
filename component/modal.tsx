import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const ModalComponent: React.FC<({
    content: React.ReactNode,
    title:string
})> = ({ content,title }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal title={title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {content}
            </Modal>
        </>
    );
};

export default ModalComponent;
import React, { useState } from 'react';
import { Button, Modal } from 'antd';

interface ModalComponentProps {
    content: React.ReactNode;
    title: string;
    children?: React.ReactNode;
    footer: (handleCancel: () => void, handleOk: () => void) => React.ReactNode;
    onOk?: () => void;  
    onCancel?: () => void;  
    visible?: boolean;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
    content,
    title,
    children,
    footer,
    onOk,
    onCancel,
    visible
}) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const handleCancel = () => {
        setIsModalVisible(false);
        if (onCancel) {
            onCancel();  // Panggil onCancel jika ada
        }
    };

    const handleOk = () => {
        if (onOk) {
            onOk();  // Panggil onOk jika ada
        }
        setIsModalVisible(false);
    };

    return (
        <>
            <div onClick={() => setIsModalVisible(true)}>
                {children}
            </div>
            <Modal
                title={title}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={footer ? footer(handleCancel, handleOk):null}  // Gunakan handleCancel dan handleOk
            >
                {content}
            </Modal>
        </>
    );
};

export default ModalComponent;

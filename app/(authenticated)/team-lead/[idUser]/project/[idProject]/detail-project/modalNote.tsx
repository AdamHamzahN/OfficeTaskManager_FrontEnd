import { Button, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SearchOutlined } from "@ant-design/icons";

const ModalNote = () => {
    return (
        <div>
            <label htmlFor="note" style={{ marginBottom: '8px', display: 'block' }}>Note</label>
            <Input placeholder="Masukkan Catatan Disini" readOnly style={{ marginBottom: '16px' }} />
        </div>
    );
};

export default ModalNote;

import { Button, Input } from "antd";

const ModalUbahNamaTeam:React.FC<{nama_team:string,onNamaTeamChange:any}> = ({ nama_team, onNamaTeamChange }) => {
    return (
        <div>
            <Input
                defaultValue={nama_team}
                onChange={(e) => onNamaTeamChange(e.target.value)}
                placeholder="Masukkan nama team baru"
            />
        </div>
    );
};

export default ModalUbahNamaTeam;

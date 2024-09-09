import { Card } from "antd";
import Link from "next/link";
import { CalendarOutlined } from '@ant-design/icons';

const CardProjectDashboard: React.FC<{
    title: React.ReactNode,
    link: string,
    teamLead: React.ReactNode,
    startDate: string,
    endDate: string
}> = ({ title, link, teamLead, startDate, endDate }) => (
    <Card style={{ width: '100%' }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
        }}>
            <div style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100% - 50px)'
            }}>
                {title}
            </div>
            <span style={{ fontWeight: 'bold', marginLeft: '10px', textDecoration: 'none' }}>
                <Link href={link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    &gt;
                </Link>
            </span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 'bold' }}>
            {teamLead}
        </div>
        <div style={{ backgroundColor: 'rgba(242, 246, 249, 1)', display: 'flex', borderRadius: 8, marginTop: 5 }}>
            <div style={{ padding: 10, marginRight: 5 }}>
                <h4 style={{ color: 'rgba(109, 117, 128, 1)' }}><CalendarOutlined />Start Date</h4>
                {startDate}
            </div>
            <div style={{ height: '100%', alignItems: 'center', margin: 20, fontSize: 20, color: 'rgba(109, 117, 128, 0.15)' }}>
                <span>|</span>
            </div>
            <div style={{ padding: 10 }}>
                <h4 style={{ color: 'rgba(109, 117, 128, 1)' }}><CalendarOutlined />End Date</h4>
                {endDate}
            </div>
        </div>
    </Card>
);

export default CardProjectDashboard;
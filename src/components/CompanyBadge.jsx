import './CompanyBadge.css';

const companyColors = {
    'Google': '#4285F4',
    'Meta': '#0668E1',
    'Amazon': '#FF9900',
    'Microsoft': '#00A4EF',
    'Apple': '#A2AAAD',
    'Netflix': '#E50914',
    'Uber': '#000000',
    'Flipkart': '#2874F0',
    'Airbnb': '#FF5A5F',
    'Spotify': '#1DB954',
    'Stripe': '#635BFF',
    'Adobe': '#FF0000',
    'Atlassian': '#0052CC',
    'Twitter': '#1DA1F2',
    'PayPal': '#003087',
    'Walmart': '#0071CE',
    'Oracle': '#F80000',
    'Samsung': '#1428A0',
    'Shopify': '#96BF48',
    'Dropbox': '#0061FF',
    'TCS': '#0073B1',
    'Infosys': '#007CC3',
    'Wipro': '#3B0083',
    'Cognizant': '#1A4CA1',
    'HCL': '#004C97',
    'Accenture': '#A100FF',
    'Goldman Sachs': '#7399C6',
    'JP Morgan': '#003A70',
    'IBM': '#0530AD',
    'Deloitte': '#86BC25',
    'Booking.com': '#003580'
};

function CompanyBadge({ company }) {
    const color = companyColors[company] || '#6366f1';

    return (
        <span
            className="company-badge"
            style={{
                '--badge-color': color,
                '--badge-bg': `${color}15`,
                '--badge-border': `${color}30`,
            }}
        >
            🏢 {company}
        </span>
    );
}

export default CompanyBadge;
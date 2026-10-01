// Shared colours/labels for emission & department statuses
export const STATUS_META = {
    normal: { label: 'Normal', color: '#059669', bg: 'rgba(5,150,105,0.10)', border: 'rgba(5,150,105,0.28)' },
    warning: { label: 'Approaching limit', color: '#D97706', bg: 'rgba(217,119,6,0.10)', border: 'rgba(217,119,6,0.30)' },
    breach: { label: 'Over limit', color: '#DC2626', bg: 'rgba(220,38,38,0.09)', border: 'rgba(220,38,38,0.28)' },
    maintenance: { label: 'Maintenance', color: '#0E7490', bg: 'rgba(14,116,144,0.09)', border: 'rgba(14,116,144,0.26)' },
    unknown: { label: 'No data', color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)' },
};

export const statusMeta = (status) => STATUS_META[status] || STATUS_META.unknown;

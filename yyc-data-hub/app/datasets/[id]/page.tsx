'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const CKAN_URL = process.env.NEXT_PUBLIC_CKAN_URL;

export default function DatasetPage() {
  const { id } = useParams();
  const [dataset, setDataset] = useState<any>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${CKAN_URL}/api/3/action/package_show?id=${id}`)
      .then(r => r.json())
      .then(data => {
        setDataset(data.result);
        setLoading(false);
        const csv = data.result?.resources?.find((r: any) => r.format?.toLowerCase() === 'csv');
        if (csv?.id) loadPreview(csv.id);
      });
  }, [id]);

  const loadPreview = async (resourceId: string) => {
    setPreviewLoading(true);
    try {
      const res = await fetch(`${CKAN_URL}/api/3/action/datastore_search?resource_id=${resourceId}&limit=5`);
      const data = await res.json();
      if (data.result?.records) {
        setPreview(data.result.records);
        setTotalRows(data.result.total);
      }
    } catch (e) {
      console.error('Preview failed', e);
    } finally {
      setPreviewLoading(false);
    }
  };

  if (loading) return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f7f6f2', color: '#888' }}>
      Loading dataset...
    </div>
  );

  const columns = preview.length > 0
    ? Object.keys(preview[0]).filter(k => k !== '_id' && k !== '_full_text')
    : [];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: '#f7f6f2', minHeight: '100vh', color: '#1a1a1a' }}>

      {/* NAV */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e8e4dc', padding: '0 2rem', display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>
        <a href="/" style={{ fontWeight: 800, fontSize: 18, color: '#1a6b3c', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          YYC Data Society
        </a>
        <span style={{ color: '#ccc' }}>›</span>
        <span style={{ fontSize: 14, color: '#888' }}>Datasets</span>
        <span style={{ color: '#ccc' }}>›</span>
        <span style={{ fontSize: 14, color: '#555', fontWeight: 500 }}>{dataset?.title}</span>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 2rem' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'inline-block', background: '#f0faf4', color: '#1a6b3c', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 100, marginBottom: 14, letterSpacing: 0.5 }}>
            {dataset?.organization?.title || 'Community'}
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 14, lineHeight: 1.2 }}>
            {dataset?.title}
          </h1>
          <p style={{ color: '#666', lineHeight: 1.75, fontSize: 15, maxWidth: 680 }}>
            {dataset?.notes || 'No description available.'}
          </p>
          {dataset?.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {dataset.tags.map((tag: any) => (
                <span key={tag.id} style={{ fontSize: 12, background: '#f0f0eb', color: '#666', padding: '4px 12px', borderRadius: 100 }}>
                  {tag.display_name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* STATS SUMMARY */}
        {(totalRows !== null || columns.length > 0) && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'Total Rows', value: totalRows?.toLocaleString() ?? '—' },
              { label: 'Columns', value: columns.length || '—' },
              { label: 'Resources', value: dataset?.resources?.length ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#fff', border: '1px solid #e8e4dc', borderRadius: 10, padding: '16px 24px', minWidth: 120 }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#1a6b3c', letterSpacing: '-1px' }}>{value}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* DATA PREVIEW */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e4dc', marginBottom: 28, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0ece4' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Data Preview</h2>
          </div>
          {previewLoading ? (
            <div style={{ padding: 32, color: '#aaa', fontSize: 14 }}>Loading preview...</div>
          ) : preview.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#faf9f6' }}>
                      {columns.map(col => (
                        <th key={col} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #eee', whiteSpace: 'nowrap' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#faf9f6' }}>
                        {columns.map(col => (
                          <td key={col} style={{ padding: '10px 16px', color: '#444', borderBottom: '1px solid #f0ece4', whiteSpace: 'nowrap', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {String(row[col] ?? '—')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding: '10px 16px', background: '#faf9f6', borderTop: '1px solid #f0ece4', fontSize: 12, color: '#aaa' }}>
                Showing 5 of {totalRows?.toLocaleString()} rows
              </div>
            </>
          ) : (
            <div style={{ padding: 32, color: '#aaa', fontSize: 14 }}>
              Preview not available — dataset has not been loaded into the DataStore yet.
            </div>
          )}
        </div>

        {/* DOWNLOADS */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e4dc', marginBottom: 28, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0ece4' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Downloads</h2>
          </div>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dataset?.resources?.map((r: any) => (
              <a key={r.id} href={r.url} target="_blank"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, border: '1px solid #eee', textDecoration: 'none', color: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1a6b3c'; (e.currentTarget as HTMLElement).style.background = '#f0faf4'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#eee'; (e.currentTarget as HTMLElement).style.background = '#fff'; }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#1a6b3c', padding: '3px 10px', borderRadius: 6 }}>
                  {r.format || 'FILE'}
                </span>
                <span style={{ fontSize: 14, color: '#333', flex: 1, fontWeight: 500 }}>{r.name || 'Download file'}</span>
                <span style={{ color: '#1a6b3c', fontSize: 16 }}>↓</span>
              </a>
            ))}
          </div>
        </div>

        {/* METADATA */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8e4dc', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0ece4' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Dataset Info</h2>
          </div>
          <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              ['License', dataset?.license_title || '—'],
              ['Organization', dataset?.organization?.title || '—'],
              ['Created', dataset?.metadata_created?.split('T')[0] || '—'],
              ['Last Updated', dataset?.metadata_modified?.split('T')[0] || '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
export default function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span className="sb-indicators">
        {/* Signal — 4 bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden="true">
          <rect x="0" y="7.5" width="3" height="3.5" rx="0.7" fill="currentColor" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.7" fill="currentColor" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.7" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.7" fill="currentColor" />
        </svg>
        {/* Wi-Fi */}
        <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M1.2 4.3a10.5 10.5 0 0 1 13.6 0" />
          <path d="M3.4 6.7a7 7 0 0 1 9.2 0" />
          <path d="M5.6 9.1a3.5 3.5 0 0 1 4.8 0" />
          <circle cx="8" cy="11" r="0.9" fill="currentColor" stroke="none" />
        </svg>
        {/* Battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" ry="3.5" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <rect x="2" y="2" width="19" height="9" rx="2" ry="2" fill="currentColor" />
          <rect x="23.5" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.35" />
        </svg>
      </span>
    </div>
  );
}

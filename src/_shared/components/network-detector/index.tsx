// 'use client';

// import { ReactNode, useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Wifi, WifiOff, RefreshCw, X } from 'lucide-react';
// import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

// type NetworkDetectorProps = {
//   children: ReactNode;
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // HOOK — native browser online/offline detection
// // ═══════════════════════════════════════════════════════════════════════════

// const useNetworkStatus = () => {
//   const [isOnline, setIsOnline] = useState(true);

//   useEffect(() => {
//     // Set initial state from browser
//     setIsOnline(navigator.onLine);

//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   return isOnline;
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // OFFLINE BANNER (mobile — slides down from top)
// // ═══════════════════════════════════════════════════════════════════════════

// const OfflineBanner = ({ onRefresh }: { onRefresh: () => void }) => (
//   <motion.div
//     initial={{ y: -60, opacity: 0 }}
//     animate={{ y: 0, opacity: 1 }}
//     exit={{ y: -60, opacity: 0 }}
//     transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//     className="fixed top-0 left-0 right-0 z-[99999] safe-area-top"
//   >
//     <div className="bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg shadow-red-500/20">
//       <div className="flex items-center gap-2.5 min-w-0">
//         <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
//           <WifiOff size={14} className="text-white" />
//         </div>
//         <p className="text-[13px] font-medium text-white truncate">
//           You&apos;re offline. Check your connection.
//         </p>
//       </div>
//       <button
//         onClick={onRefresh}
//         className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-[12px] font-semibold text-white transition-colors flex-shrink-0"
//       >
//         <RefreshCw size={12} />
//         Retry
//       </button>
//     </div>
//   </motion.div>
// );

// // ═══════════════════════════════════════════════════════════════════════════
// // OFFLINE TOAST (desktop — bottom-right floating card)
// // ═══════════════════════════════════════════════════════════════════════════

// const OfflineToast = ({
//   onRefresh,
//   onDismiss,
// }: {
//   onRefresh: () => void;
//   onDismiss: () => void;
// }) => (
//   <motion.div
//     initial={{ x: 80, opacity: 0, scale: 0.95 }}
//     animate={{ x: 0, opacity: 1, scale: 1 }}
//     exit={{ x: 80, opacity: 0, scale: 0.95 }}
//     transition={{ type: 'spring', damping: 22, stiffness: 280 }}
//     className="fixed bottom-6 right-6 z-[99999] w-[340px]"
//   >
//     <div className="relative overflow-hidden bg-white dark:bg-neutral-900 rounded-2xl border border-red-100 dark:border-red-900/40 shadow-xl shadow-red-500/10">
//       {/* Animated top accent */}
//       <div className="h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-400">
//         <motion.div
//           className="h-full w-1/3 bg-white/30 rounded-full"
//           animate={{ x: ['0%', '200%', '0%'] }}
//           transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
//         />
//       </div>

//       <div className="p-4">
//         <div className="flex items-start gap-3">
//           {/* Pulsing icon */}
//           <div className="relative flex-shrink-0 mt-0.5">
//             <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
//               <WifiOff size={18} className="text-red-500" />
//             </div>
//             <motion.div
//               className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500"
//               animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
//               transition={{ duration: 1.5, repeat: Infinity }}
//             />
//           </div>

//           <div className="flex-1 min-w-0">
//             <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
//               No internet connection
//             </h4>
//             <p className="text-[12px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
//               Check your Wi-Fi or mobile data and try again.
//             </p>
//           </div>

//           {/* Dismiss */}
//           <button
//             onClick={onDismiss}
//             className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0 -mt-0.5 -mr-1"
//           >
//             <X size={14} className="text-neutral-400" />
//           </button>
//         </div>

//         {/* Action */}
//         <button
//           onClick={onRefresh}
//           className="mt-3 w-full py-2.5 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
//         >
//           <RefreshCw size={14} />
//           Refresh page
//         </button>
//       </div>
//     </div>
//   </motion.div>
// );

// // ═══════════════════════════════════════════════════════════════════════════
// // BACK ONLINE TOAST
// // ═══════════════════════════════════════════════════════════════════════════

// const BackOnlineToast = ({ isMobile }: { isMobile: boolean }) => {
//   if (isMobile) {
//     return (
//       <motion.div
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         exit={{ y: -50, opacity: 0 }}
//         transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//         className="fixed top-0 left-0 right-0 z-[99999] safe-area-top"
//       >
//         <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20">
//           <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
//             <Wifi size={13} className="text-white" />
//           </div>
//           <p className="text-[13px] font-medium text-white">Back online</p>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ x: 80, opacity: 0, scale: 0.95 }}
//       animate={{ x: 0, opacity: 1, scale: 1 }}
//       exit={{ x: 80, opacity: 0, scale: 0.95 }}
//       transition={{ type: 'spring', damping: 22, stiffness: 280 }}
//       className="fixed bottom-6 right-6 z-[99999]"
//     >
//       <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 shadow-xl shadow-emerald-500/10 pl-4 pr-5 py-3.5">
//         <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
//           <Wifi size={16} className="text-emerald-500" />
//         </div>
//         <div>
//           <p className="text-sm font-semibold text-neutral-900 dark:text-white">Connection restored</p>
//           <p className="text-[11px] text-neutral-400 mt-0.5">You&apos;re back online</p>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════

// const NetworkDetector = ({ children }: NetworkDetectorProps) => {
//   const isOnline = useNetworkStatus();
//   const isMobile = useMediaQuery(mediaSize.mobile);
//   const [dismissed, setDismissed] = useState(false);
//   const [showBackOnline, setShowBackOnline] = useState(false);
//   const prevOnlineRef = useRef<boolean | null>(null);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     // Skip first render
//     if (prevOnlineRef.current === null) {
//       prevOnlineRef.current = isOnline;
//       return;
//     }

//     // Went offline
//     if (!isOnline && prevOnlineRef.current) {
//       setDismissed(false);
//       setShowBackOnline(false);
//       if (timerRef.current) clearTimeout(timerRef.current);
//     }

//     // Came back online
//     if (isOnline && !prevOnlineRef.current) {
//       setShowBackOnline(true);
//       timerRef.current = setTimeout(() => {
//         setShowBackOnline(false);
//       }, 3000);
//     }

//     prevOnlineRef.current = isOnline;

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [isOnline]);

//   const handleRefresh = useCallback(() => window.location.reload(), []);

//   return (
//     <>
//       {children}

//       <AnimatePresence mode="wait">
//         {!isOnline &&
//           !dismissed &&
//           (isMobile ? (
//             <OfflineBanner key="offline-mobile" onRefresh={handleRefresh} />
//           ) : (
//             <OfflineToast
//               key="offline-desktop"
//               onRefresh={handleRefresh}
//               onDismiss={() => setDismissed(true)}
//             />
//           ))}

//         {isOnline && showBackOnline && <BackOnlineToast key="online" isMobile={isMobile} />}
//       </AnimatePresence>
//     </>
//   );
// };

// export default NetworkDetector;

import { Detector } from 'react-detect-offline';
import { ReactNode } from 'react';
import { App } from 'antd';
import { WifiOff, Wifi } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

type NetWorkDetectorType = {
  children: ReactNode;
};

const NOTIFICATION_KEY = '@@COMAKET-NETWORK';

const NetWorkDetector = (props: NetWorkDetectorType) => {
  const { children } = props;
  const { notification } = App.useApp();
  const isMobile = useMediaQuery(mediaSize.mobile);

  const onNetWorkChange = (online: boolean) => {
    if (!online) {
      notification.open({
        message: null,
        placement: isMobile ? 'top' : 'bottomRight',
        duration: 0,
        closeIcon: null,
        className: 'network-notification-offline',
        key: NOTIFICATION_KEY,
        style: {
          padding: 0,
          background: 'transparent',
          boxShadow: 'none',
          ...(isMobile ? { width: '100vw', marginInlineEnd: 0, top: 0 } : { width: 360 }),
        },
        description: (
          <div
            style={
              isMobile
                ? {
                    background: 'linear-gradient(135deg, #ef4444, #e11d48)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }
                : {
                    background: '#fff',
                    borderRadius: 16,
                    border: '1px solid #fee2e2',
                    boxShadow: '0 8px 30px rgba(239,68,68,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                  }
            }
          >
            {isMobile ? (
              /* ── Mobile: compact top bar ────────────────────── */
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <WifiOff size={14} color="#fff" />
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    You&apos;re offline
                  </span>
                </div>
                {/* <button
                  onClick={() => window.location.reload()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  <RefreshCw size={12} color="#fff" />
                  Retry
                </button> */}
              </>
            ) : (
              /* ── Desktop: rich card ─────────────────────────── */
              <>
                {/* Red accent bar */}
                <div
                  style={{
                    height: 3,
                    background: 'linear-gradient(90deg, #ef4444, #e11d48, #f87171)',
                  }}
                />
                <div
                  style={{ padding: 8, paddingTop: 8, paddingBottom: 8, background: '#fcf6f5' }}
                  // className="bg-red-200"
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {/* Icon */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: '#fef2f2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <WifiOff size={20} color="#ef4444" />
                      </div>
                      {/* Pulse dot */}
                      <div
                        style={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: '#ef4444',
                          border: '2px solid #fff',
                          animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                      />
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#111827',
                          lineHeight: 1.3,
                        }}
                      >
                        You're currently Offline
                      </p>
                      <p
                        style={{
                          margin: '4px 0 0',
                          fontSize: 12,
                          color: '#6b7280',
                          lineHeight: 1.5,
                        }}
                      >
                        Check your Wi-Fi or data connection
                      </p>
                    </div>
                  </div>

                  {/* Refresh button */}
                  {/* <button
                    onClick={() => window.location.reload()}
                    style={{
                      marginTop: 14,
                      width: '100%',
                      padding: '10px 0',
                      borderRadius: 12,
                      border: 'none',
                      cursor: 'pointer',
                      background: '#fef2f2',
                      color: '#dc2626',
                      fontSize: 13,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLButtonElement).style.background = '#fee2e2')
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLButtonElement).style.background = '#fef2f2')
                    }
                  >
                    <RefreshCw size={14} />
                    Refresh page
                  </button> */}
                </div>
              </>
            )}
          </div>
        ),
      });
    } else {
      notification.open({
        message: null,
        placement: isMobile ? 'top' : 'bottomRight',
        duration: 4,
        closeIcon: null,
        className: 'network-notification-online',
        key: NOTIFICATION_KEY,
        style: {
          padding: 0,
          background: 'transparent',
          boxShadow: 'none',
          ...(isMobile ? { width: '100vw', marginInlineEnd: 0, top: 0 } : { width: 320 }),
        },
        description: (
          <div
            style={
              isMobile
                ? {
                    background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }
                : {
                    background: '#fff',
                    borderRadius: 16,
                    border: '1px solid #d1fae5',
                    boxShadow: '0 8px 30px rgba(16,185,129,0.1), 0 2px 8px rgba(0,0,0,0.04)',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }
            }
          >
            {isMobile ? (
              /* ── Mobile: green top bar ──────────────────────── */
              <>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Wifi size={13} color="#fff" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Back online</span>
              </>
            ) : (
              /* ── Desktop: compact success card ──────────────── */
              <>
                <div
                  style={{
                    // width: 38,
                    // height: 38,
                    borderRadius: 10,
                    background: '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    padding: 8,
                    paddingTop: 8,
                    paddingBottom: 8,
                  }}
                  className="bg-green-200"
                >
                  <Wifi size={18} color="#10b981" />
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#111827',
                    }}
                  >
                    You're Back Online
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>
                    You&apos;re back online
                  </p>
                </div>
              </>
            )}
          </div>
        ),
      });
    }
  };

  return <Detector render={() => <>{children}</>} onChange={onNetWorkChange} />;
};

export default NetWorkDetector;

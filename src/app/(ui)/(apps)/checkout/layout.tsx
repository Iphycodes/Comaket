// Force dynamic rendering — checkout uses client-only APIs (useSearchParams, Redux, etc.)
export const dynamic = 'force-dynamic';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

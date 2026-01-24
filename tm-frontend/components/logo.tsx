export const TaskFlowLogo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <div className="rounded bg-white p-1">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#0089d1" {...props}>
        <path d="M3 3h8v8H3V3zm10 0h8v18h-8V3zM3 13h8v8H3v-8z" />
      </svg>
    </div>
  );
};

export const AtlassianLogo = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#0052CC">
      <path d="M12.1 2.3C10.2 2.3 8.3 3 6.9 4.4L2.3 9c-1.1 1.1-1.1 3 0 4.1l9.8 9.8c1.1 1.1 3 1.1 4.1 0l4.6-4.6c1.1-1.1 1.1-3 0-4.1L12.1 2.3zm2.5 13.1l-2.5 2.5-5.1-5.1 2.5-2.5 5.1 5.1z" />
    </svg>
  );
};
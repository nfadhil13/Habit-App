type CollapseProps = React.HTMLProps<HTMLDivElement> & {
  header?: React.ReactNode;
  children?: React.ReactNode;
};

export default function Collapse({
  children,
  header,
  className,
  ...classProps
}: CollapseProps) {
  return (
    <div
      tabIndex={0}
      className={`collapse collapse-arrow ${className}`}
      {...classProps}
    >
      <input type="checkbox" />
      <div className="collapse-title text-xl font-medium">{header}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
}

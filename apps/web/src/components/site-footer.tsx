export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <span>ZEROSTACK · {new Date().getFullYear()}</span>
        <div className="flex items-center gap-5">
          <a className="hover:text-foreground" href="https://github.com/zerox9dev/zerostack">GitHub</a>
          <a className="hover:text-foreground" href="https://github.com/zerox9dev/zerostack#readme">Docs</a>
          <a className="hover:text-foreground" href="https://github.com/zerox9dev/zerostack/blob/main/LICENSE">License</a>
        </div>
      </div>
    </footer>
  );
}

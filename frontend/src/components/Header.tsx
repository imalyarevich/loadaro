interface HeaderProps {
  user: { first_name: string } | null;
  remaining: number;
  onReset: () => void;
}

export function Header({ user, remaining, onReset }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        <h1>Loadaro</h1>
      </div>
      <div className="header-right">
        <span className="remaining-count">{remaining} left</span>
        {user && <span className="user-name">{user.first_name}</span>}
        <button className="reset-btn" onClick={onReset} title="Reset all loads">
          ↺
        </button>
      </div>
    </header>
  );
}
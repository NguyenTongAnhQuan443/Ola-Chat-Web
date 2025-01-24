import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <div className="d-flex flex-grow-1">
          <Sidebar />
          <main className="flex-grow-1">{children}</main>
        </div>
      </div>
    )
}
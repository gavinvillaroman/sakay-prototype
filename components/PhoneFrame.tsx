import StatusBar from "./StatusBar";
import BottomNav from "./BottomNav";

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-frame">
      <div className="phone-screen">
        <StatusBar />
        <div className="dynamic-island" aria-hidden="true" />
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
          {children}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}

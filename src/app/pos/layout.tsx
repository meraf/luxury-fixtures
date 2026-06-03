import POSSidebar from "../components/POSSidebar";

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-[#121419] min-h-screen text-white">
      <POSSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

// this is the flex handling layout to issue this we will need to wrap the children in the layout component and then we will be able to use the layout for all the pages in the pos folder
// on the next prifix the handling will acutlly be hadeded to the pos system
// on the rest of the system we will be using the default layout 
// one last thing is on the cilderins we wont be using the default layout so we will need to add the layout to the pos folder and then we will be able to use it for all the pages in the pos folder

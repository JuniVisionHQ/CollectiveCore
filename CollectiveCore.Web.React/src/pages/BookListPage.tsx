import React from 'react';
import BooksList from '../components/BooksList';
import BookDetailsPanel from '../components/BookDetailsPanel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "@/shadcn/components/ui/resizable"

export default function BookListPage() {
  return (
    <div className="myapp-bookpage-container h-[80vh] flex flex-col flex-1 min-h-0"> 
      <ResizablePanelGroup direction="horizontal" className="border flex-1 min-h-0">
        <ResizablePanel defaultSize={40} className="flex flex-col min-h-0">
          <BooksList /> {/*List of books in left panel*/}
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel defaultSize={60} className="flex flex-col min-h-0">
          <BookDetailsPanel /> {/*Book details in right panel*/}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
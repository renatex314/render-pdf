import RenderWorker from './renderWorker.js?worker';
import { useCallback, useEffect, useRef, useState } from "react";

const renderWorker = new RenderWorker();

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pdfThumbnails, setPdfThumbnails] = useState<Array<string>>([]);

  const addPdfThumbnail = useCallback((base64: string) => {
    setPdfThumbnails(pdfThumbnails => [...pdfThumbnails, base64]);
  }, []);

  const selectFiles = useCallback(() => {
    const input = inputRef?.current;

    if (input) {
      input.click();
    }
  }, []);
  
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ currentTarget: { files } }) => {
      if (files) {
        const fileList = [];
        
        for (let i = 0; i < files.length; i++) {
          fileList.push(files.item(i));
        }

        renderWorker.postMessage(fileList);
      }
    },
    []
  );

  useEffect(() => {
    renderWorker.onmessage = async ({ data }) => {
      addPdfThumbnail(data);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <input
        className="sr-only"
        type="file"
        accept="application/pdf"
        multiple
        ref={inputRef}
        onChange={onInputChange}
      />
      <button
        onClick={selectFiles}
        className="duration-150 p-2 text-white rounded-md hover:bg-blue-500 border-2 bg-blue-600"
      >
        adicionar PDF
      </button>
      <div className="mt-8 flex w-[500px] h-72 overflow-x-auto overflow-y-hidden border-2 p-2 gap-2">
        {pdfThumbnails.map((thumbnail, index) => (
          <img
            key={index}
            className="h-full object-cover border-2 w-56 rounded-md overflow-hidden shrink-0"
            src={thumbnail}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

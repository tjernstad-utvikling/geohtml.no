import { createContext, useContext, useState } from "react";

import { ContextInterface } from "./contracts";
import { File } from "../contracts/file";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const context = createContext<ContextInterface>({} as ContextInterface);

export const useFile = () => {
  return useContext(context);
};

export const FileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [files, setFiles] = useState<File[]>([]);
  const [isEdited, setIsEdited] = useState<Map<string, boolean>>(new Map());
  const [refreshIndex, setRefreshIndex] = useState<number>();

  const navigate = useNavigate();

  useHotkeys("Control+m", (e) => {
    e.preventDefault();
    newFile();
  });
  useHotkeys("Control+s", (e) => {
    e.preventDefault();
    newFile();
  });
  useHotkeys("Control+o", (e) => {
    e.preventDefault();
    getFile();
  });

  function newFile() {
    const id = uuidv4();
    setFiles((prev) => {
      return [
        ...prev,
        { id, content: "", name: "Ny fil.html", path: undefined },
      ];
    });
    navigate(`editor/${id}`);
    updateEditedStatus(id, true);
  }

  async function getFile() {
    const [fileHandle] = await window.showOpenFilePicker();
    console.log(fileHandle);
    const file = await fileHandle.getFile();
    const contents = await file.text();

    const id = uuidv4();
    setFiles((prev) => {
      return [
        ...prev,
        { id, content: contents, name: file.name, path: undefined },
      ];
    });
    navigate(`editor/${id}`);
  }

  const updateEditedStatus = (id: string, hasBeenEdited: boolean) => {
    const currentIsEdited = isEdited;

    currentIsEdited.set(id, hasBeenEdited);

    setIsEdited(currentIsEdited);
    setRefreshIndex(Date.now());
  };

  // useEffect(() => {
  //   const removeListener = electron.ipcRenderer.on('new-file', (_file) => {
  //     const id = uuidv4();
  //     if (!isFile(_file)) return;
  //     setFiles((prev) => {
  //       return [...prev, { ..._file, id }];
  //     });
  //     setActiveId(id);
  //   });
  //   return () => {
  //     if (removeListener) removeListener();
  //   };
  // }, []);

  // useEffect(() => {
  //   electron.ipcRenderer.once('save-file', (arg) => {
  //     if (!isFile(arg)) return;

  //     setFiles((fs) => {
  //       return fs.map((f) => {
  //         if (f.id === arg.id) {
  //           return arg;
  //         }
  //         return f;
  //       });
  //     });
  //   });
  // }, []);

  return (
    <context.Provider
      value={{
        files,
        isEdited,
        refreshIndex,

        updateEditedStatus,
        createNewFile: newFile,
      }}
    >
      {children}
    </context.Provider>
  );
};

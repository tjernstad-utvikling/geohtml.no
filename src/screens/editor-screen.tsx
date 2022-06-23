import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppBar from "../components/app-bar";
import Box from "@mui/material/Box";
import Editor from "../components/editor";
import { useFile } from "../context/file";

export default function EditorScreen() {
  const { createNewFile, openExistingFile, files } = useFile();

  const { id } = useParams();
  const navigate = useNavigate();

  const file = useMemo(() => {
    return files.find((f) => f.id === id);
  }, [id, files]);

  useEffect(() => {
    const file = files.find((f) => f.id === id);

    if (!file) {
      navigate("/");
    }
  }, [files, id, navigate]);

  if (!file) {
    return <div />;
  }
  return (
    <>
      <AppBar id={id} />
      <Box sx={{ paddingTop: "70px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Editor
            key={`${file.id}${file.fileHandle}`}
            file={file}
            openNewFile={createNewFile}
            openExistingFile={openExistingFile}
          />
        </div>
      </Box>
    </>
  );
}

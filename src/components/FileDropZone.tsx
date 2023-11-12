import { Box } from "@mui/material";
import { useDropzone } from "react-dropzone";

interface Prop {
  onFileSelected: (acceptedFiles: File[]) => void;
}

const FileDropZone = ({ onFileSelected }: Prop) => {
  const onDrop = (acceptedFiles: File[]) => {
    onFileSelected(acceptedFiles);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  return (
    <Box
      {...getRootProps()}
      sx={{
        borderRadius: 4,
        border: "3px dotted lightgray",
        textAlign: "center",
        p: 1,
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here</p>
      ) : (
        <p>Drag drop some files here, or click the select file </p>
      )}
    </Box>
  );
};

export default FileDropZone;

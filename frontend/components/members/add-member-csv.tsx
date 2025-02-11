"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRootContext } from "@/contexts/RootContext";
import { addMemberBulk } from "@/services/api.service"; // Assuming you have a service for adding bulk members
import { useDashboard } from "@/contexts/dashboardContext";
import Papa from "papaparse"; // CSV parsing library

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface User {
  name: string;
  email: string;
  role: "member";
}

export function AddMemberCsvDialog({
  open,
  onOpenChange,
}: AddMemberDialogProps) {
  const { setShowMessage } = useRootContext();
  const { setMembers, members } = useDashboard();
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  // Handle file drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    } else {
      setShowMessage({
        message: "Please upload a valid CSV file.",
        type: "error",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(true);
  };

  // Handle file selection via file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      setShowMessage({
        message: "Please upload a valid CSV file.",
        type: "error",
      });
    }
  };

  // Parse CSV and submit data
  const handleCsvUpload = async () => {
    if (!file) {
      setShowMessage({ message: "No file selected.", type: "error" });
      return;
    }

    try {
      setLoading(true);
      // Parse the CSV file
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result as string;
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: async (result: any) => {
            const users: User[] = result.data.map((row: any) => ({
              name: row.name,
              email: row.email,
              role: "member", // Default role
            }));

            // Call API to add members in bulk
            try {
              setLoading(true);
              const { result } = await addMemberBulk(users);
              setMembers([...result, ...members]);
              setShowMessage({
                message: "Members added successfully!",
                type: "success",
              });
              onOpenChange(false);
              setLoading(false);
            } catch (error: any) {
              setShowMessage({
                message: error?.message || "Failed to add members",
                type: "error",
              });
              setLoading(false);
            }
          },
          error: (error: any) => {
            console.log("Error parsing CSV: ", error);
            setLoading(false);
            setShowMessage({
              message: "Error parsing the CSV file.",
              type: "error",
            });
          },
        });
      };
      reader.readAsText(file);
    } catch (error) {
      setLoading(false);
      setShowMessage({ message: "Failed to add members", type: "error" });
      console.error(error);
    }
  };

  // Function to download example CSV
  const downloadExampleCsv = () => {
    const exampleData = [
      { name: "John Doe", email: "john@example.com", role: "member" },
      { name: "Jane Smith", email: "jane@example.com", role: "member" },
    ];
    const csv = Papa.unparse(exampleData, {
      quotes: true, // Add quotes around values
      quoteChar: '"', // Specify the quote character
      escapeChar: '"', // Escape special characters
      delimiter: ",", // Ensure proper CSV delimiter
      header: true, // Include headers
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "example_members.csv";
    link.click();
  };

  // if (!open) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (loading) {
          setShowMessage({
            message: "Please wait while adding members.",
            type: "info",
          });
          return;
        }
        console.log(">open>", open);
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Add Members</DialogTitle>
        </DialogHeader>

        <div
          className={`drop-zone ${
            dragging ? "dragging" : ""
          } className="flex h-[150px]  items-center justify-center rounded-md border border-dashed text-sm text-center"`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={() => setDragging(false)}
        >
          {file ? (
            <p className="text-center p-10">{file.name}</p>
          ) : dragging ? (
            <p className="text-center p-10">Drop the CSV file here</p>
          ) : (
            <p className="text-center p-10">Drag and drop a CSV file</p>
          )}
        </div>
        <p className="flex justify-center">OR</p>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input
            id="file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-4"
          />
        </div>

        <DialogFooter>
          <div className="w-full flex justify-between">
            <Button variant="link" onClick={downloadExampleCsv}>
              Download Example CSV
            </Button>
            {loading ? (
              <Button disabled={loading}>
                <span className="animate-pulse">Uploading...</span>
              </Button>
            ) : (
              <Button onClick={handleCsvUpload} disabled={!file}>
                Upload
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

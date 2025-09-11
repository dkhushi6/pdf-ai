"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import axios from "axios";
import { Paperclip } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import ChatInterface from "./chat/chat-interface";

const Upload = ({ chatId }: { chatId: string }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    if (!chatId) {
      console.error("Chat id not found for upload");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("chatId", chatId);

      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsProcessing(false);
      setShowChat(true);
    }
  };
  if (showChat) {
    return <ChatInterface chatId={chatId} />;
  }
  return (
    <div className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <Card className="vintage-shadow bg-card/80 p-8 rounded-lg border">
          <Paperclip className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-foreground mb-2">
            Upload Your PDF
          </h3>
          <p className="text-muted-foreground mb-3">
            Choose a PDF document to start your conversation
          </p>

          <div className="flex flex-col gap-3">
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              disabled={isProcessing}
              id="vintage-upload-input"
            />

            <Button
              onClick={handleFileUpload}
              disabled={isProcessing || !selectedFile}
              className="hover:scale-105"
            >
              {isProcessing ? "Processing..." : "Start Analyzing"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Upload;

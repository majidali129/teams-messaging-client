import { MessageAttachmentType } from "@/types";

export function getAttachmentType(file: File): MessageAttachmentType {
  if (file.type.startsWith("image/")) return MessageAttachmentType.image;
  if (file.type.startsWith("video/")) return MessageAttachmentType.video;
  if (file.type.startsWith("audio/")) return MessageAttachmentType.audio;
  if (file.type === "application/pdf") return MessageAttachmentType.pdf;
  throw new Error("This file type is not supported");
}

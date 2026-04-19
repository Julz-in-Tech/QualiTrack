import { createFileRoute } from "@tanstack/react-router";
import ReceivingInspection from "./ReceivingInspection.jsx";

export const Route = createFileRoute("/receiving")({
  component: ReceivingInspection,
});

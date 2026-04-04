import { useState } from "react";
import { generateSmartReply } from "@/lib/groqApi";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { RiMagicLine } from "react-icons/ri";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SmartReplyButtonProps {
  ticketTitle: string;
  ticketDescription: string;
  messages: Message[];
  onReplyGenerated: (reply: string) => void;
}

export default function SmartReplyButton({
  ticketTitle,
  ticketDescription,
  messages,
  onReplyGenerated,
}: SmartReplyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    setLoading(true);

    try {
      const reply = await generateSmartReply(
        ticketTitle,
        ticketDescription,
        messages,
      );

      onReplyGenerated(reply);
      toast.success("AI reply ready!");
    } catch {
      toast.error("Failed to generate AI reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSuggest}
      loading={loading}
      size="sm"
      variant="secondary"
    >
      <RiMagicLine />
      {loading ? "Thinking..." : "Suggest Reply"}
    </Button>
  );
}

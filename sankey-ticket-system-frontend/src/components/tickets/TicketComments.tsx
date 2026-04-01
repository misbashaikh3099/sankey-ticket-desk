"use client";

import { useState, useEffect } from "react";
import { Comment } from "@/types";
import { commentApi } from "@/lib/ticketApi";
import { useAuth } from "@/context/AuthContext";
import { Button, Card, Textarea } from "@/components/ui";
import { timeAgo } from "@/lib/utils";
import toast from "react-hot-toast";
import { RiSendPlaneLine } from "react-icons/ri";
import SmartReplyButton from "@/components/SmartReplyButton";

interface Props {
  ticketId: string;
  ticketTitle: string;
  ticketDescription: string;
  userRole: string;
}

export default function TicketComments({
  ticketId,
  ticketTitle,
  ticketDescription,
  userRole,
}: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await commentApi.get(ticketId);
      setComments(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim() || !user) return;
    setSubmitting(true);
    try {
      await commentApi.add(ticketId, user.id, message.trim(), user.name);
      setMessage("");
      await fetchComments();
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };
  type Role = "user" | "assistant";

  const aiMessages: { role: Role; content: string }[] = comments.map((c) => ({
    role: c.userName === user?.name ? "assistant" : "user",
    content: c.message,
  }));
  return (
    <Card className="p-6">
      <h3
        className="font-semibold text-white mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Comments{" "}
        {comments.length > 0 && (
          <span className="text-slate-500 font-normal text-sm ml-1">
            ({comments.length})
          </span>
        )}
      </h3>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-5 h-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">
          No comments yet. Be the first to comment.
        </p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div
                className="w-8 h-8 rounded-lg bg-brand-700 flex items-center
                justify-center text-xs font-bold text-white flex-shrink-0"
              >
                {c.userName?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">
                    {c.userName || "Unknown"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {c.createdDate ? timeAgo(c.createdDate) : ""}
                  </span>
                </div>
                <p className="text-sm text-slate-300 break-words">
                  {c.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        className="space-y-3 border-t pt-5"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Smart Reply — only for VENDOR */}
        {userRole === "VENDOR" && (
          <div className="flex justify-end">
            <SmartReplyButton
              ticketTitle={ticketTitle}
              ticketDescription={ticketDescription}
              messages={aiMessages}
              onReplyGenerated={(reply) => setMessage(reply)}
            />
          </div>
        )}

        <Textarea
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            loading={submitting}
            disabled={!message.trim()}
            size="sm"
          >
            <RiSendPlaneLine /> Send
          </Button>
        </div>
      </div>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Mail, MailOpen, Phone, Clock } from "lucide-react";

export function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "read" }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: "read" } : m))
        );
      }
    } catch {
      console.error("Failed to mark as read");
    }
  }

  const handleExpand = (id: string) => {
    if (expanded !== id) {
      markAsRead(id);
    }
    setExpanded(expanded === id ? null : id);
  };

  const unread = messages.filter((m) => m.status === "unread");
  const read = messages.filter((m) => m.status !== "unread");

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
        <p className="text-slate-500 mt-1">
          {unread.length} unread · {read.length} read
        </p>
      </div>

      {unread.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            Unread ({unread.length})
          </h2>
          <div className="space-y-3">
            {unread.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                isExpanded={expanded === message.id}
                onToggle={() => handleExpand(message.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-slate-400 rounded-full" />
          Read ({read.length})
        </h2>
        {read.length > 0 ? (
          <div className="space-y-3">
            {read.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                isExpanded={expanded === message.id}
                onToggle={() => handleExpand(message.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No messages yet.</p>
        )}
      </div>
    </div>
  );
}

function MessageCard({
  message,
  isExpanded,
  onToggle,
}: {
  message: any;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer transition-shadow hover:shadow-md ${
        message.status === "unread" ? "border-blue-200 bg-blue-50/30" : ""
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.status === "unread" ? "bg-blue-100" : "bg-slate-100"
              }`}
            >
              {message.status === "unread" ? (
                <Mail className="w-5 h-5 text-blue-600" />
              ) : (
                <MailOpen className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-slate-900">{message.name}</p>
                {message.status === "unread" && (
                  <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">New</Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <a
                  href={`mailto:${message.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-blue-600 transition-colors"
                >
                  {message.email}
                </a>
                {message.phone && (
                  <>
                    <span>·</span>
                    <a
                      href={`tel:${message.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {message.phone}
                    </a>
                  </>
                )}
              </div>
              {!isExpanded && (
                <p className="text-sm text-slate-600 mt-1 line-clamp-1">{message.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {new Date(message.createdAt).toLocaleDateString()}
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-slate-700 whitespace-pre-wrap text-sm">{message.message}</p>
            <div className="mt-4">
              <a
                href={`mailto:${message.email}?subject=Re: Your inquiry to Amvrakikos Fishing Trips`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

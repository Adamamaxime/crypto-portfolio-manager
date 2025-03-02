import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";
import { supabase } from "../lib/supabase";
import { LoadingSpinner } from "./common/LoadingSpinner";

type Message = {
  id: string;
  content: string;
  sender: string;
  created_at: string;
};

const Community = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user:", error);
        } else {
          setUser(data);
        }
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  const fetchMessages = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      setLoading(false)
    } else {
      setMessages(data || []);
      setLoading(false)
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && userId) {
      const { data, error } = await supabase
        .from("messages")
        .insert([{ content: newMessage, sender: userId }])
        .select();

      if (error) {
        console.error("Error sending message:", error);
      } else {
        setMessages((prevMessages) => [...prevMessages, ...(data || [])]);
        setNewMessage("");
      }
    }
  };

  useEffect(() => {
    fetchMessages();

    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            payload.new as Message,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div>
      <div className="lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="m-4 bg-white rounded-xl shadow-lg overflow-hidden h-auto flex flex-col h-[96vh]"
        >
          <div className="p-4 bg-indigo-600 text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Chat Communauté</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[80%] ">
                  <p className="font-semibold text-sm">
                    {user?.name || "Unknown"}
                  </p>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === userId
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Posez votre question..."
                className="flex-1 rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      
      {loading && (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default Community;

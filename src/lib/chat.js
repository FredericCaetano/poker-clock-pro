import { supabase } from "./supabase.js";

/**
 * chat.js — chat en direct du club, persistant en base (table
 * chat_messages), rafraîchi par sondage court côté client.
 */
export async function fetchMessages(limit = 200) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function sendMessage({ accountId, pseudo, avatarData, body }) {
  const { error } = await supabase.from("chat_messages").insert({
    account_id: accountId,
    pseudo,
    avatar_data: avatarData || null,
    body,
  });
  if (error) throw error;
}

export async function deleteMessage(id) {
  const { error } = await supabase.from("chat_messages").delete().eq("id", id);
  if (error) throw error;
}

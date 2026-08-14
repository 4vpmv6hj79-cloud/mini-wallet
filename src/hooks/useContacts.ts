"use client";

import { useState, useEffect, useCallback } from "react";
import { getContacts, addContact } from "@/services/api";
import { Contact, AsyncState } from "@/types";

// ============================================
// useContacts Hook
// Manages contact list fetching and adding
// new contacts with optimistic updates.
// ============================================

interface UseContactsReturn {
  state: AsyncState<Contact[]>;
  addNewContact: (name: string, phone: string, email?: string) => Promise<Contact | null>;
  refetch: () => void;
}

export function useContacts(): UseContactsReturn {
  const [state, setState] = useState<AsyncState<Contact[]>>({
    status: "idle",
  });

  const fetchContacts = useCallback(async () => {
    setState({ status: "loading" });

    const result = await getContacts();

    if (result.success) {
      setState({ status: "success", data: result.data });
    } else {
      setState({ status: "error", error: result.error });
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const addNewContact = async (
    name: string,
    phone: string,
    email?: string
  ): Promise<Contact | null> => {
    const result = await addContact({ name, phone, email });

    if (result.success) {
      // Optimistic update: append to current list
      if (state.status === "success") {
        setState({
          status: "success",
          data: [...state.data, result.data],
        });
      }
      return result.data;
    }

    return null;
  };

  return { state, addNewContact, refetch: fetchContacts };
}

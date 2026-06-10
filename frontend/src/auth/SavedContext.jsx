import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { getSavedProperties, saveProperty, unsaveProperty } from "../services/propertyService";

const SavedContext = createContext();

export function SavedProvider({ children }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState([]);

  // Fetch saved whenever the logged-in user changes
  useEffect(() => {
    if (!user || user.role !== "user") {
      setSavedIds([]);
      return;
    }
    const load = async () => {
      try {
        const res = await getSavedProperties(user._id);
        const ids = (res.savedProperties ?? []).map((p) =>
          typeof p === "object" ? p._id : p
        );
        setSavedIds(ids);
      } catch {
        setSavedIds([]);
      }
    };
    load();
  }, [user]);

  const toggle = async (propertyId) => {
    const isSaved = savedIds.includes(propertyId);
    setSavedIds((prev) =>
      isSaved ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
    try {
      if (isSaved) {
        await unsaveProperty(user._id, propertyId);
      } else {
        await saveProperty(user._id, propertyId);
      }
    } catch {
      // Revert on failure
      setSavedIds((prev) =>
        isSaved ? [...prev, propertyId] : prev.filter((id) => id !== propertyId)
      );
    }
  };

  return (
    <SavedContext.Provider value={{ savedIds, toggle }}>
      {children}
    </SavedContext.Provider>
  );
}

export const useSaved = () => useContext(SavedContext);
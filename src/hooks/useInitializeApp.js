import { useEffect } from "react";
import useAppStore from "../store/useAppStore";

export const useInitializeApp = () => {
  const { initializeStore, loading, error } = useAppStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return { loading, error };
};

export default useInitializeApp;

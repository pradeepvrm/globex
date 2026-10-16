import { useCallback, useEffect, useRef, useState } from "react";

const localStorageEvent = "globex:local-storage";

function readValue(key, initialValue) {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      return initialValue;
    }

    const parsedValue = JSON.parse(storedValue);
    if (Array.isArray(initialValue) && !Array.isArray(parsedValue)) {
      console.error(`Saved "${key}" data is invalid; using the supplied fallback.`);
      return initialValue;
    }
    return parsedValue;
  } catch (error) {
    console.error(`Unable to read "${key}" from localStorage.`, error);
    return initialValue;
  }
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));
  const [storageError, setStorageError] = useState("");
  const valueRef = useRef(value);

  const updateValue = useCallback((nextValue) => {
    try {
      const updatedValue = typeof nextValue === "function" ? nextValue(valueRef.current) : nextValue;
      window.localStorage.setItem(key, JSON.stringify(updatedValue));
      valueRef.current = updatedValue;
      setValue(updatedValue);
      setStorageError("");
      window.dispatchEvent(new CustomEvent(localStorageEvent, { detail: { key, value: updatedValue } }));
      return true;
    } catch (error) {
      console.error(`Unable to save "${key}" to localStorage.`, error);
      setStorageError("Your changes could not be saved on this device.");
      return false;
    }
  }, [key]);

  const initialValueRef = useRef(initialValue);
  useEffect(() => {
    function syncValue(event) {
      if (event.type === "storage" && event.key !== key && event.key !== null) {
        return;
      }

      const eventKey = event.type === "storage" ? event.key : event.detail?.key;
      if (eventKey !== key) {
        return;
      }

      if (event.type === "storage") {
        const updatedValue = readValue(key, initialValueRef.current);
        valueRef.current = updatedValue;
        setValue(updatedValue);
      } else {
        valueRef.current = event.detail.value;
        setValue(event.detail.value);
      }
    }

    window.addEventListener("storage", syncValue);
    window.addEventListener(localStorageEvent, syncValue);
    return () => {
      window.removeEventListener("storage", syncValue);
      window.removeEventListener(localStorageEvent, syncValue);
    };
  }, [key]);

  return [value, updateValue, storageError];
}

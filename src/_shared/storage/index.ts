import { filter, isEmpty, isFunction, isPlainObject, omit as lodashOmit, pick } from 'lodash';

export interface StorageSetEvent {
  detail: { state: any; storageKey: string; staleState: any };
  bubbles: boolean;
}

export interface StorageUpdateEvent {
  detail: { state: any; storageKey: string; staleState: any };
  bubbles: boolean;
}

export interface StorageGetEvent {
  detail: { data: any; storageKey: string };
  bubbles: boolean;
}

export interface StorageRemoveEvent {
  detail: { storageKey: string };
  bubbles: boolean;
}

export interface EventType {
  get?: string;
  set?: string;
  update?: string;
  remove?: string;
  removeOne?: string;
}

enum StorageEvents {
  get = 'giro-client-storage/get',
  set = 'giro-client-storage/set',
  update = 'giro-client-storage/update',
  remove = 'giro-client-storage/remove',
  removeOne = 'giro-client-storage/remove-one',
}

export interface StorageAPI {
  get: () => any;
  set: (data: any) => void;
  update: (updateData: any) => void;
  removeOne: (key: string | string[], removeFn?: (value: any) => any) => void;
  remove: () => void;
  clear: () => void;
  keepOnly: (keys: string[]) => void;
  pick: (keys: string[]) => void;
  hasKey: (keys: string) => void;
  isEmpty: (keys: string) => void;
  removeAll: (keys: string[]) => void;
}

const Storage = (storageKey: string, _events?: EventType): StorageAPI => {
  const storage = typeof window !== 'undefined' && localStorage.getItem(storageKey);
  const events = Object.assign({}, StorageEvents, _events);
  if (!storageKey) throw new Error('Invalid storage key');

  return {
    set: (data: any) => {
      localStorage.setItem(storageKey, JSON.stringify(data));
      const eventInit: StorageSetEvent = {
        detail: {
          state: JSON.parse((localStorage.getItem(storageKey) ?? '{}') as string),
          storageKey,
          staleState: JSON.parse(storage || '{}'),
        },
        bubbles: true,
      };
      const postEvent = new CustomEvent(events.set, eventInit);
      document.dispatchEvent(postEvent);
    },
    get: () => {
      const storage = localStorage.getItem(storageKey);
      if (storage) {
        const data = JSON.parse(storage ?? '{}');
        const eventInit: StorageGetEvent = {
          detail: { data, storageKey: storageKey },
          bubbles: true,
        };
        const pullEvent = new CustomEvent(events.get, eventInit);
        document.dispatchEvent(pullEvent);
        return data;
      }
      return null;
    },
    update: (updateCallback: (prevState: any) => any) => {
      const storage = localStorage.getItem(storageKey);
      if (storage && isFunction(updateCallback)) {
        const storageValue = JSON.parse(storage || '{}');
        const updatedState = updateCallback(storageValue);

        localStorage.setItem(storageKey, JSON.stringify(updatedState));

        // Dispatch event after completion
        const eventInit: StorageUpdateEvent = {
          detail: {
            state: JSON.parse((localStorage.getItem(storageKey) || '{}') as string),
            storageKey,
            staleState: storageValue,
          },
          bubbles: true,
        };
        const updateEvent = new CustomEvent(events.update, eventInit);
        document.dispatchEvent(updateEvent);
      }
    },
    removeOne: (key: string | string[], removeFn?: (value: any) => any) => {
      const storage = localStorage.getItem(storageKey);

      if (storage && key) {
        const storageValue = JSON.parse(storage);
        if (isPlainObject(storageValue)) {
          const newStorageValue = JSON.stringify(lodashOmit(storageValue, key));
          localStorage.setItem(storageKey, newStorageValue);
        }

        if (Array.isArray(storageValue) && removeFn) {
          const newStorageValue = JSON.stringify(filter(storageValue, removeFn));
          localStorage.setItem(storageKey, newStorageValue);
        }

        const eventInit: StorageRemoveEvent = {
          detail: { storageKey: storageKey },
          bubbles: true,
        };
        const removeEvent = new CustomEvent(events.removeOne, eventInit);
        document.dispatchEvent(removeEvent);
      }
    },
    remove: () => {
      const eventInit: StorageRemoveEvent = {
        detail: { storageKey: storageKey },
        bubbles: true,
      };
      const removeEvent = new CustomEvent(events.remove, eventInit);
      localStorage.removeItem(storageKey);
      document.dispatchEvent(removeEvent);
    },
    clear: () => {
      localStorage.removeItem(storageKey);
    },
    keepOnly: (keys: string[]) => {
      const values = pick(localStorage, keys);
      localStorage.clear();
      for (const key in values) {
        localStorage.setItem(key, values[key]);
      }
      return values;
    },
    pick: (keys: string[]) => {
      return pick(localStorage, keys);
    },
    hasKey: (key: string) => {
      return key in localStorage;
    },
    isEmpty: (key: string) => {
      return isEmpty(localStorage.getItem(key));
    },
    removeAll: (keys: string[]) => {
      keys.forEach((key) => localStorage.removeItem(key));
    },
  };
};

export { Storage, StorageEvents };

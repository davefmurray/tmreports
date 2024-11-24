import { differenceInHours, format } from "date-fns";

export const storageGet = (key: string): Promise<any> =>
  new Promise((resolve) =>
    chrome.storage.local.get(key).then((data) => resolve(data[key]))
  );

export const cacheExpired = async (): Promise<any> => {
  const updatedAt = await storageGet("updated_at");

  return new Promise((resolve) => {
    if (!updatedAt) {
      // check if updated_at value not set
      chrome.storage.local.set({
        updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx"),
      });
      resolve(true);
    } else {
      const hours = differenceInHours(updatedAt, new Date()) ?? 0;

      if (hours < 2) {
        // check if current updated_at is expired by 2h
        resolve(false);
      } else {
        // check if current updated_at is expired by 1h
        chrome.storage.local.set({
          updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        });
        resolve(true);
      }
    }
  });
};

declare module "stein-js-client" {
  export default class SteinStore {
    constructor(storageURL: string);
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    read<T extends Object>(
      sheetName: string,
      option?: {
        limit?: number;
        offset?: number;
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        search?: Record<string, any>;
        authentication?: {
          username: string;
          password: string;
        };
      },
    ): Promise<Array<T>>;
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    append<T extends Object>(
      sheetName: string,
      row: T,
      option?: {
        authentication?: {
          username: string;
          password: string;
        };
      },
    ): Promise<{
      updatedRange: string;
    }>;
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    edit<T extends Object>(
      sheetName: string,
      option: {
        search: Partial<T>;
        set: Partial<T>;
        limit?: number;
        authentication?: {
          username: string;
          password: string;
        };
      },
    ): Promise<{
      updatedRange: string;
    }>;
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    delete<T extends Object>(
      sheetName: string,
      option: {
        search: Partial<T>;
        limit?: number;
        authentication?: {
          username: string;
          password: string;
        };
      },
    ): Promise<{
      clearedRowsCount: number;
    }>;
  }
}

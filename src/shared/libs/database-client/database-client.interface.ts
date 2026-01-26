export interface DatabaseClient {
  connect(uri: string): Promise<boolean>;
  disconnect(): Promise<void>;
}

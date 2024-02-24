export interface Todo {
  id: string;
  title: string;
}

export enum Method{
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    OPTIONS = 'OPTIONS'
}

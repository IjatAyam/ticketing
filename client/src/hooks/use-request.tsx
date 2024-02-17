import { ReactElement, useState } from 'react';
import axios from 'axios';

type Method = 'get' | 'post' | 'put' | 'delete';

type Props = {
  body?: {};
  method: Method;
  url: string;
  onSuccess?: (data: any) => void;
};

export default function useRequest({ body, method, url, onSuccess }: Props) {
  const [errors, setErrors] = useState<ReactElement | null>(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, {
        ...body,
        ...props,
      });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data.errors) {
        setErrors(
          <div className="bg-red-500 p-4 rounded-xl">
            <h4>Ooops....</h4>
            <ul className="my-0">
              {error.response.data.errors.map((err: { message: string }) => (
                <li key={err.message} className="list-disc ml-5">
                  {err.message}
                </li>
              ))}
            </ul>
          </div>,
        );
      }
    }
  };

  return { doRequest, errors };
}

import axios, { AxiosRequestConfig } from 'axios';

type Args = {
  headers: NonNullable<AxiosRequestConfig['headers']>;
};

export default function buildClient({ headers }: Args) {
  return axios.create({
    baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
    headers,
  });
}

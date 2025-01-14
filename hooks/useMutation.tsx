
import React from "react";
import { useMutation } from "@tanstack/react-query";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../api/axios";
import { ApiResponse, ApiResponseError } from "../types";


// Define a generic type for the mutation request
interface MutateRequest<Response, Payload> {
  type: "post" | "delete" | "patch" | "get"| "put";
  url: string;
  //   mutationFn: (payload: Payload) => Promise<Response>;
}

const useMutate = <Response, Payload>({
  type,
  url,
}: //   mutationFn,
MutateRequest<Response, Payload>) => {
  const { data:resp, mutateAsync, isPending, error } = useMutation<
  ApiResponse<Response>,
  ApiResponseError,
  Payload
  >({
    mutationFn: async (payload: Payload) => {
      // console.log(type, "type") 
      // Handle different HTTP methods dynamically
      switch (type) {
          case "post":
       return await postRequest(url, payload);  
        case "put":
       return  await putRequest(url, payload);
        case "patch":
        return await patchRequest(url, payload);
        case "delete":
         return await deleteRequest(url, payload);
        case "get":
          return await getRequest(url);
        default:
          throw new Error("Unsupported HTTP method");
        // return
      }
    },
  });
    
    const data = resp?.data



  return { data, mutateAsync, isPending, error };
};

export default useMutate;



import React from 'react';


export const AlertContext = React.createContext({
  Type: "success",
  message: new String(""),
  sendMessage: (mssg: String, Type: "success" | "error") => {}
});
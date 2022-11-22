import { useContext } from "react";
import MainContext from "./MainContext";

const useMainContext = () => {
    const context = useContext(MainContext)
    if (!context) {
      throw new Error(
        "useMainContext doit être utilisé dans le context adéquat"
      )
    }
  
    return context
}

export default useMainContext;
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <main>
      <RouterProvider router={router} />
      <Toaster 
        position="bottom-center"
      />
    </main>
  );
};

export default App;
